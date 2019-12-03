Page({
  data: {
      // showDetailed:false,//显示数据记录详情,与showModal相反
      showModal:false,
      sampleDataRecID:null,//新数据记录ID
      testCategory: ['现场检测', '取样检测'],
      testCategoryIndex:-1, //检测类型序号
      //选择产品
      selectProduct:[],
      selectProductIndex:-1,
      //选择设备
      selectMachine:[],
      selectMachineIndex:-1,
      //试样类别
      category:'',
      //检测项目
      subjects:[
          /*{name:"外观",classification:"检测项目",testMethod:"目测"},
          {name:"浓度",classification:"检测项目",testMethod:"目测"},
         */

      ],
      addSubjects:[
          /* {name:"外观",classification:"检测项目",testMethod:"目测"},
          {name:"浓度",classification:"检测项目",testMethod:"目测"},*/
      ],
      //媒体信息
      thumbs:[/*{url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
           {url:'http://r1w8478651.mp4',category:'video'},
          {url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'}*/
          ],
      //显示视频预览
      showVideoPreview:false,
      videoUrl:"",
  },
  onLoad() {
      //读取fm选择样品记录列表
      const url = getApp().globalData.domain+"/fmSampleRec.php";
      dd.httpRequest({
          url: url,
          method: 'get',
          data: {
              action:'getSampleMessage',
              sampleID:'6DFC100A-56D9-43FD-BD0A-BAE9F2388213'
          },
          dataType: 'json',
          success: (res) => {
              // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
              this.setData({
                  selectProduct:res.data.data.selectProduct,
                  selectMachine:res.data.data.selectMachine,
                  category:res.data.data.category
              });
          },
          fail: (res) => {
              dd.alert({'content':JSON.stringify(res)})
          },
          complete: (res) => {
          }

      })
  },
  openModal(){
      this.setData({
          showModal:!this.data.showModal
      })
    },
    closeModal(){
        this.setData({
            showModal:false
        })
    },

    testCategoryPickerChange(e) {
        this.setData({
            testCategoryIndex: e.detail.value,
        });
    },
    selectProductPickerChange(e) {
        this.setData({
            selectProductIndex: e.detail.value,
        });
    },
    selectMachinePickerChange(e) {
        this.setData({
            selectMachineIndex: e.detail.value,
        });
    },
    //mask组件触发page(外组件)方法
    onChangeShow(isShow){
        this.setData({
            showModal:isShow
        })
    },
    //mask组件触发page(外组件)方法
    //建立新试样数据,通过fm脚本
    onCreateRecord(){
        const t =this;
        dd.confirm({
            title: '提示',
            content: '确认新建试样记录?',
            confirmButtonText: '确认',
            success: (result) => {
                if(result.confirm === true){
                    const url = getApp().globalData.domain+"/fmSampleRec.php";
                    dd.httpRequest({
                        url: url,
                        method: 'get',
                        data: {
                            action:'createSampleRecord',

                            // $_REQUEST['sampleID'].'|'.$_REQUEST['testCategory'].'|'.$_REQUEST['machineID'].'|'.$_REQUEST['formulaID']
                            sampleID:'6DFC100A-56D9-43FD-BD0A-BAE9F2388213',
                            testCategory:t.data.testCategory[t.data.testCategoryIndex],
                            machineID:t.data.selectMachine[t.data.selectMachineIndex]['machineID'],
                            formulaID:t.data.selectProduct[t.data.selectProductIndex]['formulaID'],
                        },
                        dataType: 'json',
                        success: (res) => {
                            // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                            //填充新数据记录,subjects和addSubjects
                            if (res.data.success===true) {
                                t.data.sampleDataRecID = res.data.data.sampleDataRecID
                                dd.httpRequest({
                                    url: url,
                                    method: 'get',
                                    data: {
                                        action: 'getSampleData',
                                        sampleDataRecID: t.data.sampleDataRecID,
                                        // $_REQUEST['sampleID'].'|'.$_REQUEST['testCategory'].'|'.$_REQUEST['machineID'].'|'.$_REQUEST['formulaID']
                                    },
                                    dataType: 'json',
                                    success: (res) => {
                                        // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                                        //将新建的记录数据内容
                                        this.setData({
                                            subjects: res.data.data.subjects,
                                            addSubjects: res.data.data.addSubjects,
                                            showModal:false,
                                        });
                                    },
                                    fail: (res) => {
                                        dd.alert({'content': JSON.stringify(res)})
                                    },
                                })
                            }

                        },
                        fail: (res) => {
                            dd.alert({'content':JSON.stringify(res)})
                        },
                    })
                }
            },
        })

    },
    //媒体容器相关
    onMediaPreview(e){
        const imageUrl = e.currentTarget.dataset.src;
       /* dd.previewImage({
            urls:[imageUrl]
        });*/
       this.setData({videoUrl:imageUrl})
    },
    onAddMedia(e){
        const t = this;
        let thumbs = this.data.thumbs;
        let options = ['图片', '视频'];

        dd.showActionSheet({
            title: "选择?",
            items: options,
            //cancelButtonText: '取消好了', //android无效
            success: (res) => {
                const index = res.index;
                if (index === 0) { //选择图片
                    dd.chooseImage({
                        count: 9-thumbs.length, //最多只能选9张图片
                        success: (res) => {
                            if(res.filePaths || res.apFilePaths) {
                                res.filePaths.forEach(item => {
                                    const path = item;
                                    //将数据存入,但没有上传
                                    thumbs.push({url:path,category:'image'});
                                })

                                t.setData({
                                        thumbs: thumbs
                                    }
                                );
                            }
                        },
                    });
                }else{//选择视频
                    dd.chooseVideo({
                        sourceType: ['album','camera'],
                        maxDuration: 60,
                        success:(res)=> {
                            // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                            if(res.size>200000000) {
                                dd.alert({content:"视频超过200M不能上传,或大于1分钟"})
                            }else{
                            const path = res.filePath;
                            console.log(res);
                            dd.alert({content: path})
                            //将数据存入,但没有上传
                            thumbs.push({url:path,category:'video'})}
                            t.setData({
                                thumbs:thumbs
                             });
                        },
                        fail: (err)=> {
                            console.log(err)
                        }
                    })
                }
            },
        })
    },
    onDeleteMedia(e){
        const t = this;
        const index = e.currentTarget.dataset.index; //第几张图
        let thumbs = this.data.thumbs;
        thumbs.splice(index,1);
        t.setData({
                thumbs:thumbs
            }
        );

    },
    onUploadMedia() {
        if (this.data.thumbs.length >= 1) {
            dd.confirm({
                title: '上传媒体',
                content: '媒体上传阿里云.',
                confirmButtonText: '提交',
                success: (result) => {
                    dd.showLoading();
                    if (result.confirm === true) {
                        const thumbs = this.data.thumbs;
                        let promiseArr = [];
                        for (let i = 0; i < thumbs.length; i++) {
                            promiseArr.push(updateMedia(thumbs[i]))
                        }
                        //ios不显示 dd.alert({content:results}),但this.data.imageUrls = results执行了原因不明
                        Promise.all(promiseArr)
                            .then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                                dd.hideLoading();
                                dd.alert({content:"上传成功"})
                            })
                    }
                },
                fail: function (res) {
                    dd.hideLoading();
                    dd.alert({content: `上传失败了：${JSON.stringify(res)}`});

                }
            })
        }
    }
});

function updateMedia(thumb) {
    console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve,reject) {
        const url = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/uploadVideoToAili.php"
        const fileType = thumb.category==="image"?"image":"video"
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url:url,
            fileType: fileType,
            fileName: 'file',
            filePath: thumb.url,
            formData:{fileType:fileType},
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result == "success") {
                    //返回上传图片urls
                    resolve(JSON.parse(res.data).fileUrl);
                } else {
                    dd.hideLoading();
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                    reject('failure');
                }
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                reject('failure');
            },
        });
    })


}


