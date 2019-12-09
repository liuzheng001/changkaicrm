

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

       
        timeSection:['上午','中午','下午'],
        beginDate:-1,
        endDate:-1,

        beginSection:-1, //开始时间段
        endSection:-1, //结束时间段
        timeLength:0,
        customIndex: 0,
        picturePath:"",
        videoPath:"",

        relevantList:[] //关联的审批钉钉实例ID,从relevantList page返回

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
        if(this.data.categoryIndex<0 || form.exchange == "" || form.ov=== 0 || form.description==""){
            dd.alert({content: "提交数据有误,请检查!"});
            return;
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
                if(result.confirm === true){
                    const app = getApp();
                    const userId = app.globalData.userId;
                    const departments = app.globalData.departments;
                    let values = [
                        {name: "类别", value:form.category},
                        {name: "产品配方号", value:form.formulationNumber},
                        {name: "数量", value:form.ov},
                        {name: "批号", value:form.exchange},
                        {name: "调整产品描述", value:form.description},

                    ];
                    if (that.data.relevantList.length !== 0 ) {
                        // 关联审批单
                       values.push( {name: "退换货审批单", value: that.data.relevantList});
                    }
                    const url = getApp().globalData.domain+"/operateWorkflow.php"

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
                            if (res.data.errcode == 0){
                                dd.alert({content: "审批已发起,id:" + res.data.process_instance_id,
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
                }
            },
        });

    },
    categoryPickerChange(e) {
        this.setData({
            categoryIndex: e.detail.value,
        });
    },
    timeSectionPickerChange(e){
        if(e.currentTarget.dataset.section === 'end'){
            this.setData({
                endSection : e.detail.value,
                timeLength:timeLength(this.data.beginDate,this.data.beginSection,this.data.endDate,e.detail.value)
            });
        }else{
            this.setData({
                beginSection : e.detail.value,
                timeLength:timeLength(this.data.beginDate,e.detail.value,this.data.endDate,this.data.endSection)
            });

        }

    },
    changeDate(e) {
        let currentDate ;
        if (e.currentTarget.dataset.status === 'beginDate') {
            currentDate = this.data.beginDate;
        }else{
            currentDate = this.data.endDate;
        }
        dd.datePicker({
            format: 'yyyy-MM-dd',
            currentDate: currentDate,
            success: (res) => {
                /* dd.alert({
                     content: res.date,
                 });*/
                if (typeof res.date !== 'undefined') {
                    //检验日期,开始日期必须小于等于结束日期
                    if (e.currentTarget.dataset.status === 'beginDate') {
                        if(new Date(res.date)>new Date(this.data.endDate)){
                            dd.alert({content:"开始日期不能大于结束日期"})
                            return;
                        }
                    }else{
                        if(new Date(res.date)<new vDate(this.data.beginDate)){
                            dd.alert({content:"结束日期不能小于开始日期"})
                            return;
                        }
                    }


                    if (e.currentTarget.dataset.status === 'beginDate') {
                        this.setData({
                            beginDate: res.date,
                            timeLength: timeLength(res.date, this.data.beginSection, this.data.endDate, this.data.endSection)

                        });
                    } else {
                        this.setData({
                            endDate: res.date,
                            timeLength: timeLength(this.data.beginDate, this.data.beginSection, res.date, this.data.endSection)

                        });
                    }
                }
            },
        });
    },
    selectRelevantList(){ //选择关联单
        dd.navigateTo({
            url:"/page/adjustmentPlan/relevantList/relevantList",
        });
    },


});

