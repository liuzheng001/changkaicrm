Page({
    data: {
        // showDetailed:false,//显示数据记录详情,与showModal相反
        showModal: true,
        stage:0,//0是在选择机器和产品阶段,1为记录阶段
        backMode:0,//0代表导航键默认,记录storage,1代表用户提交记录,将storage清零
        showVideo: false,
        sampleID: null,//试用记录ID
        sampleDataRecID: null,//新数据记录ID
        testCategory: ['现场检测', '取样检测'],
        testCategoryIndex: -1, //检测类型序号
        //选择产品
        selectProduct: [],
        selectProductIndex: -1,
        //选择设备
        selectMachine: [],
        selectMachineIndex: -1,
        //试样类别
        category: '',
        //检测项目
        subjects: [//包括实测数据
            /*{name:"外观",classification:"检测项目",testMethod:"目测",checkData:""},
            {name:"浓度",classification:"检测项目",testMethod:"目测",checkData:""},
           */

        ],
        addSubjects: [//包括实测数据
            /* {name:"外观",classification:"检测项目",testMethod:"目测",checkData:""},
            {name:"浓度",classification:"检测项目",testMethod:"目测",checkData:""},*/
        ],

        /*showDetailModal:false,//显示检测项目详情
        subjectCategory:"",
        subjectsIndex:-1,*/

        //媒体信息,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
        thumbs: [
            /*{url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
            {url:'http://r1w8478651.mp4',category:'video'},
            {url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
            {url:'http://r1w8478651.mp4',category:'video'}*/
        ],
        //显示视频预览
        showVideoPreview: false,
        videoUrl: "",
    },
    onLoad(query) {
        const t = this;
        let sampleID, thumbs = [];
        dd.getStorage({
            key: 'sampleRecord',
            success: function (res) {
                //不存在samleRecord key时，res.data为null
                if (res.data == null) {
                    t.data.sampleID = query.sampleID;
                    // debug
                    // t.data.sampleID = "6DFC100A-56D9-43FD-BD0A-BAE9F2388213";
                    //读取fm选择样品记录列表
                    const url = getApp().globalData.domain + "/fmSampleRec.php";
                    dd.httpRequest({
                        url: url,
                        method: 'get',
                        data: {
                            action: 'getSampleMessage',
                            sampleID: t.data.sampleID
                        },
                        dataType: 'json',
                        success: (res) => {
                            // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                            t.setData({
                                selectProduct: res.data.data.selectProduct,
                                selectMachine: res.data.data.selectMachine,
                                category: res.data.data.category,
                                thumbs: [],
                            });
                        },
                        fail: (res) => {
                            dd.alert({'content': JSON.stringify(res)})
                        },
                        complete: (res) => {
                        }

                    })
                    return;
                }
                sampleID = res.data.sampleID;
                thumbs = res.data.thumbs;
                if (sampleID === query.sampleID) { //有samleRecord值,且还是同一个试样记录,则将上一次数据恢复
                    // debug
                    //   if (sampleID === "6DFC100A-56D9-43FD-BD0A-BAE9F2388213") {
                    t.data.stage = res.data.stage;
                    if (res.data.stage === 0) {//还在选择产品和机器阶段
                        t.setData({
                            sampleID: sampleID,//试用记录ID
                            category:res.data.category,
                            testCategory: res.data.testCategory,
                            testCategoryIndex: res.data.testCategoryIndex, //检测类型序号
                            //选择产品
                            selectProduct: res.data.selectProduct,
                            selectProductIndex: res.data.selectProductIndex,
                            //选择设备
                            selectMachine: res.data.selectMachine,
                            selectMachineIndex: res.data.selectMachineIndex,

                        })
                    }else {
                        t.setData({
                            showModal: false,
                            sampleID: sampleID,//试用记录ID
                            testCategory: res.data.testCategory,
                            testCategoryIndex: res.data.testCategoryIndex, //检测类型序号
                            //选择产品
                            selectProduct: res.data.selectProduct,
                            selectProductIndex: res.data.selectProductIndex,
                            //选择设备
                            selectMachine: res.data.selectMachine,
                            selectMachineIndex: res.data.selectMachineIndex,
                            //试样类别
                            category: res.data.category,
                            //检测项目
                            subjects: res.data.subjects,
                            addSubjects: res.data.addSubjects,
                            remark:res.data.remark,

                            //媒体信息,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
                            thumbs: thumbs,
                        })
                    }
                } else {
                    //选择不同的sampleID,则将storage消除
                    //先将后台的视频和图片消除
                    let promiseArr = [];
                    thumbs.forEach(item => {
                        promiseArr.push(deleteImageToServer(item))
                    })
                    Promise.all(promiseArr).then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                        console.log("后台媒体清理成功")
                    })
                    dd.removeStorage({
                        key: 'sampleRecord',
                        success: function () {
                            t.data.sampleID = query.sampleID;
                            // debug
                            // t.data.sampleID = "6DFC100A-56D9-43FD-BD0A-BAE9F2388213";
                            //读取fm选择样品记录列表
                            const url = getApp().globalData.domain + "/fmSampleRec.php";
                            dd.httpRequest({
                                url: url,
                                method: 'get',
                                data: {
                                    action: 'getSampleMessage',
                                    sampleID: t.data.sampleID
                                },
                                dataType: 'json',
                                success: (res) => {
                                    // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                                    t.setData({
                                        selectProduct: res.data.data.selectProduct,
                                        selectMachine: res.data.data.selectMachine,
                                        category: res.data.data.category,
                                        thumbs: [],
                                    });
                                },
                                fail: (res) => {
                                    dd.alert({'content': JSON.stringify(res)})
                                },
                                complete: (res) => {
                                }

                            })
                        }
                    });

                }
            },
            fail: function (res) {
                //选择不同的sampleID,则将storage消除
                t.data.sampleID = query.sampleID;
                // debug
                //   t.data.sampleID = "6DFC100A-56D9-43FD-BD0A-BAE9F2388213";
                //读取fm选择样品记录列表
                const url = getApp().globalData.domain + "/fmSampleRec.php";
                dd.httpRequest({
                    url: url,
                    method: 'get',
                    data: {
                        action: 'getSampleMessage',
                        sampleID: t.data.sampleID
                    },
                    dataType: 'json',
                    success: (res) => {
                        // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                        t.setData({
                            selectProduct: res.data.data.selectProduct,
                            selectMachine: res.data.data.selectMachine,
                            category: res.data.data.category
                        });
                    },
                    fail: (res) => {
                        dd.alert({'content': JSON.stringify(res)})
                    },
                    complete: (res) => {
                    }

                })
            }
        });
    },
    onUnload() {
        console.log("返回键按下,page销毁")
        //真机上可调试,ide直接忽略
        // dd.alert({content:JSON.stringify(this.data.subjects)})
        if (this.data.backMode === 1) { //提交退出
            dd.removeStorage({
                key: 'sampleRecord',
            });
        }else { //返回键退出
            //将数据写入storage
            dd.setStorage({
                key: 'sampleRecord',
                data: {
                    sampleID: this.data.sampleID,//试用记录ID
                    testCategory: this.data.testCategory,
                    testCategoryIndex: this.data.testCategoryIndex, //检测类型序号
                    //选择产品
                    selectProduct: this.data.selectProduct,
                    selectProductIndex: this.data.selectProductIndex,
                    //选择设备
                    selectMachine: this.data.selectMachine,
                    selectMachineIndex: this.data.selectMachineIndex,
                    //试样类别
                    category: this.data.category,
                    //检测项目
                    subjects: this.data.subjects,
                    addSubjects: this.data.addSubjects,

                    //媒体信息,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
                    thumbs: this.data.thumbs,
                    remark:this.data.remark,

                    stage: this.data.stage,//0是在选择机器和产品阶段,1为记录阶段

                },
                success: function () {
                    // dd.alert({content: '写入成功'});
                }
            });
        }
    },
    openModal() {
        this.setData({
            showModal: !this.data.showModal
        })
    },
    /*closeModal(){
        this.setData({
            showModal:false
        })
    },
*/
    testCategoryPickerChange(e) {
        this.setData({
            testCategoryIndex: e.detail.value,
        });
    },
    selectProductPickerChange(e) {
        this.setData({
            selectProductIndex: e.detail.value,
        });
    },
    selectMachinePickerChange(e) {
        this.setData({
            selectMachineIndex: e.detail.value,
        });
    },

    //mask组件触发page(外组件)方法
    onCancelRecord(isShow) {
        const t =this;
        dd.confirm({
            title: '提示',
            content: '放弃新建样品跟踪记录?',
            confirmButtonText: '放弃',
            cancelButtonText: '再看看',
            success: (result) => {
                if (result.confirm === true) {
                    dd.navigateBack()
                    t.data.backMode =1;
                }
            },
        })
    },
    //mask组件触发page(外组件)方法
    //建立新试样数据,通过fm脚本
    onCreateRecord() {
        const t = this;
        //校验数据
        if (t.data.testCategoryIndex < 0 || t.data.selectMachineIndex < 0 || t.data.selectProductIndex < 0) {
            dd.alert({content: '数据不正确,请检查'})
            return;
        }
        //弃用,使用事务提交,不先建立记录数据
        /*const url = getApp().globalData.domain+"/fmSampleRec.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'createSampleRecord',

                // $_REQUEST['sampleID'].'|'.$_REQUEST['testCategory'].'|'.$_REQUEST['machineID'].'|'.$_REQUEST['formulaID']
                sampleID:'6DFC100A-56D9-43FD-BD0A-BAE9F2388213',
                testCategory:t.data.testCategory[t.data.testCategoryIndex],
                machineID:t.data.selectMachine[t.data.selectMachineIndex]['machineID'],
                formulaID:t.data.selectProduct[t.data.selectProductIndex]['formulaID'],
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                //填充新数据记录,subjects和addSubjects
                if (res.data.success===true) {
                    t.data.sampleDataRecID = res.data.data.sampleDataRecID
                    dd.httpRequest({
                        url: url,
                        method: 'get',
                        data: {
                            action: 'getSampleData',
                            sampleDataRecID: t.data.sampleDataRecID,
                            // $_REQUEST['sampleID'].'|'.$_REQUEST['testCategory'].'|'.$_REQUEST['machineID'].'|'.$_REQUEST['formulaID']
                        },
                        dataType: 'json',
                        success: (res) => {
                            // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                            //将新建的记录数据内容
                            this.setData({
                                subjects: res.data.data.subjects,
                                addSubjects: res.data.data.addSubjects,
                                showModal:false,
                            });
                        },
                        fail: (res) => {
                            dd.alert({'content': JSON.stringify(res)})
                        },
                    })
                }

            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
        })*/
        const url = getApp().globalData.domain + "/fmSampleRec.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action: 'getDataRecordTemplate',
                // $_REQUEST['sampleID'].'|'.$_REQUEST['testCategory'].'|'.$_REQUEST['machineID'].'|'.$_REQUEST['formulaID']
                // sampleID:'6DFC100A-56D9-43FD-BD0A-BAE9F2388213',
                sampleID: this.data.sampleID,
                testCategory:this.data.testCategory[this.data.testCategoryIndex]
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success === true) {
                    // dd.alert({'content': JSON.stringify(res)})
                    //进入填写记录阶段
                    this.data.stage = 1;
                    //将新建的记录数据内容
                    this.setData({
                        subjects: res.data.data.subjects,
                        addSubjects: res.data.data.addSubjects,
                        showModal: false,
                    });
                }
            },
            fail: (res) => {
                dd.alert({'content': JSON.stringify(res)})
            },
        })
    },
    //输入实测数据,写入对应subjects
    onInput: function (e) {
        const checkData = e.detail.value;
        const index = e.currentTarget.dataset.index;
        const testCategory = e.currentTarget.dataset.testCategory
        if (testCategory === "subjects") {
            this.data.subjects[index].checkData = checkData;
            this.setData({
                subjects: this.data.subjects
            })
        } else {
            this.data.addSubjects[index].checkData = checkData
            this.setData({
                addSubjects: this.data.addSubjects
            })

        }
    },
    onTextareaInput(e){//textarea双向绑定
        const name = e.currentTarget.dataset.name;
        this.setData({
            [name] :e.detail.value
        });

    },
    /*//detailModal
    openDetailModal(e){
        const subjectsIndex= e.currentTarget.dataset.index;
        const subjectCategory = e.currentTarget.dataset.testCategory
        this.setData({showDetailModal:true,
                      subjectsIndex:subjectsIndex,
                      subjectCategory:subjectCategory});

    },
    onClose(){
        this.setData({
            showDetailModal:false
        })
    },*/
    //媒体容器相关
    onMediaPreview(e) {
        const imageUrl = e.currentTarget.dataset.src;
        const category = e.currentTarget.dataset.category;
        if (category === 'video') {
            this.setData({
                videoUrl: imageUrl,
                showVideo: true
            })
        } else {
            dd.previewImage({
                urls: [imageUrl]
            })
        }
    },
    onCloseVideo() {
        this.setData({showVideo: false})
    },
    onAddMedia(e) {
        const t = this;
        let thumbs = this.data.thumbs;
        let options = ['图片', '视频'];

        dd.showActionSheet({
            title: "选择?",
            items: options,
            //cancelButtonText: '取消好了', //android无效
            success: (res) => {
                const index = res.index;
                if (index === 0) { //选择图片
                    dd.chooseImage({
                        count: 6 - thumbs.length, //最多只能选9张图片
                        success: (res) => {
                            if (res.filePaths || res.apFilePaths) {
                                let promiseArr = [];
                                res.filePaths.forEach(path => {
                                    promiseArr.push(updateImageToServer({url: path, category: 'image'}))
                                })
                                dd.showLoading();
                                Promise.all(promiseArr).then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                                    dd.hideLoading();
                                    dd.alert({content: "上传成功"})
                                    results.forEach(item => {
                                        thumbs.push({url: item, category: 'image'});
                                    })
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                    dd.hideLoading();
                                })
                                //将数据存入,但没有上传
                                /*if(res.filePaths || res.apFilePaths) {
                                    res.filePaths.forEach(item => {
                                        const path = item;

                                        thumbs.push({url:path,category:'image'});
                                    })
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                }*/

                            }
                        },
                    });
                } else {//选择视频
                    dd.chooseVideo({
                        sourceType: ['album', 'camera'],
                        maxDuration: 60,
                        success: (res) => {
                            // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                            if (res.size > 200000000) {
                                dd.alert({content: "视频超过200M不能上传,或大于1分钟"})
                            } else {
                                const path = res.filePath;
                                dd.showLoading();

                                /* //将数据存入,但没有上传
                                 thumbs.push({url:path,category:'video'})}
                                 t.setData({
                                     thumbs:thumbs
                                  });*/

                                //直接上传到应用服务器
                                //development服务器
                                const url =getApp().globalData.applicationServer+"uploadMediaToServer.php"
                                dd.uploadFile({
                                    // url: getApp().globalData.domain + '/upload/upload.php',
                                    url: url,
                                    fileType: 'video',
                                    fileName: 'file',
                                    filePath: path,
                                    formData: {fileType: 'video'},
                                    success: res => {
                                        console.log(JSON.parse(res.data));
                                        const data = JSON.parse(res.data)
                                        if (data.result == "success") {
                                            //返回上传图片urls
                                            dd.hideLoading();
                                            dd.alert({content: "上传成功"})
                                            thumbs.push({url: data.fileUrl, category: 'video'})
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
                                });
                            }
                        },
                        fail: (err) => {
                            console.log(err)
                        }
                    })
                }
            },
        })
    },
    onDeleteMedia(e) {
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
        })

    },
    onUploadMedia() {
        if (this.data.thumbs.length >= 1) {
            const t = this;
            const thumbs = this.data.thumbs
            dd.confirm({
                title: '上传媒体',
                content: '媒体上传阿里云.',
                confirmButtonText: '提交',
                success: (result) => {
                    //将客户端文件通过应用服务器中转,再上传阿里云
                    /*if (result.confirm === true) {
                        dd.showLoading();
                        const thumbs = this.data.thumbs;
                        let promiseArr = [];
                        for (let i = 0; i < thumbs.length; i++) {
                            promiseArr.push(updateMedia(thumbs[i]))
                        }
                        //ios不显示 dd.alert({content:results}),但this.data.imageUrls = results执行了原因不明
                        Promise.all(promiseArr)
                            .then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                                dd.hideLoading();
                                dd.alert({content:"上传成功"})
                            })
                    }*/
                    const url =getApp().globalData.applicationServer+"uploadMediasToAili.php"
                    //将应用服务器临时文件,上传阿里云
                    dd.httpRequest({
                        url: url,
                        method: 'post',
                        //测试数据
                        data: {
                            sampleDataRecID:291,
                            thumbs: JSON.stringify(thumbs)
                        },
                        success: function (res) {
                            if (res.data.result == 'success') {
                                dd.alert({content: "已上传阿里云."});
                                t.setData({
                                        thumbs: []
                                    }
                                );
                            } else {
                                dd.alert({content: "上传阿里云失败"});
                            }
                        },
                        fail: function (res) {
                            dd.alert({content: "上传阿里云失败." + JSON.stringify(res)});
                        }
                    });
                },
                fail: function (res) {
                    dd.hideLoading();
                    dd.alert({content: `上传失败了：${JSON.stringify(res)}`});

                }
            })
        }
    },
    onSubmit() { //提交到fm
        const t = this;
        //数据校验

        //上传数据到fm
        dd.confirm({
            title: '提交',
            content: '提交记录,确认?',
            confirmButtonText: '确认',
            success: (result) => {
                const url = getApp().globalData.domain + "/fmSampleRec.php";
                //将应用服务器临时文件,上传阿里云
                dd.httpRequest({
                    url: url,
                    method: 'post',
                    data: {
                        action:"createSampleRecord",
                        sampleID: t.data.sampleID,
                        machineID: t.data.selectMachine[t.data.selectMachineIndex].machineID,
                        formulaID: t.data.selectProduct[t.data.selectProductIndex].formulaID,
                        testCategory: this.data.testCategory[this.data.testCategoryIndex],
                        remark: t.data.remark,
                        subjects: JSON.stringify(t.data.subjects),
                        addSubjects: JSON.stringify(t.data.addSubjects),
                        submitName:getApp().globalData.username,
                    },
                    success: function (res) {
                        if (res.data.success == true) {
                            const thumbs = t.data.thumbs
                            if (thumbs.length == 0) { //无上传媒体直接退出
                                t.data.backMode = 1;
                                t.data.stage = 0;
                                dd.alert({
                                    content: "提交成功.",
                                    success: () => {
                                        dd.navigateBack();
                                    },
                                });
                            }else {
                                //将媒体文件上传至阿里云,并在后台将videoID与入fm
                                const url = getApp().globalData.applicationServer + "uploadMediasToAili.php";
                                //将应用服务器临时文件,上传阿里云
                                dd.httpRequest({
                                    url: url,
                                    method: 'post',
                                    data: {
                                        sampleDataRecID: res.data.sampleDataRecID,
                                        thumbs: JSON.stringify(thumbs)
                                    },
                                    success: function (res) {
                                        if (res.data.success == true) {
                                            t.data.backMode = 1;
                                            t.data.stage = 0;
                                            dd.alert({
                                                content: "提交成功.",
                                                success: () => {
                                                    dd.navigateBack();
                                                },
                                            });

                                            // dd.alert({content: "已上传阿里云."});
                                        } else {
                                            dd.alert({content: "上传阿里云失败"});
                                        }
                                    },
                                    fail: function (res) {
                                        dd.alert({content: "上传阿里云失败." + JSON.stringify(res)});
                                    }
                                });
                            }
                        } else {
                            dd.alert({content: "提交失败"});
                        }
                    },
                    fail: function (res) {
                        dd.alert({content: "提交失败." + JSON.stringify(res)});
                    }
                });
            },
        });
        //注意将storage的内容删除
    }
});

function updateMedia(thumb) {
    console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve,reject) {
        const url =getApp().globalData.applicationServer+"uploadVideoToAili.php"
        const fileType = thumb.category==="image"?"image":"video"
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url:url,
            fileType: fileType,
            fileName: 'file',
            filePath: thumb.url,
            formData:{fileType:fileType},
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result == "success") {
                    //返回上传图片urls
                    resolve(JSON.parse(res.data).fileUrl);
                } else {
                    dd.hideLoading();
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                    reject('failure');
                }
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                reject('failure');
            },
        });
    })
}

function updateImageToServer(thumb) {
    // console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve,reject) {
        const url =getApp().globalData.applicationServer+"uploadMediaToServer.php"
        const fileType = thumb.category==="image"?"image":"video"
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url:url,
            fileType: fileType,
            fileName: 'file',
            filePath: thumb.url,
            formData:{fileType:fileType},
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result == "success") {
                    //返回上传图片urls
                    resolve(JSON.parse(res.data).fileUrl);
                } else {
                    dd.hideLoading();
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                    reject('failure');
                }
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                reject('failure');
            },
        });
    })
}

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

