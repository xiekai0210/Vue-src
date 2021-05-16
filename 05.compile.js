// 编译器
// 递归变量dom树
// 如果是文本 判断是否是插值绑定
// 如果是元素，遍历其属性判断是指令还是事件
class Compile {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm

    if (this.$el) {
      // 执行编译
      this.compile(this.$el)
    }
  }

  compile(el) {
    // 遍历el树
    const childNodes = el.childNodes
    childNodes.forEach(node => {
      // 判断是否是元素
      if (this.isElements(node)) {
        console.log('编译元素' + node.nodeName);
        this.compileElement(node)
      } else if (this.isInter(node)) {
        console.log('编译插值绑定' + node.textContent);
        this.compileText(node)
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    });
  }

  isElements(node) {
    return node.nodeType === 1
  }

  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }

  // 元素编译
  compileElement(node) {
    // 节点是元素，遍历其属性列表
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      // 规定指令以 k-xx="oo"定义
      const attrName = attr.name   // 'k-xx'
      const exp = attr.value // '00'

      if (this.isDirective(attrName)) {
        const dir = attrName.substring(2) // xx
        // 执行指令
        this[dir] && this[dir](node, exp)
      }
    })
  }

  isDirective(attrName) {
    return attrName.indexOf('k-') === 0
  }

  update(node, exp, dir) {
    // 指令对应的更新函数xxUpdater
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])

    // 更新处理, 封装一个更新函数，可以更新对应的dom元素
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
  }

  // 元素中文本指令形式的处理逻辑
  text(node, exp) {
    this.update(node, exp, 'text')
  }

  // 插值形式的处理逻辑
  compileText(node) {
    this.update(node, RegExp.$1, 'text')
  }
  
  textUpdater(node, value) {
    node.textContent = value
  }

  // TODO 事件、双向绑定
}