Page({
  data: {
    extraContent:"extracontent1",
  // url:"http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme=日程方案&script=转到日历详情php&param=朱祥见%202018-9-6&user=&pwd="
  //    url:"http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme="+encodeURIComponent("日程方案")+"&script="+encodeURIComponent("转到日历详情php")+"&param="+encodeURIComponent("朱祥见%202018-9-6")+"&user=&pwd=&t=1234"
      },
  onLoad(query) {
        // url:"https://filemaker.ckkj.net.cn:8890/v0.5.3/index.php?m=remotesign&a=showdistanceandtime&save=1&calendarID=4727",
	// let url="https://filemaker.ckkj.net.cn:8890/v0.5.3/index.php?m=remotesign&a=showdistanceandtime&save=1&calendarID="+query.calendarID
      const app =getApp();
      // const url= query.url;
  this.setData({
      url:'https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?showmenu=false&dd_share=false&corpid='+app.globalData.corpId+'&swform=abc#/upcoming',
      // url:'https://aflow.dingtalk.com/dingtalk/mobile/homepage.htm?showmenu=true&dd_share=false&dd_progress=false&back=native&corpid='+app.globalData.corpId+'&swform=abc#/approval?procinsld=937909d8-b20b-4e5a-9783-735f40e1ef8d',
			// url:url,
  })},
  onShowCounter(){dd.alert({"content":"this is "+this.data.extraContent});}
 
});

/*
(10) ["937909d8-b20b-4e5a-9783-735f40e1ef8d", "b10f2a9b-0810-4cbb-a9b0-a57f35b38581", "8efd8da4-961e-460f-a856-2dc2a984b0b4", "f3617a7e-8db2-4528-8927-2051a0291a0c", "f310bec5-365b-49a9-a724-61200df85177", "97b7c5a8-ab33-4170-b105-06c99ca60312", "d4759807-429e-499a-a5a4-3713989108b3", "8eb2bae5-7eb8-4b1e-a6ff-ff19a8d0aa3d", "d227460c-5abf-4ffc-945a-b02a0556a1f4", "aa7d3bad-4764-4848-89ff-6dff66da29a4"]*/
