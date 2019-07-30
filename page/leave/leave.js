function timeLength(beginDate,beginSection,endDate,endSection){
    /*Let ( [天数差 = 请假结束日期 - 请假开始日期;
    开始阶段 = Case ( 请假开始阶段 = "上午";0;请假开始阶段 = "中午";1;请假开始阶段 = "下午";1    );
    结束阶段 = Case ( 请假结束阶段 = "上午";1;请假结束阶段 = "中午";1;请假结束阶段 = "下午";2    );
    阶段差 =  If (  结束阶段 - 开始阶段  ≥ 0;结束阶段 - 开始阶段;结束阶段 -开始阶段 +2) ;
    最小请假单位 =4 ];

    天数差 * 8 + 阶段差 *最小请假单位)*/
    let  stageDif,DateDif;
    const minUnit = 4;
    DateDif = new Date(endDate).getTime() - new Date(beginDate).getTime();
    DateDif = parseInt(DateDif / (1000 * 60 * 60 * 24));


    if(endSection===0){
        endSection = 1;
    }
    if(endSection - beginSection>=0){
        stageDif = endSection - beginSection;
    }else{
        stageDif = endSection - beginSection + 2;
    }

    return DateDif * 8 + minUnit * stageDif;

}
Page({
    data: {
        leaveArray: ['事假', '病假', '婚假', '丧假','产假'],
        leaveStyleIndex:-1, //请假类型序号
        timeSection:['上午','中午','下午'],
        beginDate:-1,
        endDate:-1,

        beginSection:-1, //开始时间段
        endSection:-1, //结束时间段
        timeLength:0,
        customIndex: 0,
        picturePath:"",
        videoPath:"",

    },
    onLoad() { //从fm中读取custom值列表
        //初始化
        const initDate = new Date().format('yyyy-MM-dd');
        this.setData({
            beginDate:initDate,
            endDate:initDate,
            beginSection:0,
            endSection:2,
            timeLength:8,//timeLength(initDate,0,initDate,1)
        })

    },

    formSubmit(e) { //发起审批
        let form = e.detail.value;
        if(form.leaveStyle==="请选择" || form.timeLength === 0 || form.reason===""){
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }
        dd.confirm({
            title: '提示',
            content: '提交后不能撤销,审批意见在钉钉审批应用中查看.',
            confirmButtonText: '提交',
            success: (result) => {
                if(result.confirm === true){
                    const app = getApp();
                    const userId = app.globalData.userId;
                    const departments = app.globalData.departments;
                    const url = getApp().globalData.domain+"/operateWorkflow.php"

                    dd.httpRequest({
                        url: url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                        data: {
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                progress_code: "PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8",
                                originatorUserId: userId,
                                dept_id: departments[departments.length - 1],
                                form_values: [
                                    {name: "请假类型", value:form.leaveStyle},
                                    {name: "开始日期", value:form.beginDate},
                                    {name: "开始段", value:form.beginSection},
                                    {name: "结束日期", value:form.endDate},
                                    {name: "结束段", value:form.endSection},
                                    {name: "时长", value:form.timeLength},
                                    {name: "事由", value: form.reason},

                                    //test 关联审批单
                                    // {name: "关联审批单", value: ["4ba9876a-e030-4c0f-9768-1b28795f1fc8","918bd7e8-659d-4a50-9c75-e19d49d3d294"]},
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
    leaveStylePickerChange(e) {
        this.setData({
            leaveStyleIndex: e.detail.value,
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
                            if(new Date(res.date)<new Date(this.data.beginDate)){
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
        }

});
