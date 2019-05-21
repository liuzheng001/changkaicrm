Page({
  data: {
     background: ['green', 'red', 'yellow'],
    indicatorDots: true,
    autoplay: false,
    interval: 3000,
    toView:'yellow',
    scrollTop:'100',
    value:[1,0],
  },
  onLoad() {},
  changeAutoplay(){
    this.setData({autoplay:!this.data.autoplay} )
  },
  intervalChange(e){
      this.setData({interval:e.detail.value} )
  },
  scrollToTop(e) {
    console.log(e);
    this.setData({
      scrollTop: 0,
    });
  },
  //pickview 响应函数
  onChange(e) {
    console.log(e.detail.value);
    this.setData({
      value: e.detail.value,
    });
  },
  //上传,下载文件测试
  uploadFile(){
     
    dd.chooseImage({
      sourceType: ['camera', 'album'],
      count: 1,
      success: res => {
        const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);

        dd.alert({ content: `内容：${path}` });
        
        dd.uploadFile({
          url: 'http://125.86.57.200:9998/upload/upload.php',
          // url: 'http://httpbin.org/post',
          fileType: 'video',
          fileName: 'file',
          filePath: path,
          success: res => {
            console.log(JSON.parse(res.data));
            // dd.alert({ content: JSON.parse(res.data)});

            if(JSON.parse(res.data).result== "success"){
              dd.alert({ content: "上传成功" });
            }else{
               dd.alert({ content: `上传服务器失败：${JSON.stringify(res)}` });
            }
          },
          fail: function (res) {
            dd.alert({ content: `上传失败：${JSON.stringify(res)}` });
          },
        });
      },
    });
//     dd.chooseImage({
//       count: 2,
//       success: (res) => {
//         img.src = res.filePaths[0];
//       },
// });
  },
  downloadFile(){
    dd.downloadFile({
        url: 'http://img.alicdn.com/tfs/TB1x669SXXXXXbdaFXXXXXXXXXX-520-280.jpg',
        success({ filePath }) {
          dd.alert({content:filePath});
          dd.previewImage({
            urls: [filePath,],
          });
        },
        fail(res) {
          dd.alert({
            content: res.errorMessage || res.error,
          });
        },
      });
  },
  httpTest(){ //success
    // Content-Type为application/x-www-form-urlencoded即默认的接口请求方式
    dd.httpRequest({
      url: 'http://liuzheng750417.imwork.net:8088/corp_php-master/getoapibyname.php',
      method: 'POST',
      data: {
      
      },
      dataType: 'json',
      success: function(res) {
        dd.alert({content: JSON.stringify(res.data)});
      },
      fail: function(res) {
        let result = JSON.stringify(res)
        dd.alert({content: result});
      },
      // complete: function(res) {
      //   dd.alert({content: 'complete'});
      // }
    });
  },
	choosePerson:()=>{
				dd.complexChoose({
    title:"测试标题",            //标题
    multiple:true,            //是否多选
    limitTips:"超出了",          //超过限定人数返回提示
    maxUsers:1000,            //最大可选人数
    pickedUsers:[],            //已选用户
    pickedDepartments:[],          //已选部门
    disabledUsers:[],            //不可选用户
    disabledDepartments:[],        //不可选部门
    requiredUsers:[],            //必选用户（不可取消选中状态）
    requiredDepartments:[],        //必选部门（不可取消选中状态）
    permissionType:"xxx",          //可添加权限校验，选人权限，目前只有GLOBAL这个参数
    responseUserOnly:false,        //返回人，或者返回人和部门
    startWithDepartmentId:0 ,   // 0表示从企业最上层开始，-1表示从自己部门开始
    success:function(res){
        /**
        {
            selectedCount:1,                              //选择人数
            users:[{"name":"","avatar":"","userId":""}]，//返回选人的列表，列表中的对象包含name（用户名），avatar（用户头像），userId（用户工号）三个字段
            departments:[{"id":,"name":"","count":}]//返回已选部门列表，列表中每个对象包含id（部门id）、name（部门名称）、number（部门人数）
        }
        */    
			 console.log(`人员清单:${JSON.stringify(res)}`);
			 dd.alert({content:`人员清单:${JSON.stringify(res)}`});
    },
    fail:function(err){
				console.log(JSON.stringify(err));

    }
	})
	},
	sendDing:()=>{
		dd.createDing({
    users : ['1960580858678987','0968625005675565'],// 用户列表，工号
    type: 1, // 附件类型 1：image  2：link
    alertType: 2, // 钉发送方式 0:电话, 1:短信, 2:应用内
    alertDate: {"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"},
    attachment: {
        // image必填参数      
        image:[''],
        // link链接必填参数
        title: 'hello',
        url: 'http://www.163.com',
        text: 'adfd'
    }, // 附件信息
    text: '测试',  // 正文
    bizType :0, // 业务类型 0：通知DING；1：任务；2：会议；
    confInfo:{
       bizSubType:0, // 子业务类型如会议：0：预约会议；1：预约电话会议；2：预约视频会议；（注：目前只有会议才有子业务类型）
       location:'某某会议室' , //会议地点；（非必填）
       startTime:{"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"},// 会议开始时间
       endTime:{"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"}, // 会议结束时间
       remindMinutes:30, // 会前提醒。单位分钟-1：不提醒；0：事件发生时提醒；5：提前5分钟；15：提前15分钟；30：提前30分钟；60：提前1个小时；1440：提前一天；
       remindType:2 // 会议提前提醒方式。0:电话, 1:短信, 2:应用内
    },
 
    taskInfo:{
       ccUsers: ['1960580858678987','0968625005675565'], // 抄送用户列表，工号
       deadlineTime:{"format":"yyyy-MM-dd HH:mm","value":"2015-05-09 08:00"} , // 任务截止时间
       taskRemind:30// 任务提醒时间，单位分钟0：不提醒；15：提前15分钟；60：提前1个小时；180：提前3个小时；1440：提前一天；
    },
    success:function(res){
        /*
        {
        	"dingId": "1_1_a09f167xxx",
        	"text": "钉正文内容",
        	"result": true
        }
        */   
				console.log(JSON.stringify(res));

    },
    fail:function(err){
				console.log(JSON.stringify(err));

    }
});
	},
    getUserInform() { //从服务器得到用户信息
        const app = getApp();
        console.log('userID'+app.globalData.userId)
        const url = app.globalData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
              event:'get_userinfo',
              userid:app.globalData.userId
            },
            dataType: 'json',
            success: (res) => {
              dd.alert({'content':JSON.stringify(res)})
            },
            fail: (res) => {

            },
            complete: (res) => {
            }

        })
    },


});
