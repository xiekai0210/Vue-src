import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue) // 通过该方法给Vue添加_init()方法
stateMixin(Vue) // $watch, $set, $delete
eventsMixin(Vue) //$emit, $on
lifecycleMixin(Vue) // _undate()
renderMixin(Vue) // _render(), $nextTick

export default Vue
