Page({
  data: {extraContent:"extracontent1",
	value:1},
  onLoad() {},
  onShowCounter(componentValue){
		dd.alert({"content":"this is "+componentValue});
		this.setData({value  :componentValue})
		}
});
