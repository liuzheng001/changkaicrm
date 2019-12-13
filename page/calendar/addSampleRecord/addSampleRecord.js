Page({
  data: {
      // showDetailed:false,//显示数据记录详情,与showModal相反
      showModal:true,
      showVideo:false,
      sampleID:null,//试用记录ID
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
      //媒体信息,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
      thumbs:[
          /*{url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
          {url:'http://r1w8478651.mp4',category:'video'},
          {url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
          {url:'http://r1w8478651.mp4',category:'video'}*/
          ],
      //显示视频预览
      showVideoPreview:false,
      videoUrl:"",
  },
  onLoad(query) {
      //将进入page标志设为true
      const app = getApp();
      app.globalData.sampleDetailPage = true;
      this.data.sampleID = query.sampleID;
      //读取fm选择样品记录列表
      const url = getApp().globalData.domain+"/fmSampleRec.php";
      dd.httpRequest({
          url: url,
          method: 'get',
          data: {
              action:'getSampleMessage',
              sampleID:query.sampleID
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
    onUnload(){
      console.log("返回键按下,page销毁")
      //真机上可调试,ide直接忽略
    dd.alert({content:JSON.stringify(this.data.subjects)})
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
    onCancelRecord(isShow){
        dd.confirm({
            title: '提示',
            content: '放弃新建样品跟踪记录?',
            confirmButtonText: '放弃',
            cancelButtonText:'再看看',
            success: (result) => {
                if(result.confirm === true){
                    dd.navigateBack()
                }
            },
        })
    },
    //mask组件触发page(外组件)方法
    //建立新试样数据,通过fm脚本
    onCreateRecord(){
        const t =this;
        //校验数据
        if (t.data.testCategoryIndex<0 || t.data.selectMachineIndex<0 || t.data.selectProductIndex<0) {
            dd.alert({content:'数据不正确,请检查'})
            return;
        }
        //弃用,使用事务提交,不先建立记录数据
        /*const url = getApp().globalData.domain+"/fmSampleRec.php";
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
        })*/
        const url = getApp().globalData.domain+"/fmSampleRec.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action:'getDataRecordTemplate',
                // $_REQUEST['sampleID'].'|'.$_REQUEST['testCategory'].'|'.$_REQUEST['machineID'].'|'.$_REQUEST['formulaID']
                // sampleID:'6DFC100A-56D9-43FD-BD0A-BAE9F2388213',
                sampleID:this.data.sampleID,
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success===true) {
                    // dd.alert({'content': JSON.stringify(res)})
                    //将新建的记录数据内容
                    this.setData({
                        subjects: res.data.data.subjects,
                        addSubjects: res.data.data.addSubjects,
                        showModal:false,
                    });
                }
            },
            fail: (res) => {
                dd.alert({'content': JSON.stringify(res)})
            },
        })
},
    //媒体容器相关
    onMediaPreview(e){
      const imageUrl = e.currentTarget.dataset.src;
      const category = e.currentTarget.dataset.category;
       if (category==='video') {
           this.setData({videoUrl:imageUrl,
               showVideo:true})
       }else{
           dd.previewImage({
               urls:[imageUrl]
           })
       }
    },
    onCloseVideo(){
        this.setData({showVideo:false})
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
                                let promiseArr = [];
                                res.filePaths.forEach(path => {
                                    promiseArr.push(updateImageToServer({url:path,category:'image'}))
                                })
                                dd.showLoading();
                                Promise.all(promiseArr).then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                                    dd.hideLoading();
                                    dd.alert({content:"上传成功"})
                                    results.forEach(item => {
                                        thumbs.push({url:item,category:'image'});
                                    })
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                    dd.hideLoading();
                                })
                            //将数据存入,但没有上传
                            /*if(res.filePaths || res.apFilePaths) {
                                res.filePaths.forEach(item => {
                                    const path = item;

                                    thumbs.push({url:path,category:'image'});
                                })
                                t.setData({
                                        thumbs: thumbs
                                    }
                                );
                            }*/

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
                            }else {
                                const path = res.filePath;
                                dd.showLoading();

                                /* //将数据存入,但没有上传
                                 thumbs.push({url:path,category:'video'})}
                                 t.setData({
                                     thumbs:thumbs
                                  });*/

                                //直接上传到应用服务器
                                //development服务器
                                const url = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/uploadMediaToServer.php"
                                dd.uploadFile({
                                    // url: getApp().globalData.domain + '/upload/upload.php',
                                    url:url,
                                    fileType: 'video',
                                    fileName: 'file',
                                    filePath: path,
                                    formData:{fileType:'video'},
                                    success: res => {
                                        console.log(JSON.parse(res.data));
                                        const data = JSON.parse(res.data)
                                        if (data.result == "success") {
                                            //返回上传图片urls
                                            dd.hideLoading();
                                            dd.alert({content: "上传成功"})
                                            thumbs.push({url:data.fileUrl,category:'video'})
                                        t.setData({
                                            thumbs:thumbs
                                        });

                                        } else {
                                            dd.hideLoading();
                                            dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                                        }
                                    },
                                    fail: function (res) {
                                        dd.hideLoading();
                                        dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                                    },
                                });
                            }
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

        //需将应用服务器中的媒体文件删除
            dd.confirm({
                title: '删除视频',
                content: '确定删除视频?.',
                confirmButtonText: '确认',
                success: (result) => {
                    if (result.confirm === true) {
                        dd.showLoading();
                        const url = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/deleteUploadMedia.php"
                        dd.httpRequest({
                            url: url,
                            method: 'POST',
                            data: {
                                urlPath: thumbs[index].url,
                            },
                            dataType: 'json',
                            success: (res) => {
                                if (res.data.result === 'success') {
                                    thumbs.splice(index, 1);
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                } else {
                                    dd.alert({content: "删除上传文件失败,稍后再试"});
                                }
                                dd.hideLoading();

                            },
                            fail: (res) => {
                                console.log("httpRequestFail---", res)
                                dd.hideLoading();
                            },

                        })
                    }
                }
            })

    },
    onUploadMedia() {
        if (this.data.thumbs.length >= 1) {
            const t =this;
            const thumbs =this.data.thumbs
            dd.confirm({
                title: '上传媒体',
                content: '媒体上传阿里云.',
                confirmButtonText: '提交',
                success: (result) => {
                    //将客户端文件通过应用服务器中转,再上传阿里云
                    /*if (result.confirm === true) {
                        dd.showLoading();
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
                    }*/
                    const url = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/uploadMediasToAili.php"
                    //将应用服务器临时文件,上传阿里云
                    dd.httpRequest({
                        url: url,
                        method: 'post',
                        data: {
                            thumbs:JSON.stringify(thumbs)
                        },
                        success: function (res) {
                            if(res.data.result == 'success') {
                                dd.alert({content:"已上传阿里云."});
                                t.setData({
                                        thumbs: []
                                    }
                                );
                            }else{
                                dd.alert({content:"上传阿里云失败"});
                            }
                        },
                        fail: function (res) {
                            dd.alert({content:"上传阿里云失败."+JSON.stringify(res)});
                        }
                    });                },
                fail: function (res) {
                    dd.hideLoading();
                    dd.alert({content: `上传失败了：${JSON.stringify(res)}`});

                }
            })
        }
    },
    onSubmit(){ //提交到fm
    //数据校验


    //
    },

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

function updateImageToServer(thumb) {
    // console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve,reject) {
        const url = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/uploadMediaToServer.php"
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
// var arr=[{name:2,id:3},{name:2,id:4},{name:3,id:5},{name:3,id:6},{name:1,id:1},{name:1,id:2}];
// sortArr( arr, 'name');

// 传入一个数组
// 按照特定方式格式化
/*function sortArr(arr, str) {
    var _arr = [],
        _t = [],
        // 临时的变量
        _tmp;
 
    // 按照特定的参数将数组排序将具有相同值得排在一起
    arr = arr.sort(function(a, b) {
        var s = a[str],
            t = b[str];
 
        return s < t ? -1 : 1;
    });
 
    if ( arr.length ){
        _tmp = arr[0][str];
    }
    // console.log( arr );
    // 将相同类别的对象添加到统一个数组
    for (var i in arr) {
        console.log( _tmp);
        if ( arr[i][str] === _tmp ){
            console.log(_tmp)
            _t.push( arr[i] );
        } else {
            _tmp = arr[i][str];
            _arr.push( _t );
            _t = [arr[i]];
        }
    }
    // 将最后的内容推出新数组
    _arr.push( _t );
    return _arr;
}
 */


