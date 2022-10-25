Page({
    //物品试用流程,自建页面发起,走钉钉流程,同步数据到fm
    data: {

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
        customIndex: -1,
        beginDate:"",//开始试用日期

        trailStage: [],
        stageIndex:-1,
        objectiveCategory: [],
        objectiveIndex:-1,

        //搜索框相关
        // 搜索框状态
        lostFocus:true,
        inputStatus:{  marginRight:"-80rpx",
            opacity:0
        },
        //显示结果view的状态
        viewShowed: false,
        // 搜索框值
        inputVal: "",
        //搜索渲染推荐数据
        searchList: [],

        //选择物品
        selectItems: [],
        /*[
            {
                "specialName": "AEO-9(测试)",
                "manufacturer": "",
                "id": "33524970-9AE0-4E32-9F60-FCF942B39E69"
            },
            {
                "specialName": "(测试2)",
                "manufacturer": "",
                "id": "BA919E09-FAC8-4547-BFA7-FA1ABA080605"
            },
            {
                "specialName": "JFC(海安)",
                "manufacturer": "江苏省海安石油化工厂",
                "id": "A1F044CD-FF98-41AC-899A-DBF0DE583B07"
            },
]*/
        selectItemIndex: -1,
    },
    onLoad() {
        dd.showLoading({content: '加载中...'})
        /*const url = getApp().globalData.domain+"/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getsupplylist',
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                // console.log("供应商列表ok");

                if (res.data.success == true) {
                    dd.httpRequest({
                        url: url,
                        method: 'get',
                        data: {
                            action:'getItemBrands',
                        },
                        dataType: 'json',
                        success: (res1) => {
                            if (res1.data.success == true) {
                                this.setData({
                                    customList:res.data.content.data,
                                    selectItems:res1.data.content.data,
                                    beginDate:new Date().format("yyyy-MM-dd")
                                })
                            }
                            else {
                                dd.alert({'content':JSON.stringify(res)})
                            }
                        },

                        fail: (res) => {
                            dd.alert({'content': JSON.stringify(res)})
                        }
                    })

                  /!*  this.setData({
                        customList:res.data.content.data
                    });*!/
                } else {
                    dd.alert({'content':JSON.stringify(res)})
                }
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
                dd.hideLoading();
            }
        })*/
        /*  getSupplylist()
              .then((customList)=> {
                  this.setData({
                      customList
                  })
                  return getItemBrands();
              })
              .then(selectItems => {
                  this.setData({
                      selectItems
                  })
              }).catch(
              err=>dd.alert({title:"初始化数据失败",content:JSON.stringify(err)})
          )*/

        let promiseArr = [];

        promiseArr.push(getSupplylist());
        promiseArr.push(getItemBrands());
        promiseArr.push(getValueLists());


        //ios不显示 dd.alert({content:results}),但this.data.imageUrls = results执行了原因不明
        Promise.all(promiseArr)
            .then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                this.setData({
                    customList: results[0],
                    selectItems: results[1],
                    objectiveCategory:results[2].objectiveCategory,
                    trailStage:results[2].trailStage,
                    beginDate:new Date().format("yyyy-MM-dd")

                })
                dd.hideLoading();
            })
            .catch(result => {
            dd.alert({content: "初始化失败" + result})
        })
    },
    changeDate(e) {
        const t =this;
        let currentDate  = this.data.beginDate;

        dd.datePicker({
            format: 'yyyy-MM-dd',
            currentDate: currentDate,
            success: (res) => {
                if (typeof res.date !== 'undefined') {
                    t.setData({
                        beginDate:new Date(res.date).format("yyyy-MM-dd")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                        }
                    );
                }
            },
        });
    },
    onSelectStage(e) {
        const t =this;
        const value = e.detail.value;

        t.setData({
                stageIndex:value
            }
        );
    },
    onSelectObjective(e) {
        const t =this;
        const value = e.detail.value;

        t.setData({
            objectiveIndex:value
            }
        );
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
    //将搜索cell,更新到搜索框
    getSearchCell(e){
        const cellValue = e.currentTarget.dataset.name;
        const supplyID = e.currentTarget.dataset.id;  //供应商ID
        //得到欠款和挂账金额
        const url = getApp().globalData.domain+"/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getPayInformation',
                supplyID:supplyID,
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                if(res.data.success == true) {
                    this.setData({
                        arrears: res.data.content.data.arrears,
                        salesAccounts: res.data.content.data.salesAccounts,
                        lostFocus: true,
                        inputStatus: {
                            marginRight: "-80rpx",
                            opacity: 0,
                        },
                        inputVal: cellValue,
                    });
                }else{
                    dd.alert({'content':JSON.stringify(res)})

                }
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })

    },
    //选择物品品牌信息
    selectItemPickerChange(e) {
        this.setData({
            selectItemIndex: e.detail.value,
        });
    },
    formSubmit(e) { //发起审批
        // const detailedArr = convertDetailed(this.data.detailed,this)
        let that = this;
        let form = e.detail.value;

        //用户单位是否在列表中
        // if(this.data.customListform.customName))
        function findFn(item, objIndex, objs){
            return item.name === form.customName;
        }

        const index = this.data.customList.findIndex(findFn)
        let customID;
        if(index==-1){
            dd.alert({content: "客户名称,请检查!"});
            return;   }
        else {  //通过index找到客户ID
            customID = this.data.customList[index].id;
        }
        //数据校验
         if ( that.data.selectItemIndex=== -1 || form.stageIndex===-1 || form.price=="" || form.price<0 || form.number=="" || form.number<=0 || form.beginDate=="" ||  form.cycle==""|| form.objectiveIndex==-1 || form.trialObjective=="") {
             dd.alert({content: "提交数据有误,请检查!"});
             return;
         }

        dd.confirm({
            title: '提示',
            content: '提交后不能撤销,审批意见在钉钉审批应用中查看.',
            confirmButtonText: '提交',
            success: (result) => {
                if (result.confirm === true) {
                    const app = getApp();
                    const userId = app.globalData.userId;
                    const departments = app.globalData.departments;
                    const url = getApp().globalData.domain + "/operateWorkflow.php"
                    dd.httpRequest({
                        url: url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                        data: {
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                progress_code: "PROC-ED8853FC-7CFE-428C-8A49-CD4D45ACEE0F",
                                originatorUserId: userId,
                                dept_id: departments[departments.length - 1],
                                form_values: [
                                    {name: "供应商", value: form.customName},
                                    {name: "供应商ID", value: customID},
                                    {name: "物品品牌ID", value: this.data.selectItems[this.data.selectItemIndex].id},
                                    {name: "物品品牌", value: this.data.selectItems[this.data.selectItemIndex].specialName},
                                    {name: "生产厂家", value: this.data.selectItems[this.data.selectItemIndex].manufacturer},
                                    {name: "试用阶段", value: form.selectStage},
                                    {name: "物品报价", value: form.price},
                                    {name: "试用数量", value: form.number},
                                    {name: "金额", value: form.number * form.price},


                                    {name: "试用开始日期", value: form.beginDate},
                                    {name: "试用周期", value: form.cycle},
                                    {name: "目的类别", value: form.selectObjectCategory},
                                    {name: "试用目的", value: form.trialObjective},

                                ],
                            })
                        },
                        dataType: 'json',
                        traditional: true,//这里设置为true
                        success: (res) => {
                            if (res.data.errcode == 0) {
                                dd.alert({
                                    content: "审批已发起,id:" + res.data.process_instance_id,
                                    success: () => {
                                        dd.navigateBack();
                                    },
                                });
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
          })
    },
});


function showSearchList(allList,query) { //原始数据

    var searchList=allList.filter(function (item) {//利用filter具有筛选和截取的作用，筛选出数组中name值与文本框输入内容是否有相同的字

        return (item.name.indexOf(query)>-1)?{name:item.name,id:item.id}:false;//索引name

    });

    return searchList;
}


function getSupplylist() {
    return new Promise(function (resolve,reject) {
        const url = getApp().globalData.domain + "/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action: 'getsupplylist',
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                // console.log("供应商列表ok");

                if (res.data.success == true) {
                    resolve(res.data.content.data)
                }
                else {
                    reject(JSON.stringify(res))
                }
            },
            fail: (res) => {
                reject(JSON.stringify(res))
            },
            complete: (res) => {
                // dd.hideLoading();
            }
        })
    })
}

function getItemBrands() {
    return new Promise(function (resolve,reject) {
        const url = getApp().globalData.domain + "/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getItemBrands',
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success == true) {
                    resolve(res.data.content.data)
                }
                else {
                    reject(JSON.stringify(res))
                }
            },
            fail: (res) => {
                reject(JSON.stringify(res))
            }
        })
    })
}

function getItemBrands() {
    return new Promise(function (resolve,reject) {
        const url = getApp().globalData.domain + "/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getItemBrands',
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success == true) {
                    resolve(res.data.content.data)
                }
                else {
                    reject(JSON.stringify(res))
                }
            },
            fail: (res) => {
                reject(JSON.stringify(res))
            }
        })
    })
}

function getValueLists() { //得到试用阶段和试用目的类别值列表
    return new Promise(function (resolve,reject) {
        const url = getApp().globalData.domain + "/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getValueList',
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success == true) {
                    resolve(res.data.data)
                }
                else {
                    reject(JSON.stringify(res))
                }
            },
            fail: (res) => {
                reject(JSON.stringify(res))
            }
        })
    })
}

