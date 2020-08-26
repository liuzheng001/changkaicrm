Page({
    data: {
        /*detailed: [

            // [ {"name":produceName,"value":"HJ-35清洗剂"},
            //  {"name":number,"value":20},
            //  {"name":getway,"value":"技术部领取"},
            //  {"name":getDate,"value":"2019-5-12"},
            // ],
            // [ {"name":produceName,"value":"HJ-35清洗剂"},
            //  {"name":number,"value":20},
            //  {"name":getway,"value":"技术部领取"},
            //  {"name":getDate,"value":"2019-5-12"},
            // ],
            {
                produceName: "HJ-35清洗剂",
                number: 20,
                // getway:"技术部领取",
                getDate:"2019-05-12",
                getwayIndex:1,
            },
            {
                produceName: "HJ-35清洗剂",
                number: 30,
                // getway:"技术部领取",
                getDate:"2019-05-12",
                getwayIndex:0,
            },
        ],*/
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
        customIndex: -1,
        payDate:"",

        //欠款和挂账金额
        arrears:0,
        salesAccounts:0,

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
    },
    onLoad() {
        dd.showLoading({content: '加载中...'})
        const url = getApp().globalData.domain+"/getFmMessage.php";
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
                    this.setData({
                        customList:res.data.content.data
                    });
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
        })
    },

    changeDate(e) {
        const t =this;
        let currentDate  = this.data.payDate;
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
                    t.setData({
                            payDate:selectDate.format("yyyy-MM-dd")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                        }
                    );

                }
            },
        });
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
         if ( form.payMoney<=0 ) {
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
                                progress_code: "PROC-38F20E0E-72C5-4838-8BDC-BAA6F91DBBB7",
                                originatorUserId: userId,
                                dept_id: departments[departments.length - 1],
                                form_values: [
                                    {name: "供应商", value: form.customName},
                                    {name: "当前供应商欠款", value: this.data.arrears.toFixed(2)},
                                    {name: "当前供应商挂账金额", value: this.data.salesAccounts.toFixed(2)},
                                    {name: "预计支付金额", value: form.payMoney},
                                    {name: "预计支付时间", value: this.data.payDate},
                                    {name: "备注", value: form.remark},

                                    {name: "供应商借贷::类别", value: "付款"},
                                    {name: "供应商借贷::属性", value: "物品"},
                                    {name: "供应商借贷::供应商ID匹配字段", value: customID},

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


