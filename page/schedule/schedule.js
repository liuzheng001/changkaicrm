Page({
    data: {
        scheduleId:0,
      detailed: [
          // {eventID:0,event: "去长安", signTime: '2019/5/14', signAddress: "重庆市江北区",isDelete:false},
      ],
        dailyContent:"",
        // scheduleDate:"", //6/23/2019
        year:0,
        date:0,
        month:0,
        attendance:"",//出勤状态
      /*medias:[
          {src:"http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg"},
          {src:"http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg"},
          ]*/
    },
    customData: {
        eventCount: 0
    },

    onLoad(query){ //页面加载时,获取日历详情
        //scheduleJson.scheduleId为0,则代表新日历,尚未建立
        let scheduleJson = JSON.parse(query.scheduleJson);
				this.setData({
                    "detailed": scheduleJson.listData.data,
                    "scheduleId":scheduleJson.scheduleId,
                    // "scheduleDate":scheduleJson.scheduleDate,
                    "year":scheduleJson.year,
                    "month":scheduleJson.month,
                    "date":scheduleJson.date,
                    attendance:scheduleJson.attendance,
                });
				this.customData.eventCount = scheduleJson.listData.data.length;

        /*
        //从php后端得到数据,弃用
        dd.showLoading();
        const t =this;
        // const url = 'https://filemaker.ckkj.net.cn:8890/corp_php-master/getSchdule.php'
        const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
				dd.httpRequest({
						url: url,
						method: 'POST',
						data: {
								action: 'getschedule',
								scheduleID: query.scheduleID,
						},
						dataType: 'json',
						success: (res) => {
								// console.log('success----',res)
								// alert(JSON.stringify(res));
								// if(res.data.)
								const data = res.data.content.response.data;
								t.setData({
										"detailed": data.detailed,
										"dailyContent": data.dailyContent,
										"medias": data.medias
								})

						},
						fail: (res) => {
								console.log("httpRequestFail---", res)
								// dd.alert({content: JSON.stringify(res)});
								dd.hideLoading();
						},
						complete: (res) => {
								dd.hideLoading();
						}
				})*/
    },
    scheduleSubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    onAddEvent(){
        let list = this.data.detailed
        // eventID为0,代表新增
        list.push(
            {eventID:0,event: "",  signTime: '', signAddress: "",isDelete:false});
        this.setData({
            "detailed":list,
        })
        this.customData.eventCount++;

    },
    onDeleteEvent(e){
        dd.confirm({
            title: '提示',
            content: '确认删除该日程',
            confirmButtonText: '删除',
            success: (result) => {	
            if(result.confirm === true){
                const row = e.currentTarget.dataset.index;
                let list = this.data.detailed;
                // list.splice(row,1);
                //不删除,做删除标记
                if(list[row].eventID === 0 ){
                    list.splice(row,1);
                }else {
                    list[row].isDelete = true;
                }
                this.setData({
                    "detailed":list
                })
                this.customData.eventCount--;
                }
            },
        })

    },
    onEventChange(e){//日程内容变更,既input内容变化时,在datailed中event记录
        const row = e.currentTarget.dataset.index;
        let list = this.data.detailed;
        list[row].event = e.detail.value ;
        this.setData({
            "detailed":list
        })

    },
    onDailychange(e){//日志内容变更,既input内容变化时,在datailed中event记录
        this.setData({
            "dailyContent":e.detail.value
        })

    },
    onAddPicture(e){
        const t = this;
        let thumbs = this.data.medias;
        dd.chooseImage({
            count: 7-this.data.medias.length, //最多只能选7张图片

            success: (res) => {
                if(res.filePaths || res.apFilePaths) {
                    res.filePaths.forEach(item => {
                        const path = item;
                        //将数据存入,但没有上传
                        thumbs.push({
                            src: path
                        });
                    })

                    t.setData({
                            "medias": thumbs
                        }
                    );
                }

            },
        });
    },
    onDeletePicture(e){
			const t = this;
			const no = e.currentTarget.dataset.no; //第几张图
			dd.confirm({
            title: '提示',
            content: '确认删除该媒体',
            confirmButtonText: '删除',
            success: (result) => {	
								if(result.confirm === true){
									let thumbs = this.data.medias;
									thumbs.splice(no,1);
									t.setData({
											"medias":thumbs
											})
								}
						}
						})
    },
    onSubmit(){ //将数据提交到后台
        let isDelSchedule = false;
        //日历在前端是新建,而且events为0
        if (this.data.scheduleId === 0 && this.customData.eventCount === 0) {
            dd.switchTab({
                url: '/page/calendar/index'
            })
            return;
        }else if (this.data.scheduleId!==0 && this.customData.eventCount === 0) {
            isDelSchedule = true;
        }
        const app = getApp();
        console.log(this.data);
        // dd.showLoading();
        const t =this;
        // const url = 'https://filemaker.ckkj.net.cn:8890/corp_php-master/getSchdule.php'
        const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
        dd.httpRequest({
            url: url,
            method: 'POST',
            data: {
                action: 'updateSchedule',
                scheduleID: this.data.scheduleId,//为0代表新增
                scheduleContent:this.data.dailyContent,
                scheduleDate:(this.data.month+1)+'/'+this.data.date+'/'+this.data.year,
                username:getApp().globalData.username,
                isDelSchedule:isDelSchedule, //是否删除scheduleID记录
                /*events: JSON.stringify([
                            {
                                    "eventID": 0,//为0代表新增
                                    "event": "测试",
                                    "signAddress": "Isee灰姑娘国际儿童艺术中心(龙湖源著校区)(江北区福泉路25号源著天街L2-12)",
                                    "lat": 106.49402711749696,
                                    "lang": 29.604912310755623,
                                    "signTime": "06/01/2019 12:00:00",
                                    'isDelete':false,

                            },

                        ]),*/
                events: JSON.stringify(t.data.detailed)
                },
            dataType: 'json',
            success: (res) => {
                if (res.data.success === true) {
                    app.globalData.flashScheduleFlag = true;
                    console.log('schedule:'+app.globalData.flashScheduleFlag)
                    dd.alert({
                        content:"日历更改成功",
                        //退出日历详情,回到月日历
                        success:()=> {
                            dd.switchTab({
                                url: '/page/calendar/index'
                            })
                        }
                    });
                   /* dd.showToast({
                        type: 'success',
                        content: '更改成功',
                        duration: 3000,
                        success:()=> {
                            dd.switchTab({
                                url: '/page/calendar/index'
                            })
                        }
                    });*/
                }else{
                    dd.alert({content:"日历更改:"+res.data.content.response.data});
                }
            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                // dd.alert({content: JSON.stringify(res)});
                // dd.hideLoading();
            },
            complete: (res) => {
								// dd.alert({content: JSON.stringify(res)});
                // dd.hideLoading();
            }
        })

    },
    //打开php后端文件
    onPreviewPicture() {
			const t =this;
      /*  dd.previewImage({
            urls: [t.data.medias[0].src]
        });*/

      //转到webview
        dd.navigateTo({
            url: '/page/logs/logs?url=http://liuzheng750417.imwork.net:8088/corp_php-master/testurl.php'
        })

      //转存到钉盘
       /* dd.saveFileToDingTalk({
            // url:"http://liuzheng750417.imwork.net:8088/corp_php-master/testurl.php",  // 文件在第三方服务器地址
            url:"http://liuzheng750417.imwork.net:8088/corp_php-master/upload/消泡剂质量问题归总docx",  // 文件在第三方服务器地址
            name:"test1.doc",
            success: (res) => {
                /!* data结构x
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
                dd.alert({
                    content:'succuess:'+JSON.stringify(res)
                })
                dd.previewFileInDingTalk({
                    corpId:getApp().globalData.corpId,
                    spaceId: res.data[0].spaceId,
                    fileId: res.data[0].fileId,
                    fileName: res.data[0].fileName,
                    fileSize: res.data[0].fileSize,
                    fileType: res.data[0].fileType
                })
            },
            fail: (err) =>{
                dd.alert({
                    content:'failure:'+JSON.stringify(err)
                })
            }
        })*/
    },
    //返回按键,若需进一步需定制导航栏,不成功
    /*onUnload(){
        dd.confirm({
            title: '提示',
            content: '确认返回,所有修改将不保留?',
            confirmButtonText: '确认',
            success: (result) => {
                if(result.confirm === false){
                    this.onLoad();
                }
            },
        })
    }*/
    onCalculationmil(){
        if(this.data.attendance==="已收工"){
            dd.navigateTo({url: '/page/logs/logs?calendarID='+this.data.scheduleId});
        }else{
            dd.alert({content:"尚未收工不能计算行程"});
        }


    },
    onUploadFm() {

        const url = "http://liuzheng750417.imwork.net:8088/corp_php-master/upload/uploadContainer.php"
        // const url = "http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php"
       /* dd.httpRequest({
            url: url,
            method: 'POST',
            data: {
                fileName:'fileName',
                fieldName:'fieldName',
                layoutName:'layoutName',
                recordID:'recordID',//scheduleId
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success === true) {
                    dd.alert({content: "上传成功"});
                }
            }
        })*/
        /*dd.chooseImage({
            // count: 2,
            success: (res) => {
                // imgPath = res.filePaths[0];
                const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);

                dd.uploadFile({
                    url:url ,
                    fileType: 'image',
                    fileName: 'file',
                    filePath: path,
                    /!* url: 'http://httpbin.org/post',
                     fileType: 'image',
                     fileName: 'file',
                     filePath: path,*!/
                    formData:{
                        // action:"uploadToContainer",
                        layoutName:"媒体容器详情",
                        fieldName:"媒体容器",
                        scheduleID:this.data.scheduleId,//scheduleId
                        containerID:4, //容器ID,为0,则为新增
                    },
                    success: (res) => {
                        const result = JSON.parse(res.data)
                        if(result.success === true) {
                            dd.alert({
                                content: '上传成功'
                            });
                        }else{
                            dd.alert({
                                content: '文件上传失败'+JSON.stringify(res)
                            });
                        }
                       /!* t.imageUrl =getApp().globalData.domain+"/upload/"+JSON.parse(res.data).fileName;
                        t.setData({
                            picturePath:t.imageUrl
                        })*!/
                    },
                    fail:(res)=>{
                        dd.alert({
                            content: '上传失败:'+JSON.stringify(res)
                        });
                    },

                });

            },
        });*/
        dd.chooseVideo({
            sourceType: ['album','camera'],
            maxDuration: 60,
            success:(res)=> {
                // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                const path = res.filePath;

                dd.uploadFile({
                    url: url,
                    fileType: 'video',
                    fileName: 'file',
                    filePath: path,

                    formData: {
                        // action:"uploadToContainer",
                        layoutName: "媒体容器详情",
                        fieldName: "媒体容器",
                        scheduleID: this.data.scheduleId,//scheduleId
                        containerID: 4, //容器ID,为0,则为新增
                    },
                    success: (res) => {
                        const result = JSON.parse(res.data)
                        if (result.success === true) {
                            dd.alert({
                                content: '上传成功'
                            });
                        } else {
                            dd.alert({
                                content: '文件上传失败' + JSON.stringify(res)
                            });
                        }

                    },
                    fail: (res) => {
                        dd.alert({
                            content: '上传失败:' + JSON.stringify(res)
                        });
                    },

                })
            },
            fail: (err)=> {
                console.log(err)
            }
        })
    },
    onScheduleContent(){
        if (this.data.scheduleId === 0) {
            dd.alert({content:"尚未建立日历."})
        }else {
            dd.navigateTo({url: '/page/scheduleContent/scheduleContent?scheduleId='+this.data.scheduleId});
        }
    },


});
