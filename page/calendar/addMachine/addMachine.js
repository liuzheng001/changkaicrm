Page({
  data: {
    showModal:false,//显示modal
    addPline:true,//true为增加生产线,false为编辑生产线

      customerId:"",

      PLines:[

          /*{
              "progressLineName": "铝轮19线",
              "progressLineId": "946C93C7-8DD0-4160-959B-14636AF30981"
                            "recordId":123

          },
          {
              "progressLineName": "铝轮2线",
              "progressLineId": "8BF88712-9CC8-435D-871D-A6F83551B4DA",
              "recordId":123
          },

          */
],
      PLinesIndex:-1,

      allPLines:[ //包括新增和编辑
         /* {
              "progressLineName": "新增",
              "progressLineId": "-1",
              "recordId":-1

          },
          {
              "progressLineName": "编辑",
              "progressLineId": "-2",
              "recordId":-2
          }*/
      ],
    allPLinesIndex:-1,
      PLineName:"",
      PLineMachine:"",
      PLineProduct:"",
      PLinePosition:"",

    machineName:"",
    machineNum:"",
    machineStation:"",
    remark:"",
    volume:null,
    picture:"",//url
    position:"",

  },
  onLoad() {//得到生产线数据
      updataPLines(this);
  },
    allPLinesPickerChange(e) {
      const index = e.detail.value
        if (this.data.allPLines[index].progressLineId === "-1") {//代表新增产品线
            this.setData({showModal:true,addPline:true});
        }else if (this.data.allPLines[index].progressLineId === "-2") {//代表编辑产品线
            //得到生产线信息
            this.setData({showModal:true,addPline:false,
            });

        }else {
            this.setData({
                allPLinesIndex: e.detail.value,
            });
        }

    },
    PLinesPickerChange(e) {
        const index = e.detail.value
        if (index !== this.data.PLinesIndex) {
            const recordId = this.data.PLines[index].recordId;
            const url = getApp().globalData.domain + "/fmSampleRec.php"
            dd.httpRequest({
                url: url,
                method: 'POST',
                data: {
                    action: 'getPLineInfo',
                    // customerId: this.data.customerId
                    recordId: recordId

                },
                dataType: 'json',
                traditional: true,//这里设置为true
                success: (res) => {
                    if (res.data.success === true) {
                        // dd.alert({content: "建立生产线成功"});
                        this.setData({
                            PLinesIndex: index,
                            PLineName: res.data.data.PLineName,
                            PLineMachine: res.data.data.PLineMachine,
                            PLineProduct: res.data.data.PLineProduct,
                            PLinePosition: res.data.data.PLinePosition,
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
    },
    onInput: function (e) {
      //key是input的标识,
      this.setData({
          [e.target.dataset.key]:e.detail.value
      });


    },
    onCancelRecord() {
      this.setData({
          showModal:false,
          PLineName:"",
          PLineMachine:"",
          PLineProduct:"",
          PLinePosition:"",
          PLinesIndex:-1

      })
    },
    onCreateRecord(){
      const t =this;
        dd.confirm({
            title: '提示',
            content: this.data.addPline === true?'建立新生产线.':'编辑生产线',
            confirmButtonText: '提交',
            success: (result) => {
                if (result.confirm === true) {
                    const url = getApp().globalData.domain + "/fmSampleRec.php"
                    if (this.data.addPline === true) { //代表新增
                        dd.httpRequest({
                            url: url,
                            method: 'POST',
                            data: {
                                action: 'editPLine',//既是新增也是修改
                                values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                    form_values: {
                                        PLineName: this.data.PLineName,
                                        PLineMachine: this.data.PLineMachine,
                                        PLineProduct: this.data.PLineProduct,
                                        PLinePosition: this.data.PLinePosition,
                                    },

                                }),
                                // customerId: this.data.customerId
                                customerId: 35

                            },
                            dataType: 'json',
                            traditional: true,//这里设置为true
                            success: (res) => {
                                if (res.data.success === true) {
                                    dd.alert({
                                        content: "建立生产线成功",
                                        success:(result)=>{
                                            updataPLines(t)
                                        }
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
                    }else{//编辑生产线
                            dd.httpRequest({
                                url: url,
                                method: 'POST',
                                data: {
                                    action: 'editPLine',
                                    values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                        form_values: {
                                            PLineName: this.data.PLineName,
                                            PLineMachine: this.data.PLineMachine,
                                            PLineProduct: this.data.PLineProduct,
                                            PLinePosition: this.data.PLinePosition,
                                        },

                                    }),
                                    // progressLineId: this.data.PLines[this.data.PLinesIndex]
                                     progressLineId: this.data.PLines[this.data.PLinesIndex].recordId
                                },
                                dataType: 'json',
                                traditional: true,//这里设置为true
                                success: (res) => {
                                    if (res.data.success === true) {
                                        dd.alert({
                                            content: "编辑生产线成功",
                                            success:(result)=>{
                                                updataPLines(t)
                                            }
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

            },
            })
    },
    onAddPicture() {
        const t = this;
        dd.chooseImage({
            count: 1, //最多只能选9张图片
            success: (res) => {
                if(res.filePaths || res.apFilePaths) {
                    t.setData({
                            picture: res.filePaths[0]
                        }
                    );
                }
            },
        });
    },
    onPicturePreview(e){
        const imageUrl = e.currentTarget.dataset.src;
        dd.previewImage({
            urls:[imageUrl]
        });
    },
    formSubmit(e) { //添加设备
        let that = this;
        let form = e.detail.value;

        //数据校验
        if (this.data.allPLinesIndex < 0 || form.machineName == "" || form.position == "" || form.machineNum == "" || form.machineStation == "" || form.volume < 0 || form.volue) {
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }


        dd.confirm({
            title: '提示',
            content: '提交后不能撤销.',
            confirmButtonText: '提交',
            success: (result) => {
                if(result.confirm === true){
                    const app = getApp();
                    const url = getApp().globalData.domain+"/fmSampleRec.php"
                    dd.httpRequest({
                        url: url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                 /*       $record['生产线ID'] =$_REQUEST['PLinesId'];
                    $record['设备名称'] =$_REQUEST['machineName'];
                    $record['设备编号'] =$_REQUEST['machineNum'];
                    $record['设备工位'] =$_REQUEST['machineStation'];
                    $record['备注'] = $_REQUEST['remark']?$_REQUEST['remark']:"";
                    $record['设备位置'] =$_REQUEST['position'];
                    $record['水箱容积'] =$_REQUEST['volume'];
                    $record['设备图片'] =$_REQUEST['pictureUrl']; //图片在服务器中的位置*/
                        data: {
                            action: 'createMachine',
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                form_values: {
                                    machineName:form.machineName,
                                    machineNum:form.machineNum,
                                    machineStation:form.machineStation,
                                    remark:form.remark,
                                    position:form.position,
                                    volume:form.volume,
                                    PLinesId:that.data.allPLines[that.data.allPLinesIndex].progressLineId
                                },
                            }),


                        },
                        dataType: 'json',
                        traditional: true,//这里设置为true
                        success: (res) => {
                            if (res.data.success === true){
                                if (this.data.picture !== "") {
                                    updatePicture(this.data.picture,'设备','设备图片',res.data.machineRecordId);
                                }else{
                                    dd.alert({content: '提交成功'});

                                }

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
    onDeletePicture(e){
        const t = this;
        const index = e.currentTarget.dataset.index; //第几张图

        t.setData({
                picture:""
            }
        );

    },
});
/*$layoutName = $_REQUEST['layoutName'];
$recordID = $_REQUEST['recordID'];
$fieldName = $_REQUEST['fieldName'];*/
function updatePicture(imgPath,layoutName,fieldName,recordID) {
        dd.uploadFile({
            url: getApp().globalData.domain + '/upload/uploadContainer.php',
            fileType: 'image',
            fileName: 'file',
            filePath: imgPath,
            formData:{
                layoutName:layoutName,
                fieldName:fieldName,
                recordID:recordID
            },
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result!== "success") {
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                }else{
                    dd.alert({content: '提交成功'});
                }
            },
            fail: function (res) {
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
            },
        });

}

function updataPLines(t) {
    //读取fm选择样品记录列表
    const url = getApp().globalData.domain + "/fmSampleRec.php";
    dd.httpRequest({
        url: url,
        method: 'get',
        data: {
            action: 'getPLines',
            customerId: 35//江达

        },
        dataType: 'json',
        success: (res) => {
            // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
            if (res.data.success) {
                const allplines =  [...res.data.data.progressLines,...[{
                    "progressLineName": "新增",
                    "progressLineId": "-1",
                    "recordId":-1

                },
                    {
                        "progressLineName": "编辑",
                        "progressLineId": "-2",
                        "recordId":-2
                    }]]
                t.setData({
                    allPLines: allplines,
                    PLines:res.data.data.progressLines,
                    showModal:false,
                    PLineName:"",
                    PLineMachine:"",
                    PLineProduct:"",
                    PLinePosition:"",
                    PLinesIndex:-1
                });
            }else{
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
