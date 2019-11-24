
//test
//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
let app = getApp();
// let domain = "http://47.103.63.213/eapp-corp";
let url = app.globalData.domain + '/login.php';

Page({ 
  
    data:{
        corpId: '', 
        authCode:'',
        userId:'',
        userName:'',
        hideList: true,
        picturePaths:["http://liuzheng750417.imwork.net:8088/resources/background00.jpg",
            "http://liuzheng750417.imwork.net:8088/resources/background01.jpg",
            "http://liuzheng750417.imwork.net:8088/resources/background02.jpg",
            "http://liuzheng750417.imwork.net:8088/resources/background03.jpg",
        ],
        pathIndex:0,//默认图片的路径
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
        //产生图片随机数
        const pathIndex =Math.round(Math.random()*(this.data.picturePaths.length-1));
        this.setData({
            corpId: app.globalData.corpId,
            userId:app.globalData.userId,
            userName:app.globalData.username,
            pathIndex:pathIndex,
        })
        
        // dd.alert({content: "step1"})
    },
   /* //每次出现index.page时更改背景图
    onShow(){
        //产生图片随机数
        const pathIndex =Math.round(Math.random()*(this.data.picturePaths.length-1));
        this.setData({
            pathIndex:pathIndex,
        })
    }*/

})