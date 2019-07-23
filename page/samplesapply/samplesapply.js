Page({
  data: {
      detailed: [
        
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
      ],
      // thumbs:['http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
      //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
      //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg',
      //     'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'],
      thumbs:[],

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
        //收费列表
      costList:[
          '收费','不收费','合格后,收费'
      ],
      costIndex:-1,
      //领取方式
      getwayList:[
          '技术部领取','生产部领取'
      ],


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
  customChange(e) {
        this.setData({
            customIndex: e.detail.value,
        });
    },
    costSelect(e){
        this.setData({
            costIndex: e.detail.value,
        });
    },
    getwaySelect(e){
        const index = e.currentTarget.dataset.index;
        const  target = `detailed[${index}].getwayIndex`;
        this.setData({
            [target]: e.detail.value,
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
    catchDelete(e){  //不冒冒泡删除
        const row = e.currentTarget.dataset.index;
        let list = this.data.detailed;
        list.splice(row,1);
        this.setData({
            "detailed":list
        })

    },
    onAdd() {
        let list = this.data.detailed
        list.push({
            produceName: "",
            number: 0,
            getway:"",
            getDate:"2019-5-12",
        });
        this.setData({
            detailed:list
        })
    },
    onEntryChange(e){//明细入口数据变化,既input内容变化时,在datailed中记录
        const row = e.currentTarget.dataset.index;
        const fieldName = e.currentTarget.dataset.name;
        let list = this.data.detailed;
        list[row][fieldName] = e.detail.value ;
        this.setData({
            "detailed":list
        })

    },
    formSubmit(e) { //发起审批

     // const detailedArr = convertDetailed(this.data.detailed,this)
    let that = this;
    let form = e.detail.value;


    //数据校验
    if (this.data.customIndex<0 || form.description=="" || form.demandNumber=="" || this.data.costIndex<0  ) {
        dd.alert({content: "提交数据有误,请检查!"});
        return;
    }

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
                             dd.alert({content: results})
                             const app = getApp();
                             const userId = app.globalData.userId;
                             const departments = app.globalData.departments;
                             const url = getApp().globalData.domain+"/operateWorkflow.php"

                             /* form_values: [
                                  {name: '["开始时间","结束时间"]', value: JSON.stringify([form.begin_time,form.finish_time])},
                                  {name: "事由", value: form.reason},
                                  {name: "明细表", value: [
                                          [{"name": "第一行", "value": "要"},
                                              {"name": "第二行", "value": "人"}],
                                          [{"name": "第一行", "value": "sdg"},
                                              {"name": "第二行", "value": "dfadf"}]
                                      ]
                                  },
                                  {name:"图片",value:[
                                          form.picture
                                      ]},
                                  {name:"附件",value:[
                                          {
                                              // {"data":[{"spaceId":848072798,"fileId":"6602947770","fileName":"some.mp4","fileSize":4342303,"fileType":"file"}]}
                                              "spaceId":"1562091972",
                                              "fileName":"some.pdf",
                                              "fileSize":"97467",
                                              "fileType":"pdf",
                                              "fileId":"6603245738"
                                          }

                                      ]}
                              ],*/
                             dd.httpRequest({
                                 url: url,
                                 method: 'POST',
                                 // headers:{'Content-Type': 'application/json'},
                                 data: {
                                     values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                         progress_code: "PROC-EF196C0C-1EE8-4BDB-8D5E-6F2BB2A5B21C",
                                         originatorUserId: userId,
                                         dept_id: departments[departments.length - 1],
                                         form_values: [
                                             {name: "申请单位", value:this.data.customList[this.data.customIndex].name},
                                             {name: "现场描述", value:form.description},
                                             {name:"媒体容器",value:results},
                                             {name: "需求数量", value:form.demandNumber},
                                             {name: "预估样品费用", value:form.sampleCost},
                                             {name: "是否收费",value:this.data.costList[this.data.costIndex] },
                                             /*        {name: "销售部长意见", value:form.salesSuggestion},
                                                     {name: "样品明细", value: detailedArr},
                                                     {name: "样品使用要点", value: form.keyPoints},
                                                     {name: "总经理意见", value: form.managerSuggestion},*/
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
