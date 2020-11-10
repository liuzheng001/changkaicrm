Page({
    data: {
        //流程阶段
        submitAction:"",//发起,审批
        mode:"",//'已发起','待处理','已处理', '抄送的',只有待处理才能修改表单内容,其它只能查看

        //显示模态框，配方号选择
        showModal:false,
        originData:{
        },
        value:[0,0],
        firstKey:'',
        isShowPicker : false,

        recordId:-1,
        customerId:0,
        // customerName:'',见下面客户名称
        description: '',//现场描述

        //产品明细
        catchDelete: 'catchDelete',
        onAdd: 'onAdd',
        detailed: [

            /* {
                 produceName: "HJ-35清洗剂",
                 number: 20,
                 // getway:"技术部领取",
                 getDate:"2019-05-12",
                 getFashion:"",
             },
             {
                 produceName: "HJ-35清洗剂",
                 number: 30,
                 // getway:"技术部领取",
                 getDate:"2019-05-12",
                 getFashion:"",
             },*/
         ],
        index:-1,//明细的序号
        getFashion:[
            '技术部领取','生产部领取'
        ],
        category: ['清洗剂', '切削液', '防锈油', '普油', '切削油'],
        categoryIndex:-1,

        // thumbs:['http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
        //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
        //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
        //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'],

        //媒体组件相关
        showVideo:false,//显示视频播放
        thumbs:[
            /*{url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
            {url:'http://r1w8478651.mp4',category:'video',isUpload:true},
            {url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image',isUpload:true},
            {url:'http://r1w8478651.mp4',category:'video',isUpload:false}*/
        ],
        //等待从阿里云上删除的媒体id
        waitDeleteVideoIds: [],
        waitDeleteImageIds: [],
        //用户列表
        customList:[//客户清单
            /*{
                  name: '美国',id:"123213afasd",  //fm 客户id
              },
              {
                  name: '中国',id:"12321qw3afasd",  //fm 客户id
              },*/
        ],
        // customIndex: -1,

        //收费列表
        costList:[
            '收费','不收费','合格后,收费'
        ],
        costIndex:-1,
        //领取方式


        //搜索框相关
        // 搜索框状态
        lostFocus:true,
        inputStatus:{  marginRight:"-80rpx",
            opacity:0
        },
        //显示结果view的状态
        viewShowed: false,
        // 搜索框值
        customerName: "",//客户名称
        //搜索渲染推荐数据
        searchList: [],

        // 权限表:与流程相关,申请,技术选型为流程节点,比如技术选型对产品明细可进行修改,并可见.发起人,审批时,就看不到
        //[1,1]代表第1位为1可编辑,0为只读,第2位1为隐藏,0为显示.目前,第二参数暂时不用
        authority:{
            apply:{ customerName:[1,0],
                description:[1,0],
                thumbs:[1,0],
                selectCategory: [1, 0],
                demandNumber: [1, 0],
                sampleCost: [1,  0],
                costIndex: [1,  0],//是否收费

                sampleList:[0,1],//明细组件
                detailButton:[0,1],//隐藏增加明细button
                formulaNum: [0, 0],
                sampleQuantity:[0, 0],
                getFashion: [0, 0],
                getDate: [0, 0]

                },
            technologySelect:{
                customerName:[0,0],
                description:[1,0],
                thumbs:[1,0],
                selectCategory: [0, 0],
                demandNumber: [0, 0],
                sampleCost: [0,  0],
                costIndex: [0,  0],//是否收费

                sampleList:[1,0],//明细组件
                detailButton:[1,0],//不隐藏增加明细button
                formulaNum: [1, 0],
                sampleQuantity:[1, 0],
                getFashion: [1, 0],
                getDate: [1, 0]

            },
            managerApproval:{
                customerName:[0,0],
                description:[1,0],
                thumbs:[1,0],
                selectCategory: [0, 0],
                demandNumber: [0, 0],
                sampleCost: [0,  0],

                sampleList:[0,0],//明细组件
                detailButton:[0,1],//隐藏增加明细button
                formulaNum: [0, 0],
                sampleQuantity:[0, 0],
                getFashion: [0, 0],
                getDate: [0, 0]

            }
        },
        approvalStage:"",//申请,技术选型,总经理批准

        //步骤条元素,放弃
        item: [
           /* {
                title: '技术选型',
                description: '这是步骤1的描述文档，文字足够多的时候会换行，设置了成功的icon',
                activeIcon: 'https://i.alipayobjects.com/common/favicon/favicon.ico',
                size: 20,},
            {
                title: '步骤1',
                description: '这是步骤1的描述文档，文字足够多的时候会换行，设置了成功的icon',
                activeIcon: 'https://i.alipayobjects.com/common/favicon/favicon.ico',
                size: 20,},
            {
                title: '步骤1',
                description: '这是步骤1的描述文档，文字足够多的时候会换行，设置了成功的icon',
                activeIcon: 'https://i.alipayobjects.com/common/favicon/favicon.ico',
                size: 20,}*/
        ],


    },
    onLoad(query) {
        const t =this;
        let approvalStage ;

        if (Object.keys(query).length !== 0) {//有recordId,进入编辑记录
            // this.data.submitAction = "审批";
            const mode = query.mode;
            const recordId = query.recordId;
            switch (query.workflowStage) {
                case "申请":
                    approvalStage = "apply";
                    break;
                case "技术选型":
                    approvalStage = "technologySelect";
                    break;
                case "总经理批准":
                    approvalStage = "managerApproval";
                    break;
            }
            t.data.recordId = recordId;
            const url = getApp().globalData.domain+'/fmSampleRec.php';
            dd.showLoading();
            dd.httpRequest({
                url: url,
                method: 'post',
                dataType: 'json',
                data: {
                    action:"getTrialRecord",
                    recordId,
                },

                success: function (res) {
                    if(res.data.success == true) {

                       t.setData({
                           customerId:res.data.trialRecordDetail.customerId,
                           customerName:res.data.trialRecordDetail.customerName,
                           description: res.data.trialRecordDetail.customerDemand,
                           detailed:res.data.trialRecordDetail.detailed,
                           categoryIndex: t.data.category.indexOf(res.data.trialRecordDetail.categoryName),
                           demandNumber:res.data.trialRecordDetail.demandNumber,
                           sampleCost:res.data.trialRecordDetail.sampleCost,
                           costIndex:t.data.costList.indexOf(res.data.trialRecordDetail.costMode),
                           submitAction: "审批",
                           thumbs:res.data.trialRecordDetail.thumbs,
                           mode,
                           approvalStage
                       })
                    }else{
                        dd.alert({content:JSON.stringify(res)});

                    }
                    dd.hideLoading();
                },
                fail: function (res) {
                    dd.alert({content:"获取试用记录失败."+JSON.stringify(res)});
                    dd.hideLoading();
                }
            });
        }else {//无,则进入建立记录
            // this.data.submitAction = "发起";
            approvalStage = "apply";
        }
        let url;
        if(approvalStage ==="apply") {
            url = getApp().globalData.domain+"/getFmMessage.php";
            dd.httpRequest({
                url: url,
                method: 'post',
                data: {
                    action: 'getcustomlist',
                },
                dataType: 'json',
                success: (res) => {
                    // dd.alert({'content':JSON.stringify(res)})
                    if (res.data.success == true) {
                        this.setData({
                            customList: res.data.content.data,
                            submitAction: "发起",
                            approvalStage: "apply",
                            mode: "待处理"
                        });
                    } else {
                        dd.alert({'content': JSON.stringify(res)})
                    }
                },
                fail: (res) => {
                    dd.alert({'content': JSON.stringify(res)})
                },
                complete: (res) => {
                }

            })
        } else if (approvalStage === "technologySelect" ) {
            url = getApp().globalData.domain + "/getFmMessage.php";
            dd.httpRequest({
                url: url,
                method: 'get',
                data: {
                    action: 'getFormulationList',
                },
                dataType: 'json',
                success: (res) => {
                    // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                    if (res.data.success === true) {

                        this.setData({
                            originData: res.data.content.data
                        });
                    } else {
                        dd.alert({'content': JSON.stringify(res)})
                    }
                },
                fail: (res) => {
                    dd.alert({'content': JSON.stringify(res)})
                },
                complete: (res) => {
                }
            })
        }

    },

    // 显示搜索框取消,得到焦点
    showCancel: function () {
        this.setData({
            lostFocus:false,
            inputStatus: {
                marginRight: "0",
                opacity: 1
            }
        });
    },
    //失去搜索框焦点
    onBlur: function () {
        this.setData({
            lostFocus:true,
            inputStatus: {
                marginRight: "-80rpx",
                opacity: 0,
            }
        });
    },
    // 点击搜索框取消
    clearSearch: function () {
        this.setData({
            customerName: "",
            inputStatus: {
                marginRight: "-80rpx",
                opacity: 0,
            }
        });
    },
    // 搜索框输入值更新
    onInput: function (e) {
        const searchList = showSearchList(this.data.customList,e.detail.value);
        // debugger;
        this.setData({
            customerName: e.detail.value,
            searchList:searchList
        });
    },
    //点击搜索cell,更新到搜索框
    getSearchCell(e){
        const cellValue = e.currentTarget.dataset.name;
        this.setData({
            lostFocus:true,
            inputStatus: {
                marginRight: "-80rpx",
                opacity: 0,
            },
            customerName:cellValue,
        });
    },
    /* customChange(e) {
         this.setData({
             customIndex: e.detail.value,
         });
     },*/
    costSelect(e){
        this.setData({
            costIndex: e.detail.value,
        });
    },

    //媒体容器相关
    onMediaPreview(e) {
        const imageUrl = e.currentTarget.dataset.src;
        const index = e.currentTarget.dataset.index;
        const category = e.currentTarget.dataset.category;
        if (category === 'video') {
            //通过videoId播放视频
            if (this.data.thumbs[index].isUpload == true) { //已上传阿里云,通过videoId播放
                const url =getApp().globalData.applicationServer+"PlayAiliyuVideoForVideoid.php";
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        videoId: this.data.thumbs[index].videoId,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.success === true) {
                            this.setData({
                                videoUrl: res.data.src,
                                showVideo: true
                            })
                        } else {
                            alert("播放文件失败,稍后再试");
                        }
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---", res)
                    },
                })
            } else { //未上传到阿里云
                this.setData({
                    videoUrl: imageUrl,
                    showVideo: true
                })
            }

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
                                        thumbs.push({url: item, category: 'image', isUpload: false});
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
                            if (res.size > 20000000) {
                                dd.alert({content: "视频超过20M不能上传,请使用压缩软件剪辑后再上传."})
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
    onSelectCategory(e) {
        const t =this;
        const value = e.detail.value;

        t.setData({
            categoryIndex:value
            }
        );
    },
    //明细
    changeDate(e) {
        const t =this;
        const index = e.currentTarget.dataset.index;
        let currentDate  = this.data.detailed[index].getDate;
        let today = new Date();
        today.setHours(0),today.setMinutes(0),today.setSeconds(0),today.setMilliseconds(0);

        dd.datePicker({
            format: 'yyyy-MM-dd',
            currentDate: currentDate,
            success: (res) => {
                if (typeof res.date !== 'undefined') {
                    //检验日期,不能小于今天
                    const selectDate = new Date(res.date);
                    if(selectDate<today){ //要去掉时分秒
                        dd.alert({content:"选择的日期已过期"})
                        return;
                    }
                    const  target = `detailed[${index}].getDate`;
                    t.setData({
                            [target]:selectDate.format("yyyy-MM-dd")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                        }
                    );

                }
            },
        });
    },
    getFashionPickerChange(e) {
        const t =this;
        const index = e.currentTarget.dataset.index;
        const value = e.detail.value;

        const  target = `detailed[${index}].getFashion`;
        t.setData({
                [target]:t.data.getFashion[value]
            }
        );

    },
    catchDelete(e){  //不冒冒泡删除
        const row = e.currentTarget.dataset.index;
        let list = this.data.detailed;
        list.splice(row,1);
        this.setData({
            "detailed":list
        })

    },
    onAdd() {
        let today = new Date();
        let list = this.data.detailed
        list.push({
            produceName: "",
            number: 0,
            getFashion:"",
            getDate:today.format("yyyy-MM-dd"),
        });
        this.setData({
            detailed:list
        })
    },
    //明细配方号picker选择
    onChange(e) {
        const keys = Object.keys(this.data.originData);
        const firstKey = keys[e.detail.value[0]];

        let secondNum ;
        if (this.data.firstKey == firstKey){  //picker的第一键值没变
            secondNum = e.detail.value[1];
        }else{
            secondNum = 0;
        }


        this.setData({
            firstKey: firstKey,
            value:[e.detail.value[0],secondNum],
        });
    },
    onSelectProduct(e){
        //得到明细的序号,传递给commonmodal组件
        const index = e.currentTarget.dataset.index;
        this.setData({
            showModal: true,
            index:index,
        })

    },
    // 数量值变化
    onInputNumber(e) {
        const t =this;
        const index = e.currentTarget.dataset.index;
        const value = e.detail.value;

        const  target = `detailed[${index}].number`;
        t.setData({
                [target]:value
            }
        );
    },
    onChangeFormulaSelect(parameter) {
        /*dd.alert({
            content:parameter
        })*/
        //更新配方号
        const t =this;
        const index = parameter;

        const  target = `detailed[${index}].produceName`;
        t.setData({
                [target]:t.data.originData[t.data.firstKey][t.data.value[1]],
                showModal:false
            }
        );
    },
    onCancel() {
        this.setData({
            showModal:false
        });

    },
    /*onEntryChange(e){//明细入口数据变化,既input内容变化时,在datailed中记录
        const row = e.currentTarget.dataset.index;
        const fieldName = e.currentTarget.dataset.name;
        let list = this.data.detailed;
        list[row][fieldName] = e.detail.value ;
        this.setData({
            "detailed":list
        })

    },*/
    formSubmit(e) { //发起,同意或驳回审批
        // const detailedArr = convertDetailed(this.data.detailed,this)
        let t = this;
        let form = e.detail.value;

        //用户单位是否在列表中
        function findFn(item, objIndex, objs){
            return item.name === form.customName;
        }

        let customID;
        if (this.data.submitAction === "发起") {
            const index = this.data.customList.findIndex(findFn);
            if(index==-1){
                dd.alert({content: "客户名称,请检查!"});
                return;   }
            else {  //通过index找到客户ID
                customID = this.data.customList[index].id;
            }
        }


        /*//数据校验
        if (this.data.customIndex<0 || form.description=="" || form.demandNumber=="" || this.data.costIndex<0 || this.data.categoryIndex<0) {
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }*/

        dd.confirm({
            title: '提示',
            content: '提交后不能撤销,审批意见在钉钉审批应用中查看.',
            confirmButtonText: '提交',
            success: (result) => {
                if(result.confirm === true){
                            const app = getApp();
                            const userId = app.globalData.userId;
                            const username = app.globalData.username;
                            const url = getApp().globalData.domain+"/TrialRecordWorkflowForSelfUse.php"
                    dd.showLoading();
                    if(this.data.submitAction === '发起') { //发起流程
                                dd.httpRequest({
                                    url: url,
                                    method: 'POST',
                                    // headers:{'Content-Type': 'application/json'},
                                    data: {
                                        action: 'createInstance',
                                        values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                            templateId: "161",//流程集合中样品试用记录模板
                                            originatorId: userId,
                                            originatorName: username,
                                            form_values: {
                                                customerName: t.data.customerName,
                                                description: form.description,
                                                customerId: customID,
                                                categoryName:t.data.category[t.data.categoryIndex],
                                                demandNumber:form.demandNumber,
                                                sampleCost:form.sampleCost,
                                                costMode :t.data.costList[t.data.costIndex],

                                                /*  {name:"媒体容器",value:results},
                                                  {name: "需求数量", value:form.demandNumber},
                                                  {name: "预估样品费用", value:form.sampleCost},
                                                  {name: "是否收费",value:this.data.costList[this.data.costIndex] },*/
                                            },
                                        })
                                    },
                                    dataType: 'json',
                                    traditional: true,//这里设置为true
                                    success: (res) => {
                                        if (res.data.success == true) {
                                            const recordId = res.data.instanceRecordId;
                                            const url =getApp().globalData.applicationServer+"uploadMediasToAiliForComponents.php"
                                            dd.httpRequest({
                                                url: url,
                                                method: 'POST',
                                                data: {
                                                    recordId,
                                                    recordSheetName: "样品试用记录",
                                                    thumbs: JSON.stringify(t.data.thumbs),

                                                    max: 6,
                                                    waitDeleteVideoIds: t.data.waitDeleteVideoIds.join(','),
                                                    waitDeleteImageIds: t.data.waitDeleteImageIds.join(',')
                                                },
                                                dataType: 'json',
                                                success: (res1) => {
                                                    dd.alert({
                                                        content: "审批已发起,id:" + recordId,
                                                        success: () => {
                                                            dd.navigateBack(2);
                                                            dd.redirectTo({url:"/page/trialRecord/trialRecordList/trialRecordList"})
                                                        },
                                                    });
                                                },
                                                fail: (res1) => {
                                                    dd.alert({content: JSON.stringify(res1)});
                                                },
                                                complete: (res) => {
                                                    dd.hideLoading();
                                                }
                                            })
                                            } else {
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
                            }else {  //修改流程
                                dd.httpRequest({
                                    url: url,
                                    method: 'POST',
                                    // headers:{'Content-Type': 'application/json'},
                                    data: {
                                        action: 'updateInstance',
                                        values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                            recordId:t.data.recordId ,//样品使用记录
                                            approvalId: userId,
                                            workflowCondition:e.buttonTarget.dataset.workflowCondition ,
                                            form_values: {
                                                customerName: t.data.customerName,
                                                description: form.description,
                                                customerId: t.data.customerId,
                                                categoryName:t.data.category[t.data.categoryIndex],
                                                demandNumber:form.demandNumber,
                                                sampleCost:form.sampleCost,
                                                costMode :t.data.costList[t.data.costIndex],

                                                detailed:t.data.detailed,

                                                /*  {name:"媒体容器",value:results},
                                                  {name: "需求数量", value:form.demandNumber},
                                                  {name: "预估样品费用", value:form.sampleCost},
                                                  {name: "是否收费",value:this.data.costList[this.data.costIndex] },*/
                                            },
                                        })
                                    },
                                    dataType: 'json',
                                    traditional: true,//这里设置为true
                                    success: (res) => {
                                        if (res.data.success == true) {
                                            const recordId = res.data.instanceRecordId;
                                            const url =getApp().globalData.applicationServer+"uploadMediasToAiliForComponents.php"
                                            dd.httpRequest({
                                                url: url,
                                                method: 'POST',
                                                data: {
                                                    recordId,
                                                    recordSheetName: "样品试用记录",
                                                    thumbs: JSON.stringify(t.data.thumbs),

                                                    max: 6,
                                                    waitDeleteVideoIds: t.data.waitDeleteVideoIds.join(','),
                                                    waitDeleteImageIds: t.data.waitDeleteImageIds.join(',')
                                                },
                                                dataType: 'json',
                                                success: (res1) => {
                                                    dd.alert({
                                                        content: "审批已提交,id:" + recordId,
                                                        success: () => {
                                                            dd.navigateBack(2);
                                                            dd.redirectTo({url:"/page/trialRecord/trialRecordList/trialRecordList"})
                                                        },
                                                    });
                                                },
                                                fail: (res1) => {
                                                    dd.alert({content: JSON.stringify(res1)});
                                                },
                                                complete: (res) => {
                                                    dd.hideLoading();
                                                }
                                            })
                                        } else {
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
                            }
                }
            },
        });
    },
    closeWorkflow(){
        dd.navigateBack();
    }

});

/*
**将明细数组 {
              produceName: "HJ-35清洗剂",
              number: 20,
              getway:"技术部领取",
              getDate:"2019-5-12",
          },
          {
              produceName: "HJ-35清洗剂",
              number: 30,
              getway:"技术部领取",
              getDate:"2019-5-12",
          },
          转换为格式 [ {"name":produceName,"value":"HJ-35清洗剂"},
                     {"name":number,"value":20},
                     {"name":getway,"value":"技术部领取"},
                     {"name":getDate,"value":"2019-5-12"},
                    ],
                    [ {"name":produceName,"value":"HJ-35清洗剂"},
                     {"name":number,"value":20},
                     {"name":getway,"value":"技术部领取"},
                     {"name":getDate,"value":"2019-5-12"},
                    ],
 */

function convertDetailed(detailed,t) {
    let result = [];

    detailed.forEach(item => {
        let record = [];
        for(let index in item){
            switch (index) {
                case "produceName":
                    record.push( {"name":"型号与名称","value":item[index]});
                    break;
                case "number":
                    record.push({"name":"数量","value":item[index]});
                    break;
                case "getwayIndex":
                    const getwayIndex = item[index];
                    record.push({"name":"领取方式","value":t.data.getwayList[getwayIndex]});
                    break;
                case "getDate":
                    record.push({"name":"可领取日期","value":item[index]});
                    break;
            }
        }
        result.push(record);
    })
    return result;
}



function showSearchList(allList,query) { //原始数据


    var searchList=allList.filter(function (item) {//利用filter具有筛选和截取的作用，筛选出数组中name值与文本框输入内容是否有相同的字

        return item.name.indexOf(query)>-1;//索引name

    });

    return searchList;
}

function updateImageToServer(thumb) {
    // console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve, reject) {
        const url = getApp().globalData.applicationServer + "uploadMediaToServer.php"
        const fileType = thumb.category === "image" ? "image" : "video"
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url: url,
            fileType: fileType,
            fileName: 'file',
            filePath: thumb.url,
            formData: {fileType: fileType},
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




