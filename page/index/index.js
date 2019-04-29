let app = getApp();

//test
//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
let domain = "http://r1w8478651.imwork.net:9998/eapp-corp";
// let domain = "http://106.81.228.64/eapp-corp";

let url = domain + '/login.php'; 

Page({ 
  
    data:{
        corpId: '', 
        authCode:'',
        userId:'',
        userName:'',
        hideList: true,
        name:'world',
        items:['a','b','c',3,4,5],
        names:
        [
            { first:"liu", second:"zheng"},
             { first:"zhang",second:"sang"}
        ]
       
  },
    loginSystem() {
        dd.showLoading();
        dd.getAuthCode({
            success:(res)=>{
                this.setData({
                    authCode:res.authCode
                })
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
                        console.log('success----',res)
                        let userId = res.data.result.userId;
                        let userName = res.data.result.userName;
                        const app = getApp();
                        app.globalData.userId = userId;
                        app.globalData.username = userName;
;
                        this.setData({ 
                            userId:userId,
                            userName:userName,
                            hideList:false
                        })
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---",res)
                       dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading(); 
                    }
                    
                });
            },
            fail: (err)=>{
                // dd.alert({content: "step3"});
                dd.alert({
                    content: JSON.stringify(err)
                })
            }
        })

    },
    onLoad(){

        let _this = this;
        this.setData({
            corpId: app.globalData.corpId,
            userId:app.globalData.userId,
            userName:app.globalData.username
        })
        
        // dd.alert({content: "step1"})
    },
    changeName(){
        this.setData({
          name:'Dingtalk'
        })
    },
    changeTar(){
      // dd.switchTab({
      //   url: '/page/logs/logs',
      //   success:(res)=>{
      //           dd.alert({content:JSON.stringify(res)}) 
      //   } 
      //   })
      dd.navigateTo({
        url: '/page/logs/logs',
        success:(res)=>{
                dd.alert({content:JSON.stringify(res)}) 
        } 
        })
    },
    openMap(){
      dd.openLocation({
        longitude: '120.126293',
        latitude: '30.274653', 
        name: '黄龙万科中心',
        address: '学院路77号',
      });
      
    }
})