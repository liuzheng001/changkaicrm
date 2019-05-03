Page({
  data: {extraContent:"extracontent1",
  // url:"http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme=日程方案&script=转到日历详情php&param=朱祥见%202018-9-6&user=&pwd="
  url:"http://liuzheng750417.imwork.net:8088/ding-fm-master/openfm.html?programme="+encodeURIComponent("日程方案")+"&script="+encodeURIComponent("转到日历详情php")+"&param="+encodeURIComponent("朱祥见%202018-9-6")+"&user=&pwd=&t=1234"},
  onLoad() {console.log(this.data.herf)},
  onShowCounter(){dd.alert({"content":"this is "+this.data.extraContent});}
 
});
