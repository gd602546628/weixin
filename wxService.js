/**
 * Created by gd on 2018/1/22/022.
 */
import Api from '@/api/api'
class WxService {
  constructor() {
    this.wx = null
    this.config = {
      debug: true,
      appId: 'wxf297ce8d4d3047d7', // 必填，公众号的唯一标识
      timestamp: '', // 必填，生成签名的时间戳
      nonceStr: '', // 必填，生成签名的随机串
      signature: '',// 必填，签名，见附录1
      jsApiList: [
        'openLocation',
        'getLocation',
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    }
  }

  init() {
    if (this.wx) return this.wx
    this.wx = new Promise(async (resolve, reject) => {
      await this.getConfig()
      window.wx.config(this.config)
      wx.ready(() => {
        resolve()
      })
    })
    return this.wx
  }

  async getConfig() {
    let data = await Api.getWxConfig()
    this.config.timestamp = data.timestamp
    this.config.signature = data.signature
    this.config.nonceStr = data.nonceStr
    console.log(data)
  }

  async getLocation() {
    await this.init()
    return new Promise((resolve, reject) => {
      wx.getLocation({
        success: function (res) {
          resolve(res)
        }
      })
    })
  }

  /**
   单个功能分享  适用于针对不同端分享
   * @type onMenuShareTimeline 分享到朋友圈
   * onMenuShareAppMessage 分享给朋友
   * onMenuShareQQ 分享到QQ
   * onMenuShareWeibo 分享到微博
   * onMenuShareQZone 分享到空间
   *
   * */
  async share(type, config) {
    return new Promise(async (resolve, reject) => {
      await this.init()
      window.wx[type]({
        title: config.title,
        desc: config.description,
        link: config.url,
        imgUrl: config.img_url,
        success: () => {
          resolve()
        },
        cancel: () => {
          reject()
        }
      })
    })
  }

  /**
   * 统一所有端分享
   * **/
  async shareAll(config) {
    let map = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
    let result = []
    map.forEach(async item => {
      result.push(await this.share(item, config))
    })
    return Promise.race(result)
  }

}
export default new WxService()
