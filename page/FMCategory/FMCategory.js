Page({
  data: {
    list:[
        {  fmFileName:"费用报销",
            thumb:""
        },
        {  fmFileName:"销售管理",
            thumb:""
        },
        {  fmFileName:"销售统计",
            thumb:""
        },
       {  fmFileName:"样品试用记录",
            thumb:""
        },
        {  fmFileName:"试验记录",
            thumb:""
        },

    ],
      show:false,
      height:'30%',
      passwordInput:"",
  },
  onLoad() {
      //打开tabbar记录index,下次默认打开
      dd.setStorage({
          key: 'tabbarIndex',
          data: {
              tabbarIndex:3
          },
          success: function () {
          }
      });
      //检查当前user与storage中的user是否一致;
      const app = getApp();
      const username = app.globalData.username;

      //调试
      // const username = "刘帅";
      const res = dd.getStorageSync({ key: 'userAndPwd' })
      if (res.data === null) {
          dd.alert({content:'请输入FM密码'})
          return;  
      }
      const pwd = res.data.pass;
      const user = res.data.user;

      if (user !== username) {
          dd.alert({content:'登录用户已经改变,请重新输入FM密码'})
          return;
      }else{
          this.setData({
              passwordInput: pwd,
          });
      }
  } ,
/*  onShow(){   //显示page触发
      const app = getApp();
      const username = app.globalData.username;
      if (username) {
          const res = dd.getStorageSync({ key: 'userAndPwd' })
          if (res.data === null) {
              dd.alert({content:'请输入FM密码'})
              return;
          }
          const pwd = res.data.pass;
          const user = res.data.user;

          if (user !== username) {
              dd.alert({content:'登录用户已经改变,请重新输入FM密码'})
              return;
          }else{
              this.setData({
                  passwordInput: pwd,
              });
          }
      }
  },*/
      //输入值更新
  onInput(e) {
        // debugger;
        this.setData({
            passwordInput: e.detail.value,
        });
    },
  openFM(e){
      dd.redirectTo({
          url: '/page/fmWebView/fmWebView?filename='+e.currentTarget.dataset.fileName
      })
    },
    /*openEzView() {
        dd.redirectTo({
            url: '/page/logs/logs'
        })
    },*/

    openModal(){  //显示模态框
        this.setData({
            show:true,
        });
    },

    onSavePass(){
       //模态框隐藏
       this.setData({show:false});

       const app=getApp();
       const user = app.globalData.username;
        if (!user) {
            dd.alert({content:"don't get username,exit"})
            return;}
        dd.setStorage({
            key: 'userAndPwd',
            data: {
                user: user,
                pass: this.data.passwordInput,
            },
            success: function () {
                dd.alert({content: user+':FM密码写入成功,直接可以打开相关文件'});
            },
            fail: function (err) {
                dd.alert({content: "change FM pwd failure"})
            }
        });

    },
    onCancel(){
        const res = dd.getStorageSync({ key: 'userAndPwd' })
        if (res.data === null) { //显示模态框
            this.setData({
                show:false,
            });
        }else {
            const pwd = res.data.pass;
            this.setData({
                show: false,
                passwordInput: pwd,
            });
        }
    }
});
