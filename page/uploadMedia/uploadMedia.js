Page({
    data: {
        showVideo: false,
        projectName:"",//项目名称
        // recordId:-1,//试验记录ID
        recordId:-1,
        recordNum:"",//试验记录编号


        //媒体列表,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
        thumbs: [
           /* {nativeUrl:'http://resources/1557572616747-2019-05-11.jpg',//本地图片或视频
            recordId:123,
            name:'mediaName',
            remark:'备注',
            category:'image',
            size:123,
            },
            {nativeUrl:'http://resource/1605278109006.mp4',//本地图片或视频
                recordId:123,
                name:'mediaName',
                remark:'备注',
                size:123,
                category:'video'
            },
            {nativeUrl:'http://resources/1557572616747-2019-05-11.jpg',//本地图片或视频
                recordId:123,
                name:'mediaName',
                category:'image',
                remark:'备注',
                size:123,
            }*/

        ],
       
        //显示视频预览
        showVideoPreview: false,
        videoUrl: "",//显示视频地址

        showModal:false,
        mediaRemark:"",
        mediaMessage:"",
        mediaType:"",
        fileName:"",
        mediaSize:"",
    },
    onLoad(query) {
        //得到项目名称和试验记录Id
    },
    //扫描fm二维码,得到试验记录Id等信息
    qrScan(){
        const t =this;
        if (t.data.thumbs.length>0) {
            dd.confirm({
                title: '更换试验记录',
                content: '确定更换试验记录?',
                confirmButtonText: '确认',
                success: (result) => {
                    if (result.confirm === true) {
                        dd.scan({
                            type: 'qr',
                            success: (res) => {
                                if (res.code.indexOf("recordId") === -1) {
                                    dd.alert({content: "错误:请打开试验记录-试验记录详情布局扫描二维码"})
                                }
                                else {
                                    const data = JSON.parse(res.code);
                                    t.setData({
                                        recordId: data.recordId,
                                        recordNum: data.recordNum,
                                        projectName: data.projectName,
                                        thumbs: [],
                                    });
                                }
                            },

                        })
                    }
                }
            })
        }else {
            dd.scan({
                type: 'qr',
                success: (res) => {
                    if (res.code.indexOf("recordId") === -1) {
                        dd.alert({content: "错误:请打开试验记录-试验记录详情布局扫描二维码"})
                    }
                    else{
                            const data = JSON.parse(res.code);
                            t.setData({
                                recordId: data.recordId,
                                recordNum: data.recordNum,
                                projectName: data.projectName,
                                thumbs: [],
                            });
                        }

                },
            })
        }
    },

    //媒体容器相关
    onMediaPreview(e) {
        const Url = e.currentTarget.dataset.src;
        const category = e.currentTarget.dataset.category;
        if (category === 'video') {
            //通过videoId播放视频
            this.setData({
                videoUrl: Url,
                showVideo: true
            })
        } else {
            dd.previewImage({
                urls: [Url]
            })
        }
    },
    onCloseVideo() {
        this.setData({showVideo: false})
    },
    onUploadMedia() {
        dd.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            success: (res) => {
                // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                if (res.size > 20000000) {
                    dd.alert({content: "视频超过20M不能上传,请使用压缩软件剪辑后再上传."})
                } else {

                    /*const path = res.filePath;
                    const fileName = "测试";
                    const testRecordId = "77ADD3B4-AF7C-794D-950F-C076F2A0D4DA";
                    const url = getApp().globalData.applicationServer + 'recordMediaContainer.php'

                    dd.uploadFile({
                        // url: getApp().globalData.domain + '/upload/upload.php',
                        url: url,
                        fileType: 'video',
                        fileName: 'file',
                        filePath: path,
                        formData: {testRecordId,
                                   action:"uploadMedia",
                                 fileName},
                        success: res => {
                            const data = JSON.parse(res.data)
                            if (data.result == "success") {
                                //返回上传图片urls
                                dd.hideLoading();
                                dd.alert({content: "上传成功"})
                                thumbs.push({url: data.fileUrl, category: 'video', isUpload: false})
                                t.setData({
                                    thumbs: thumbs
                                });

                            } else {
                                dd.hideLoading();
                                dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                            }
                        },
                        fail: function (res) {
                            dd.hideLoading();
                            dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                        },
                    });*/
                }
            },
            fail: (err) => {
                console.log(err)
            }
        })
    },
    onAddMedia(e) {
        const t = this;
        let thumbs = this.data.thumbs;
        let options = ['图片', '视频'];
        let fileName,mediaType;
        dd.showActionSheet({
            title: "选择?",
            items: options,
            //cancelButtonText: '取消好了', //android无效
            success: (res) => {
                const index = res.index;
                if (index === 0) { //选择图片
                    dd.chooseImage({
                        count: 1, //最多只能选1张图片
                        success: (res) => {
                                /*//将数据存入,但没有上传
                                if(res.filePaths || res.apFilePaths) {
                                        thumbs.push({nativeUrl:res.filePaths[0],category:'image'});
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                }*/
                                fileName = res.filePaths[0];
                                mediaType = '图片';
                            this.setData({
                                showModal:true,
                                mediaType,
                                fileName,
                            })
                            },
                        fail: (err) => {
                            console.log(err);
                        }

                    });
                } else {//选择视频

                    dd.chooseVideo({
                        sourceType: ['album', 'camera'],
                        maxDuration: 60,
                        success: (res) => {
                            // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                            if (res.duration > 60) {
                                dd.alert({content: "视频时长不能超过1分钟."})
                            } else {
                                const path = res.filePath;
                               const mediaSize = res.size/1000000
                                    /* // dd.showLoading();
                                     thumbs.push({nativeUrl: path, category: 'video'});
                                     //将数据存入,但没有上传
                                     this.setData({
                                         thumbs: thumbs,
                                     })*/
                                fileName = path;
                                mediaType = '视频';
                                this.setData({
                                    showModal:true,
                                    mediaType,
                                    fileName,
                                    mediaSize
                                })
                            }
                        },
                        fail: (err) => {
                            console.log(err);
                        }
                    })
                }


            },
        })
    },
    onMediaMessage (e) {
        this.data.mediaMessage = e.detail.value;

    },
    onMediaRemark (e) {
        this.data.mediaRemark = e.detail.value;

    },
    onCancel() {
        this.setData({
            showModal:false,
        })
    },
    onUploadMediaToFmContainer(e) {//上传到fmContainer,成功后增加列表项
        //校验
        if (this.data.mediaMessage==="" ||  this.data.mediaRemark===""){
            dd.alert({content: "数据不全"})
            return;
        }
        const t =this;
        const path = this.data.fileName;
        const mediaMessage = this.data.mediaMessage;
        const remark = this.data.mediaRemark;//后台未使用
        const recordId = this.data.recordId;
        const mediaType = this.data.mediaType === "图片" ? "image" : "video";
        const url = getApp().globalData.applicationServer + 'recordMediaContainer.php'
        // alert(path);
        dd.showLoading();
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url: url,
            fileType: mediaType,
            fileName: 'file',
            filePath: path,
            formData: {testRecordId:recordId,
                       action:"uploadMedia",
                      mediaMessage,
                        remark},
            success: res => {
                const data = JSON.parse(res.data)
                if (data.success=== true) {
                    //返回上传图片urls
                    // dd.hideLoading();
                    dd.alert({content: "上传成功"})
                    let thumbs = t.data.thumbs;
                    thumbs.push({nativeUrl: path, category: mediaType,size:t.data.mediaSize,remark:remark,name:mediaMessage});
                    //将数据存入,但没有上传
                    t.setData({
                        thumbs: thumbs,
                        mediaRemark:"",
                        mediaMessage:"",
                        mediaType:"",
                        fileName:"",
                        mediaSize:"",
                    })
                } else {
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                }
            },
            fail: function (res) {
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
            },
            complete(res) {
                dd.hideLoading();
                t.setData({
                    showModal:false,
                });
            }
        });

    },
   /* onDeleteMedia(e) {
        const t = this;
        const index = e.currentTarget.dataset.index; //第几张图
        let thumbs = this.data.thumbs;

        //需将应用服务器中的媒体文件删除
        dd.confirm({
            title: '删除视频',
            content: '确定删除视频?.',
            confirmButtonText: '确认',
            success: (result) => {
                if (result.confirm === true) {
                    if (t.data.thumbs[index].isUpload == true) { //已上传在阿里云的文件,标记待删除
                        //删除记录
                        if (t.data.thumbs[index]['category'] === 'image') {
                            t.data.waitDeleteImageIds.push(t.data.thumbs[index]['videoId'])
                        } else {
                            t.data.waitDeleteVideoIds.push(t.data.thumbs[index]['videoId'])
                        }
                        //渲染
                        thumbs.splice(index, 1);
                        t.setData({
                                thumbs: thumbs
                            }
                        );
                    } else { //在应用服务器的文件,直接后台删除
                        dd.showLoading();
                        const url =getApp().globalData.applicationServer+"deleteUploadMedia.php"
                        dd.httpRequest({
                            url: url,
                            method: 'POST',
                            data: {
                                urlPath: thumbs[index].url,
                            },
                            dataType: 'json',
                            success: (res) => {
                                if (res.data.result === 'success') {
                                    thumbs.splice(index, 1);
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                } else {
                                    dd.alert({content: "删除上传文件失败,稍后再试"});
                                }
                                dd.hideLoading();

                            },
                            fail: (res) => {
                                console.log("httpRequestFail---", res)
                                dd.hideLoading();
                            },

                        })
                    }

                }
            }
        })

    },*/



})


function deleteImageToServer(thumb) {
    return new Promise(function (resolve,reject) {
        const url =getApp().globalData.applicationServer+"deleteUploadMedia.php"
        dd.httpRequest({
            url: url,
            method: 'POST',
            data: {
                urlPath: thumb.url,
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.result === 'success') {
                    resolve('success')
                } else {
                    dd.alert({content: "清理上传文件失败,稍后再试"});
                    reject('failure');

                }
            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                reject('failure');

            },
        })

    })


}


