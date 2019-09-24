Page({
    data: {

        beginDate:-1,


    },
    onLoad() { //从fm中读取custom值列表
        //初始化
        const initDate = new Date().format('yyyy-MM-dd 09:00');
        this.setData({
            beginDate:initDate,
        })
    },

    formSubmit(e) { //发起审批
      //数据验证
        /*if(form.leaveStyle==="请选择" || form.timeLength === 0 || form.reason===""){
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
                    const departments = app.globalData.departments;

                    let that = this;
                    let form = e.detail.value;
                    const url = getApp().globalData.domain+"/operateWorkflow.php"

                    dd.httpRequest({
                        url: url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                        data: {
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                progress_code: "PROC-62CE76C7-7187-4AFE-8B67-F87C738BCA0B",
                                originatorUserId: userId,
                                dept_id: departments[departments.length - 1],
                                form_values: [
                                    {name: "派工开始时间", value:this.data.beginDate},
                                    {name: "派工时长", value:form.timeLength},
                                    {name: "申请派工人数", value:form.numberOfPeople},
                                    {name: "派工事件", value:form.reason},
                                    {name: "备注说明", value:form.remakes},

                                ],
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
        })

    },

    changeDate(e) {
        const t = this;
        let currentDate = this.data.beginDate;
        let today = new Date();
        today.setHours(0), today.setMinutes(0), today.setSeconds(0), today.setMilliseconds(0);
        dd.datePicker({
            format: 'yyyy-MM-dd HH:mm',
            currentDate: currentDate,
            success: (res) => {
                // dd.alert({content:JSON.stringify(res)});
                if (typeof res.date !== 'undefined') {
                    //检验日期,不能小于今天
                    const selectDate = new Date(res.date.replace(/-/g,"/"));
                    // dd.alert({content:"sel"+selectDate});

                    if (selectDate < today) { //要去掉时分秒
                        dd.alert({content: "选择的日期已过期"})
                        return;
                    }
                    t.setData({
                            beginDate: selectDate.format("yyyy-MM-dd hh:mm")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                        }
                    );

                }
            },
        });
    },

});
