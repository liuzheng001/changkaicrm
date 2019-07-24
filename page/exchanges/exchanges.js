Page({
    data: {

        //用户列表
        customList:[//客户清单
            /*{
                name: '美国',
            },
            {
                name: '中国',
            },*/
        ],
        customIndex: -1,
        //类别
        categoryList:[
            "退货","换货"
        ],
        categoryIndex:-1,
        //申请更换货日期,最早日期(这个日期之后5个工作日完成)
        exchangeDate:"",

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
        const url = getApp().globalData.domain+"/getFmMessage.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getcustomlist',
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                this.setData({
                    customList:res.data.content.data
                });
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })
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
        this.setData({
            lostFocus:true,
            inputStatus: {
                marginRight: "-80rpx",
                opacity: 0,
            },
            inputVal:cellValue,
        });
    },

    customChange(e) {
        this.setData({
            customIndex: e.detail.value,
        });
    },
    categorySelect(e){
        this.setData({
            categoryIndex: e.detail.value,
        });
    },

    changeDate(e) {
        const t =this;
        let currentDate  = this.data.exchangeDate;
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
                            exchangeDate:selectDate.format("yyyy-MM-dd")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                        }
                    );

                }
            },
        });
    },

    formSubmit(e) { //发起审批

        // const detailedArr = convertDetailed(this.data.detailed,this)
        let that = this;
        let form = e.detail.value;


        //数据校验
        //用户单位是否在列表中
        // if(this.data.customListform.customName))

        function findFn(item, objIndex, objs){
            return item.name === form.customName;
        }

        if(this.data.customList.findIndex(findFn)==-1){
            dd.alert({content: "客户名称,请检查!"});
            return;        }

        if (this.data.customIndex<0 || form.productName=="" || form.exchangeNumber=="" || form.reason=="" ||this.data.cateporyIndex<0 || this.data.exchangeDate =="" ) {
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }
        const app = getApp();
        const userId = app.globalData.userId;
        const departments = app.globalData.departments;
        const url = getApp().globalData.domain+"/operateWorkflow.php"

        dd.confirm({
            title: '提示',
            content: '提交后不能撤销,审批意见在钉钉审批应用中查看.',
            confirmButtonText: '提交',
            success: (result) => {
                if(result.confirm === true){
                    dd.httpRequest({
                        url:url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                        data: {
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                progress_code: "PROC-BCFBCCA9-4A92-46EF-AFE7-C4C70745ED31",
                                originatorUserId: userId,
                                dept_id: departments[departments.length - 1],
                                form_values: [
                                    {name: "退换货单位", value:this.data.customList[this.data.customIndex].name},
                                    {name: "退换货名称", value:form.productName},
                                    {name:"类别",value:this.data.categoryList[this.data.categoryIndex]},
                                    {name: "申请退换时间", value:this.data.exchangeDate},
                                    {name: "退换货数量", value:form.exchangeNumber},
                                    {name: "退换货原因",value:form.reason },
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

