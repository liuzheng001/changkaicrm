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

      //不使用encodeURIComponent在iphone中不能正常显示
      // const url = "https://filemaker.ckkj.net.cn:442/fmi/webd/";
      //测试
      // const url = "https://filemaker.ckkj.net.cn:8890/corp_php-master/openfm.html?programme=" + encodeURIComponent("费用报销") + "&script=&param=&user=" + encodeURIComponent("刘正") + "&pwd=" + "030528";
      // const url = "https://filemaker.ckkj.net.cn:8890/corp_php-master/getNavigatorMess.html";
      // const url = "http://www.163.com";

      // dd.alert({content:app.globalData.domain+"/openfm.html?t=0123456789&programme=" + query.filename + "&script=&param=&user=" + encodeURIComponent(username) + "&pwd=" + pwd})


      const url = app.globalData.domain+"/openfm.html?t=0123456789&programme=" + encodeURIComponent(query.filename) + "&script=&param=&user=" + encodeURIComponent(username) + "&pwd=" + pwd;

            // const url = app.globalData.domain+"/openfm.html?t=012&programme=" + query.filename + "&script=&param=&user=" + username + "&pwd=" + pwd;
      console.log(url);
      this.setData({
          url: url,
      })
  },
    //closepage向小程序发出信息
    // onMessage(e){
    //     dd.alert({
    //         content:JSON.stringify(e.detail),
    //         success:()=>{
    //             dd.switchTab({
    //                 url: '/page/FMCategory/FMCategory'
    //             })
    //         }
    //     });
    // }

});


