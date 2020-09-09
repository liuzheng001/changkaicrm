/*//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
// let domain = "http://47.103.63.213/eapp-corp";
let domain = "http://r1w8478651.imwork.net:9998/eapp-corp";
//test git,回复
let url = domain + '/login.php'; */

let development = true; //开发环境为true,工厂环境为false,工厂环境服务器是47.103.63.213
let domain,applicationServer;
if (development===true){
    domain = "http://r1w8478651.imwork.net:9998/eapp-corp";
    applicationServer = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/"
} else{
    domain = "http://47.103.63.213/eapp-corp";
    // domain = "https://www.ckkj.net.cn/eapp-corp";//阿里云已安装ssl证书,已知错误getFMmessage时,第一次不能得到customer清单,第二次可以,原因不明
    applicationServer = "https://filemaker.ckkj.net.cn:8890/corp_php-master/"
}
let url = domain + '/login.php';

App({  
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
        
    //调试关闭
    this.globalData.corpId = options.query.corpId;

    //调试打开
    // this.globalData.corpId ='ding1fdec36666e1349d35c2f4657eb6378f' ;
    
    //调试关闭，不调用后台
    this.loginSystem();
  }, 
  onShow() { 
  // dd.alert({content:'应用打开了'});
  //   console.log('App Show');
  },
  onHide() {
  /*dd.alert({content:'应用到后台了'});
    console.log('App Hide');*/
  },
  onError(msg){
      console.log(msg);
  },
  globalData: {
    applicationServer:applicationServer,
    domain:domain,
    corpId:'',
    username:'',
    userId:'',
    departments:[],
    flashScheduleFlag:false,//刷新schedule标志,只有在schedule.js提交才能更改为true

  },
  loginSystem() {
      // dd.showLoading();
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
                        // dd.alert({content: "step2"});
                        console.log('success----', res)
                        let userId = res.data.result.userId;
                        let userName = res.data.result.userName;
                        const app = getApp();
                        app.globalData.userId = userId;
                        app.globalData.username = userName;
                        app.globalData.departments = res.data.result.departments;
                        // 调试时关闭getworkflow
                    //    dd.switchTab({ //日历
                    //             url: '/page/calendar/index'
                    //         })
                       /* dd.navigateTo({
                            url: "/page/calendar/editSampleRecord/sampleList/sampleList"

                        })*/
                        /*dd.navigateTo({
                            // url: '/page/calendar/selectCustomer/selectCustomer'
                            url:"/page/calendar/addSampleRecord/addSampleRecord",
                            // url:"/page/calendar/addMachine/addMachine"

                        })*/
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---", res)
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        // dd.hideLoading();
                    }

                });
            },
          fail: (err)=>{
              dd.alert({content: JSON.stringify(err)})
          }
        })
    },
});