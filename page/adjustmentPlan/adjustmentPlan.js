

Page({
    data: {

        //选择配方号,两级picker
        originData:{
        },
        value:[0,0],
        firstKey:'',
        isShowPicker : false,



        categoryList: ['自检不合格','客户退换','呆滞品'],
        categoryIndex:-1, //类别序号


        relevantList:[], //关联的审批钉钉实例ID,从relevantList page返回

        isInputFormulationNumber:false, //是否输入配方号，当不能确定配方号的产品时，该值为true
        focus:false,

    },
    onLoad() { //从fm中读取formulationList值列表,二维数组,赋值给picker-view
        const url = getApp().globalData.domain+"/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getFormulationList',
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                if (res.data.success === true) {

                    this.setData({
                    originData:res.data.content.data
                });}else{
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
    //选择手动输入还是picker选择配方
    radioChange(e) {

          /*  setTimeout(() => {
            this.onFocus();
            }, 100);*/
        const isInputFormulationNumber = e.detail.value==="true"?true:false;
       if (!isInputFormulationNumber) {
            this.setData({
                isInputFormulationNumber:isInputFormulationNumber,
        });
        }else{
            this.setData({
                isInputFormulationNumber:isInputFormulationNumber, 
            });
            //blur 事件和这个冲突
            //官方例子如此,原因未知
            setTimeout(() => {
                this.onFocus();
            }, 100);
        }
    },
    onFocus() {
        this.setData({focus:true})
    },
    onBlur(){
        this.setData({focus:false})

    },

    //配方号picker选择
    onChange(e) {
        console.log(e.detail.value);
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
    isShow(){
        this.setData({
            isShowPicker: !this.data.isShowPicker
        });
    },

    formSubmit(e) { //发起审批
        //数据校验
        let form = e.detail.value;
        if (this.data.categoryIndex < 0 || form.exchange == "" || form.ov === 0 || form.description == "" || form.formulationNumber == "") {
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }
        let formulationNumber = form.formulationNumber;

        if (this.data.isInputFormulationNumber) {
            formulationNumber  += "(不确定配方号)"
        }
        /*if (this.data.categoryIndex === 1 && this.data.relevantList.length <= 0) { //退换货但没选择审批单
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }*/
        let that = this;
        dd.confirm({
            title: '提示',
            content: '提交后不能撤销,审批意见在钉钉审批应用中查看.',
            confirmButtonText: '提交',
            success: (result) => {
                if (result.confirm === true) {
                    const app = getApp();
                    const userId = app.globalData.userId;
                    const departments = app.globalData.departments;
                    let values = [
                        {name: "类别", value: form.category},
                        {name: "产品配方号", value: formulationNumber},
                        {name: "数量", value: form.ov},
                        {name: "批号", value: form.exchange},
                        {name: "调整产品描述", value: form.description},

                    ];
                    if (that.data.relevantList.length !== 0) {
                        // 关联审批单
                        values.push({name: "退换货审批单", value: that.data.relevantList});
                    }
                    const url = getApp().globalData.domain + "/operateWorkflow.php"

                    dd.httpRequest({
                        url: url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                        data: {
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                progress_code: "PROC-DF7AEE3E-B72E-4A6F-9A5B-DA3FC879039A",
                                originatorUserId: userId,
                                dept_id: departments[departments.length - 1],
                                form_values: values,
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
                                /* dd.showToast({
                                     type: 'success',
                                     content: '审批已发起',
                                     duration: 3000,
                                     success: () => {
                                         dd.navigateBack();
                                     },
                                 });*/
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
            },
        });

    },
    categoryPickerChange(e) {
        this.setData({
            categoryIndex: e.detail.value,
        });
    },

    selectRelevantList(){ //选择关联单
        dd.navigateTo({
            url:"/page/adjustmentPlan/relevantList/relevantList",
        });
    },


});

