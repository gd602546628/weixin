/**
 * Created by gd on 2018/1/22/022.
 *
 * QQ浏览器和uc浏览器调用浏览器分享，其他利用 jiathis  进行分享
 * 微信端则提示用户使用右上角分享
 *
 */
import util from '../util'
import shareTip from './shareTip'

class Share {
  constructor() {
    this.defaultOptions = {
      url: '', // 分享链接
      title: '', // 标题
      description: '', //描述
      img_url: '', // 图片链接
      img_title: '', // 图片标题
      to_app: '',
      cus_txt: '',
      type: '',// 分享至 cqq  qzone  weixin
    }
  }

  getToApp(type) { // 处理to_app分享参数
    let result = ''
    let ucAndroidMap = {
      cqq: 'QQ',
      qzone: 'QZone',
      weixin: 'WechatFriends'
    }
    let ucIOSMap = {
      cqq: 'kQQ',
      qzone: 'kQZone',
      weixin: 'kWeixin'
    }
    let QQBrowserMap = {
      cqq: '4',
      qzone: '3',
      weixin: '1'
    }
    if (util.browser.isUCBrowser) { //uc浏览器分享
      result = util.browser.android ? ucAndroidMap[type] : ucIOSMap[type]
    } else if (util.browser.isQQBrowser) { // QQ浏览器分享
      result = QQBrowserMap[type]
    }
    return result
  }

  jiathis(params) {
    let url = `http://www.jiathis.com/send/?webid=${params.type}&url=${params.url}&title=${params.title}`
    console.log(url)
    window.location.href = url
  }

  _h5Share(options) {
    let params = Object.assign(this.defaultOptions, options)
    params.to_app = this.getToApp(params.type)
    if (util.browser.isQQBrowser) { //QQ浏览器
      if (window.browser && window.browser.app) {
        window.browser.app.share(params)
      } else {
        this.jiathis(params)
      }
      return
    }
    if (util.browser.isUCBrowser) {  //UC浏览器
      if ('qzone' == params.type) {
        this.jiathis(params)
      } else if (window.ucweb && window.ucweb.startRequest) {
        window.ucweb.startRequest("shell.page_share", [params.title, params.description, params.url, params.to_app, "", "@" + window.location.host, ""])
      } else if (window.ucbrowser && window.ucbrowser.web_share) {
        window.ucbrowser.web_share(params.title, params.description, params.url, params.to_app, "", "@" + window.location.host, "")
      } else {
        this.jiathis(params)
      }
      return
    }
    this.jiathis(params)
  }

  share(options) {
    if (util.browser.isWeixin) { // 微信端
      shareTip()
    } else { // 其他端
      this._h5Share(options)
    }
  }
}
export default new Share()
