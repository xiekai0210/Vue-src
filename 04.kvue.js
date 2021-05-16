// KVue
class KVue {
  constructor(options) {
    // 保存选项
    this.$options = options
    this.$data = this.$options.data

    // 响应化处理
    observe(this.$data)

    // 添加代理
    proxy(this)

    // 创建编译器的实例
    new Compile(this.$options.el, this)
  }
}

function proxy(vm) {
  Object.keys(vm.$data).forEach(sourceKey=> {
    Object.defineProperty(vm, sourceKey, {
      get() {
        return vm.$data[sourceKey]
      },

      set(newVal) {
        vm.$data[sourceKey] = newVal
      }
    })
  })
}

// 数据响应式
function defineReactive(obj, key, val) {
  // 递归调用，val可能是对象的情况
  observe(val)

  // 创建一个dep和当前key一一对应
  const dep = new Dep()


  Object.defineProperty(obj, key, {
    get() {
      console.log(`get: ${key} val is ${val}`);

      // 核心的依赖收集逻辑
      Dep.target && dep.addDep(Dep.target)
      return val;
    },

    set(newVal) {
      if (newVal !== val) {
        console.log(`set: ${key} newval is ${newVal}`);
        observe(newVal)
        val = newVal

        dep.notify()
      }
    }
  })
}

// 循环定义数据响应式
function observe(data) {
  if (typeof data !== 'object' || data === null) {
    return
  }

  Object.keys(data).forEach(element => {
    defineReactive(data, element, data[element])
  });
}

// 观察者： 保存更新函数，值发生变化调用更新函数
const watchers = []
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn

    watchers.push(this)

    // Dep.target静态属性上设置当前watcher实例
    Dep.target = this
    this.vm[this.key] // 读取操作 触发getter
    Dep.target = null
  }

  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// Dep: 依赖，管理某个key相关所有的Wathcer实例
class Dep {
  constructor() {
    this.deps = []
  }

  addDep(dep) {
    this.deps.push(dep)
  }

  notify() {
    this.deps.forEach(dep => dep.update())
  }
}