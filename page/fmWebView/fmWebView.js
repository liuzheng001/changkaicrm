Page({
  data: {
      },
  onLoad(query) {
      //检查当前user与storage中的user是否一致;
      const app = getApp();
      const username = app.globalData.username;

      //调试
      // const username = "刘帅";

      const res = dd.getStorageSync({ key: 'userAndPwd' })
      const pwd = res.data.pass;
      // const user = res.data.user;

      // dd.alert({content:JSON.stringify(res)})

     /* if (user !== username) {
          dd.alert({content:'登录用户已经改变,请重新输入FM密码'})
          dd.navigateBack();
      }*/

      //不使用encodeURIComponent在iphone中不能正常显示
      // const url = "http://r1w8478651.imwork.net:591/fmi/webd/";
      // const url = "http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme=" + encodeURIComponent(query.filename) + "&script=&param=&user=" + encodeURIComponent(username) + "&pwd=" + pwd;

      const url = app.globalData.domain+"/openfm.html?t=123456789&programme=" + encodeURIComponent(query.filename) + "&script=&param=&user=" + encodeURIComponent(username) + "&pwd=" + pwd;
      // const url = "https://filemaker.ckkj.net.cn:8890/corp_php-master/getNavigatorMess.html";

      this.setData({
          url: url,
      })
  },
    //closepage向小程序发出信息
    onMessage(e){
        dd.alert({
            content:JSON.stringify(e.detail),
            success:()=>{
                dd.switchTab({
                    url: '/page/FMCategory/FMCategory'
                })
            }
        });
    }

});


