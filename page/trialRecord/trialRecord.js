Page({
    data: {

        //显示模态框，配方号选择
        showModal:false,
        originData:{
        },
        value:[0,0],
        firstKey:'',
        isShowPicker : false,

        customerId:0,
        // customerName:'',见下面客户名称
        description: '',//现场描述

        //产品明细
        catchDelete: 'catchDelete',
        onAdd: 'onAdd',
        detailed: [
                   /*[ {"name":produceName,"value":"HJ-35清洗剂"},
                    {"name":number,"value":20},
                    {"name":getFashionIndex,"value":"技术部领取"},
                    {"name":getDate,"value":"2019-5-12"},
                   ],
                   [ {"name":produceName,"value":"HJ-35清洗剂"},
                    {"name":number,"value":20},
                    {"name":getFashionIndex,"value":"技术部领取"},
                    {"name":getDate,"value":"2019-5-12"},
                   ],*/
             {
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
             },
         ],
        index:-1,//明细的序号
        getFashion:[
            '技术部领取','生产部领取'
        ],
        category: ['清洗剂(防锈剂)', '切削液', '防锈油', '普油', '切削油'],
        categoryIndex:-1,

        // thumbs:['http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
        //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
        //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
        //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'],
        thumbs:[],

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
        inputVal: "",//客户名称
        //搜索渲染推荐数据
        searchList: [],


    },
    onLoad(query) {
        const t =this;
        if (Object.keys(query).length !== 0) {//有instanceId既recordId,进入编辑记录
            const recordId = query.instanceId;
            const url = getApp().globalData.domain+'/fmSampleRec.php';
            dd.showLoading()
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
                           inputVal:res.data.trialRecordDetail.customerName,
                           description: res.data.trialRecordDetail.customederDemand,
                           detailed:res.data.trialRecordDetail.detailed,
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
        }else{//无,则进入建立记录
            let url = getApp().globalData.domain+"/getFmMessage.php";

            let approvalStage = "申请"

            if(approvalStage =="申请") {
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
                                customList: res.data.content.data
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
            approvalStage = "技术选型"
            if (approvalStage == "技术选型") {
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
            inputVal: "",
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
            inputVal: e.detail.value,
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
            inputVal:cellValue,
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

    onPicturePreview(e){
        const imageUrl = e.currentTarget.dataset.src;
        dd.previewImage({
            urls:[imageUrl]
        });
    },
    onAddPicture(e){
        const t = this;

        let thumbs = this.data.thumbs;
        dd.chooseImage({
            count: 9-thumbs.length, //最多只能选9张图片
            success: (res) => {
                if(res.filePaths || res.apFilePaths) {
                    res.filePaths.forEach(item => {
                        const path = item;
                        //将数据存入,但没有上传
                        thumbs.push(path);
                    })

                    t.setData({
                            thumbs: thumbs
                        }
                    );
                }
            },
        });
    },
    onDeletePicture(e){
        const t = this;
        const index = e.currentTarget.dataset.index; //第几张图
        let thumbs = this.data.thumbs;
        thumbs.splice(index,1);
        t.setData({
                thumbs:thumbs
            }
        );

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
    formSubmit(e) { //发起审批

        // const detailedArr = convertDetailed(this.data.detailed,this)
        let t = this;
        let form = e.detail.value;

        //用户单位是否在列表中
        // if(this.data.customListform.customName))
        function findFn(item, objIndex, objs){
            return item.name === form.customName;
        }

        const index = this.data.customList.findIndex(findFn);
        let customID;
        if(index==-1){
            dd.alert({content: "客户名称,请检查!"});
            return;   }
        else {  //通过index找到客户ID
            customID = this.data.customList[index].id;
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
                    const imgpaths = this.data.thumbs;
                    let promiseArr =[];
                    for (let i = 0; i < imgpaths.length; i++) {
                        promiseArr.push(updatePicture(imgpaths[i]))
                    }
                    //ios不显示 dd.alert({content:results}),但this.data.imageUrls = results执行了原因不明
                    Promise.all(promiseArr)
                        .then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                            // dd.alert({content: results})
                            const app = getApp();
                            const userId = app.globalData.userId;
                            const username = app.globalData.username;
                            const url = getApp().globalData.domain+"/TrialRecordWorkflowForSelfUse.php"

                            dd.httpRequest({
                                url: url,
                                method: 'POST',
                                // headers:{'Content-Type': 'application/json'},
                                data: {
                                    action:'createInstance',
                                    values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                        templateId: "161",//流程集合中样品试用记录模板
                                        originatorId: userId,
                                        originatorName:username,
                                        form_values: {
                                            customerName:t.data.inputVal,
                                            description: form.description,
                                            customerId:customID

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
                                    if (res.data.success == true){
                                        dd.alert({content: "审批已发起,id:" + res.data.instanceRecordId,
                                            success: () => {
                                                dd.navigateBack();
                                            },
                                        });
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
                        })
                        .catch(result => {
                            dd.alert({content: "上传失败" + result})
                        })


                }
            },
        });

    },
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

function updatePicture(imgPath) {
    // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
    // dd.alert({ content: `内容：${path}` });
    //小程序只能上传本地文件,提供定位符,另外一次只能传一张图片,所以要多文件循环
    /* for (let i = 0; i < imgPaths.length; i++) {
         let imageUrl = imgPaths[i];
         dd.uploadFile({
             url: getApp().globalData.domain + '/upload/upload.php',
             fileType: 'image',
             fileName: 'file',
             filePath: imageUrl,
             success: res => {
                 console.log(JSON.parse(res.data));
                 if (JSON.parse(res.data).result == "success") {
                     //返回上传图片urls
                     // dd.alert({ content: JSON.parse(res.data)});
                     return fileUrls;

                 } else {
                     dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                     fileUrls.push(JSON.parse(res.data).fileUrl)
                 }
             },
             fail: function (res) {
                 dd.alert({content: `上传失败：${JSON.stringify(res)}`});
             },
         });
     }*/
    return new Promise(function (resolve,reject) {
        dd.uploadFile({
            url: getApp().globalData.domain + '/upload/upload.php',
            fileType: 'image',
            fileName: 'file',
            filePath: imgPath,
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result == "success") {
                    //返回上传图片urls
                    resolve(JSON.parse(res.data).fileUrl);
                } else {
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                    reject('failure');
                }
            },
            fail: function (res) {
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                reject('failure');
            },
        });
    })


}

function showSearchList(allList,query) { //原始数据


    var searchList=allList.filter(function (item) {//利用filter具有筛选和截取的作用，筛选出数组中name值与文本框输入内容是否有相同的字

        return item.name.indexOf(query)>-1;//索引name

    });

    return searchList;
}


