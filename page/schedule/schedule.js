Page({
    data: {
        scheduleId:0,
      detailed: [
          // {eventID:0,event: "去长安", signTime: '2019/5/14', signAddress: "重庆市江北区",isDelete:false},
      ],
        dailyContent:"",
        scheduleDate:"", //6/23/2019
      /*medias:[
          {src:"http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg"},
          {src:"http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg"},
          ]*/
    },
    onLoad(query){ //页面加载时,获取日历详情
        let scheduleJson = JSON.parse(query.scheduleJson);
				this.setData({
                    "detailed": scheduleJson.listData.data,
                    "scheduleId":scheduleJson.scheduleId,
                    "scheduleDate":scheduleJson.scheduleDate
                })

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
        console.log(this.data);
        dd.showLoading();
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
                scheduleDate:this.data.scheduleDate,
                username:getApp().globalData.username,
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
                    dd.alert({content:"日历更改成功"});
                }else{
                    dd.alert({content:"日历更改:"+res.data.content.response.data});
                }
            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                // dd.alert({content: JSON.stringify(res)});
                dd.hideLoading();
            },
            complete: (res) => {
								// dd.alert({content: JSON.stringify(res)});
                dd.hideLoading();
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
    }

});
