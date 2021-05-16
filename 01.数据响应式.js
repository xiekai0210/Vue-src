// 数据响应式
function defineReactive(obj, key, val) {
  // 递归调用，val可能是对象的情况
  observe(val)

  Object.defineProperty(obj, key, {
    get() {
      console.log(`get: ${key} val is ${val}`);
      return val;
    },

    set(newVal) {
      if (newVal !== val) {
        console.log(`set: ${key} newval is ${newVal}`);
        observe(newVal)
        val = newVal
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

const obj = { foo: 'foo', bar: 'bar', baz: { a: 1 }, arr: [1,2,3] }

// 遍历做响应化处理
observe(obj)

obj.foo
obj.foo = 'fooooooooooooooo'
obj.bar
obj.bar = 'barrrrrrrrrrrrrr'

obj.baz = {a:100}
obj.baz.a = 100000

// 数组
obj.arr.push(4)