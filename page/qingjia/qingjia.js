let detailed = [];
Page({
  data: {
    customList:[//客户清单
        /*{
            name: '美国',
        },
        {
            name: '中国',
        },*/
     ],
    customIndex: 0,
    picturePath:"",
      videoPath:"",
  },
  onLoad() { //从fm中读取custom值列表
      const url = getApp().globalData.domain+"/getFmMessage.php";
      dd.httpRequest({
          url: url,
          method: 'get',
          data: {
              action:'getcustomlist',
          },
          dataType: 'json',
          success: (res) => {
              // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
              this.setData({
                  customList:res.data.content.data
              });
          },
          fail: (res) => {
              dd.alert({'content':JSON.stringify(res)})
          },
          complete: (res) => {
          }

      })

  },
  customChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            customIndex: e.detail.value,
        });
    },
    formSubmit(e) { //发起审批

        const app = getApp();
        const userId = app.globalData.userId;
        const departments = app.globalData.departments;

        let that = this;
        let form = e.detail.value;
        const url = getApp().globalData.domain+"/operateWorkflow.php"
        console.log('form发生了submit事件，携带数据为：', e.detail.value);
        dd.httpRequest({
            url: url,
            method: 'POST',
            // headers:{'Content-Type': 'application/json'},
            data: {
                values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                    progress_code: "PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8",
                    originatorUserId: userId,
                    dept_id: departments[departments.length - 1],

                    form_values: [
                        {name: '["开始时间","结束时间"]', value: JSON.stringify([form.begin_time,form.finish_time])},
                        {name: "事由", value: form.reason},
                        {name: "明细表", value: [
                                [{"name": "第一行", "value": "要"},
                                    {"name": "第二行", "value": "人"}],
                                [{"name": "第一行", "value": "sdg"},
                                    {"name": "第二行", "value": "dfadf"}]
                            ]
                        },
                         {name:"图片",value:[
                            form.picture
                         ]},
                        {name:"附件",value:[
                                    {
																			// {"data":[{"spaceId":848072798,"fileId":"6602947770","fileName":"some.mp4","fileSize":4342303,"fileType":"file"}]}
                                        "spaceId":"1562091972",
                                        "fileName":"some.pdf",
                                        "fileSize":"97467",
                                        "fileType":"pdf",
                                        "fileId":"6603245738"
                                    }

                            ]}
                     ],
                })
            },
            dataType: 'json',
            traditional: true,//这里设置为true
            success: (res) => {
                if (res.data.errcode == 0){
                    dd.alert({content: "审批已发起,id:" + res.data.process_instance_id});
                }else{
                    dd.alert({content: JSON.stringify(res)});
                }

            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                dd.alert({content: JSON.stringify(res)});
            },
            complete: (res) => {
                dd.hideLoading();
            }
        });
    },
    choosePicture(){
       const t = this;
       let imageUrl;
        const app = getApp()
        dd.chooseImage({
            // count: 2,
            success: (res) => {
                // imgPath = res.filePaths[0];
                const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                dd.alert({content:path});
                t.setData({
                    picturePath:path,
                })

                /*dd.uploadFile({
                    url:app.globalData.domain+"/upload/upload.php" ,
                    fileType: 'image',
                    fileName: 'file',
                    filePath: path,
                   /!* url: 'http://httpbin.org/post',
                    fileType: 'image',
                    fileName: 'file',
                    filePath: path,*!/
                    success: (res) => {
                        /!*dd.alert({
                            content: '上传成功'
                        });*!/
                        console.log("上传成功");
                        t.imageUrl =getApp().globalData.domain+"/upload/"+JSON.parse(res.data).fileName;
                        t.setData({
                            picturePath:t.imageUrl
                        })
                    },
                    fail:(res)=>{
                        dd.alert({
                            content: '上传失败:'+JSON.stringify(res)
                        });
                    },

                });*/

            },
        });
    },
    uploadToDingding(){
        const t = this;
        const app = getApp();

        dd.chooseImage({
             count: 1,
            success: (res) => {
                // imgPath = res.filePaths[0];
                const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                dd.uploadFile({
                    url:app.globalData.domain+"/getOapiByName.php?event=uploadimg" ,
                    // url:'https://oapi.dingtalk.com/media/upload?access_token=&type=image',
                    fileType: 'image',
                    fileName: 'media',
                    filePath: path,
                     success: (res) => {
                        console.log("上传成功:"+ JSON.stringify(res));
                        t.imageUrl =JSON.parse(res.data).media_id;
                        t.setData({
                            picturePath:t.imageUrl
                        })
                },
                    fail:(res)=>{
                        dd.alert({
                            content: '上传失败:'+JSON.stringify(res)
                        });
                    },
             });
         },
        });

    },
    downloadFile(){
       const t = this;
        /*dd.downloadFile({
            // url: 'http://liuzheng750417.imwork.net:8088/corp_php-master/upload/wechatsight170.mp4' ,
            url: 'http://@lADPDeC2uJx8urDNAtDNBDg' ,
            success({ filePath }) {
                dd.alert({content:filePath});
               /!* dd.previewImage({
                    urls: [filePath,],
                });*!/
                console.log("下载成功");
                // t.imageUrl =getApp().globalData.domain+"/upload/"+JSON.parse(res.data).fileName;
                t.setData({
                    // videoPath : filePath
                    picturePath : filePath
                })
            },
            fail(res) {
                dd.alert({
                    content: res.errorMessage || res.error,
                });
            },
        });*/
        /*dd.saveFileToDingTalk({
            // url:this.data.picturePath,  // 文件在第三方服务器地址
            url: 'http://liuzheng750417.imwork.net:8088/corp_php-master/upload/wechatsight170.mp4',
            name:"some.mp4",
            success: (res) => {
                dd.alert({content:JSON.stringify(res)});
                console.log(JSON.stringify(res));

                /!* data结构
                 {"data":
                    [
                    {
                    "spaceId": "" //空间id
                    "fileId": "", //文件id
                    "fileName": "", //文件名
                    "fileSize": 111111, //文件大小
                    "fileType": "", //文件类型
                    }
                    ]
                 }
                 *!/
            },
            fail: (err) =>{
                dd.alert({
                    content:JSON.stringify(err)
                })
            }
        })*/
        dd.uploadAttachmentToDingTalk({
            image:{multiple:true,compress:false,max:9,spaceId: "12345"},
            space:{spaceId:"1562091972",isCopy:1 , max:9},
            file: {spaceId:"1562091972",max:1},
            types:["photo","camera","file","space"],//PC端仅支持["photo","file","space"]
            success: (res) => {

                console.log(JSON.stringify(res));

                /*
                {
                   type:'', // 用户选择了哪种文件类型 ，image（图片）、file（手机文件）、space（钉盘文件）
                   data: [
                      {
                        spaceId: "232323",
                        fileId: "DzzzzzzNqZY",
                        fileName: "审批流程.docx",
                        fileSize: 1024,
                        fileType: "docx"
                     },
                     {
                        spaceId: "232323",
                        fileId: "DzzzzzzNqZY",
                        fileName: "审批流程1.pdf",
                        fileSize: 1024,
                        fileType: "pdf"
                     },
                     {
                        spaceId: "232323",
                        fileId: "DzzzzzzNqZY",
                        fileName: "审批流程3.pptx",
                        fileSize: 1024,
                        fileType: "pptx"
                      }
                   ]

                }
                 */
            },
            fail: (err) =>{
                dd.alert({
                    content:JSON.stringify(err)
                })
            }
        })
    },
    openDingTalk() {
        dd.chooseDingTalkDir({
            success: (res) => {
                /* data结构
                 {"data":
                    [
                        {
                            "spaceId": "" //被选中的空间id
                            "path": "", // 被选中的文件夹路径
                            "dirId": "", //被选中的文件夹id
                        }
                    ]
                 }
               */
                dd.alert({content:"ok,console 钉盘信息"});
                console.log(JSON.stringify(res));
            },
            fail: (err) =>{
                dd.alert({
                    content:JSON.stringify(err)
                })
            }
        })
    },
    //vacation组件向page传值
    onReturnDetailed(data){
      console.log("父组件得到"+JSON.stringify(data));
      detailed = data;
    },
    openDingFlow(){  //打开钉钉待我审批
      const app = getApp();
        dd.navigateTo({url: '/page/logs/logs'});
    }
});
