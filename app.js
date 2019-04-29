//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
let domain = "http://r1w8478651.imwork.net:9998/eapp-corp";
// let domain = "http://106.81.228.64/eapp-corp";

let url = domain + '/login.php'; 

App({ 
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
    // this.globalData.corpId ='ding1fdec36666e1349d35c2f4657eb6378f' ;
    this.loginSystem();
  },
  onShow() { 
  // dd.alert({content:'应用打开了'});
    console.log('App Show'); 
  },
  onHide() {
  dd.alert({content:'应用到后台了'});
    console.log('App Hide');
  },
  onError(msg){
      console.log(msg);
  },
  globalData: {
    corpId:'',
    username:'',
    userId:''
  },
  loginSystem() {
        dd.showLoading();  
        dd.getAuthCode({
            success: (res) => {
                // dd.alert({content: "step1"+res.authCode});
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                        dd.alert({content: "step2"});
                        console.log('success----', res)
                        let userId = res.data.result.userId;
                        let userName = res.data.result.userName;
                        const app = getApp();
                        app.globalData.userId = userId;
                        app.globalData.username = userName;
                        dd.switchTab({
                            url: '/page/grid/index'
                        })                    },
                    fail: (res) => {
                        console.log("httpRequestFail---", res)
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }

                });
            }
        })
    },
});