/**
 * Created by gd on 2017/12/20/020.
 */

let express = require('express')
let bodyParser = require('body-parser');
let app = express();
let request = require('request')

//bodyparser设置,获取接口入参
app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
app.use(bodyParser.json({limit: '5mb'}));

/*跨域处理*/
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
let appId = 'wxf297ce8d4d3047d7'
let appsecret = 'c1bd2bfe39e3c2039e54fe7fa889df5b'
let accessToken = ''
let jsapi_ticket = ''
let crypto = require('crypto')
let cashTime = new Date()
let expires_in = 0
let isCashToken = false
function randomString(len) {
    len = len || 16;
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        //0~32的整数
        pwd += $chars.charAt(Math.floor(Math.random() * (maxPos + 1)));
    }
    return pwd;
}
function getSha1(str) {
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    var res = sha1.digest("hex");  //加密后的值d
    return res;
}
function getAcessToken() {

    return new Promise((resolve, reject) => {
        if (accessToken && (new Date() - cashTime < expires_in)) {
            isCashToken = true
            resolve(accessToken)
            return
        }
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appsecret}`
        request(url, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let result = JSON.parse(body)
                accessToken = result.access_token
                expires_in = result.expires_in
                cashTime = new Date()
                isCashToken = false
                resolve(accessToken)
            } else {
                reject('获取失败')
            }
        })
    })
}
function getTicket(accessToken) {
    return new Promise((resolve, reject) => {
        if (jsapi_ticket && isCashToken) {
            resolve(jsapi_ticket)
            return
        }
        let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`
        request(url, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let result = JSON.parse(body)
                jsapi_ticket = result.ticket
                resolve(jsapi_ticket)
            } else {
                reject('err')
            }
        })
    })
}
// 获取签名
async function getSignature() {
    let timeTmp = new Date().getTime()
    let token = await getAcessToken()
    let jsapi_ticket = await getTicket(token)
    let nonceStr = randomString(16)
    /*
    * url需要根据环境更改
    * */
    let str = `jsapi_ticket=${jsapi_ticket}&noncestr=${nonceStr}&timestamp=${timeTmp}&url=http://gdweixin.viphk.ngrok.org/#/22`
    let signature = getSha1(str)
    return {timestamp: timeTmp, signature: signature, nonceStr: nonceStr}
}
app.post('/getSignature', async (req, res) => {
    let result = await getSignature()
    res.json(result)
})

app.listen(8888)


