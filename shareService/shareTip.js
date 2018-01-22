/**
 * Created by gd on 2018/1/22/022.
 */
import ShareTip from './shareTip.vue'
import Vue from 'vue'
let Constructor = Vue.extend(ShareTip)
let shareTip = () => {
  let instance = new Constructor({el: document.createElement('div')})
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
  instance.$on('close', () => {
    document.body.removeChild(instance.$el)
    instance.visible = false
  })
  return instance
}
export default shareTip
