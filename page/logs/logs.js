Page({
  data: {
    extraContent:"extracontent1",
  // url:"http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme=日程方案&script=转到日历详情php&param=朱祥见%202018-9-6&user=&pwd="
  //    url:"http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme="+encodeURIComponent("日程方案")+"&script="+encodeURIComponent("转到日历详情php")+"&param="+encodeURIComponent("朱祥见%202018-9-6")+"&user=&pwd=&t=1234"
      },
  onLoad(query) {
      // let url="https://filemaker.ckkj.net.cn:8890/v0.5.3/index.php?m=remotesign&a=showdistanceandtime&save=1&calendarID="+query.calendarID
      let url="https://filemaker.ckkj.net.cn:8890/corp_php-master/RemoteSign/showdistanceandtime.html?save=0&calendarID="+query.calendarID

      this.setData({
      // url:'https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?showmenu=false&dd_share=false&corpid='+app.globalData.corpId+'&swform=abc#/upcoming',
      // url:'https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?showmenu=true&dd_share=false&dd_progress=false&back=native&corpid='+app.globalData.corpId+'&swform=abc#/approval?procinsld=937909d8-b20b-4e5a-9783-735f40e1ef8d',
			url:url,
  })},
  // onShowCounter(){dd.alert({"content":"this is "+this.data.extraContent});}
});

