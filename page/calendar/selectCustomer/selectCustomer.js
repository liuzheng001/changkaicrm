Page({
  data: {
      //选择配方号,两级pickerView
      customList:{},//客户清单
      searchList:{},//搜索的客户列表
      inputVal:"",
      historySearch:[],//历史搜索记录,storge存入

      sampleDataRecID:0,//记录数据ID
      value:[0,0],
      firstKey:'',
      disableButton:false,

  },
  onLoad() {
      const t = this;
      //从后台得到客户和试用记录列表,二级picker
      /* const url = getApp().globalData.domain+"/fmSampleRec.php";
       dd.httpRequest({
           url: url,
           method: 'get',
           data: { //传递当前签到经纬度
               action:'getSampleList',
              /!* longitude:104,
               latitude:106,*!/
               userId:getApp().globalData.userId,//钉钉usrid
               userName:getApp().globalData.username,//钉钉usrname,未用
           },
           dataType: 'json',
           success: (res) => {
               // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
               if (res.data.success === true) {
                   const firstKey = Object.keys(res.data.data)[0];
                   let originData = res.data.data;
                   const disableButton = !originData[firstKey][0].isProjectAudit;
                  /!* originData['所有'] =[{
                           "sampleRecID": "-1",
                           "categoryAndTime": "所有客户"
                   }]*!/
                   this.setData({
                       disableButton:disableButton,//方案未提交,新建和进入列表按钮均不能操作
                       originData:originData,
                       firstKey:firstKey
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
       })*/

      const url = getApp().globalData.domain + "/getFmMessage.php";
      dd.httpRequest({
          url: url,
          method: 'get',
          data: {
              action: 'getcustomlist',
          },
          dataType: 'json',
          success: (res) => {
              // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
              this.setData({
                  customList: res.data.content.data,
                  searchList: res.data.content.data
              });
          },
          fail: (res) => {
              dd.alert({'content': JSON.stringify(res)})
          },
          complete: (res) => {
          }

      })

      dd.getStorage({
          key: 'historySearch',
          success: function (res) {
              //不存在samleRecord key时，res.data为null
              t.setData({
                  historySearch: res.data.historySearch,
              });
          },
          fail: function () {

          },
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
            searchList: this.data.customList
        });
    },
    // 搜索框输入值更新
    onInputSearch: function (e) {
        const searchList = showSearchList(this.data.customList,e.detail.value);
        // debugger;
        this.setData({
            inputVal: e.detail.value,
            searchList:searchList
        });
    },
    //点击客户列表触发
    getSearchCell(e){
        let t =this;
        let historySearch=this.data.historySearch;
        const id = e.currentTarget.dataset.id;
        const name = e.currentTarget.dataset.name;
        const options = ['新增数据','查看数据']
        dd.showActionSheet({
            title: "选择?",
            items: options,
            //cancelButtonText: '取消好了', //android无效
            success: (res) => {
                const index = res.index;
                switch (index) {
                    case 0://新增数据
                        // dd.showLoading(); //由于写入stoarge是异步的,通过挂起输入避免问题
                        //记入historySearch,并记入storage
                        /*let inHistory=historySearch.filter(function (item) {//利用filter具有筛选和截取的作用，筛选出数组中name值与文本框输入内容是否有相同的字段
                            return item.id === id;
                        });
                        if (inHistory.length === 0 ) {
                            if (historySearch.length >= 6) {
                                historySearch.splice(5, 8);
                            }
                            historySearch.splice(0, 0, {id,name});
                        }*/
                        //其次得到这个对象在数组中对应的索引,并删除然后在数组头追加
                        const indexValue = historySearch.findIndex(item=>item.id == id)
                        if(indexValue===-1) { //没有该客户历史记录
                            if (historySearch.length >= 6) {
                                historySearch.splice(5, 8);
                            }
                            historySearch.splice(0, 0, {id, name});
                        }else if (indexValue>0) {//有记录,且不是第一个
                            historySearch.splice(indexValue,1);
                            historySearch.splice(0, 0, {id,name});
                        }
                        dd.setStorage({
                            key: 'historySearch',
                            data: {
                                historySearch:historySearch
                            },
                            success: function () {
                                // dd.alert({content: '写入成功'+cellValue});
                                // dd.hideLoading();
                                t.setData({
                                    historySearch: historySearch,
                                });
                                //导航到新增数据page,带参数customList的客户id
                                dd.navigateTo({url: '/page/calendar/addSampleRecord/addSampleRecord?customerId='+id});
                            }
                        });
                        break
                    case 1://查看数据
                        //导航到新增数据page,带参数customList的客户id
                        dd.navigateTo({url: '/page/calendar/editSampleRecord/sampleList/sampleList?customerId='+id});
                        break
                    default:return
                }

            },
        })




        /*this.setData({
            lostFocus:true,
            inputStatus: {
                marginRight: "-80rpx",
                opacity: 0,
            },
            inputVal:cellValue,
        });*/
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
            /*if (firstKey == "所有") {
                dd.confirm({
                    title: '提示',
                    content: '列出所有客户?',
                    confirmButtonText: '确认',
                    success: (result) => {
                        if(result.confirm === true){
                            const url = getApp().globalData.domain+"/fmSampleRec.php";
                            dd.httpRequest({
                                url: url,
                                method: 'get',
                                data: {
                                    action:'getSampleList',
                                },
                                dataType: 'json',
                                success: (res) => {
                                    // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                                    if (res.data.success === true) {
                                        const firstKey = Object.keys(res.data.data)[0];
                                        this.setData({
                                            originData:res.data.data,
                                            firstKey:firstKey,
                                            value:[0,0]
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
                        }/!*else{
                            return;
                        }*!/
                    },
                })
            }*/
        }

      if (this.data.originData[firstKey][secondNum].isProjectAudit == false) {
          dd.alert({content:'试用方案技术部尚未批准,请联系批准方能建立跟踪记录'});
          this.setData({
              disableButton:true,//方案未提交,新建和进入列表按钮均不能操作
              firstKey: firstKey,
              value:[e.detail.value[0],secondNum],
          })
      }else{
          this.setData({
              disableButton:false,
              firstKey: firstKey,
              value:[e.detail.value[0],secondNum],
          })
      }

    },
    onInput(e) {
         this.data.sampleDataRecID = e.detail.value;
    },

    onCreateTrackRec(){
        const key = this.data.firstKey,num = this.data.value[1];

        const sampleID = this.data.originData[key][num].sampleRecID;
        dd.navigateTo({
            url: "/page/calendar/addSampleRecord/addSampleRecord?sampleID="+sampleID
        })
  },
    onEditTrackRec(){
        const key = this.data.firstKey,num = this.data.value[1];
        const sampleID = this.data.originData[key][num].sampleRecID;
        dd.navigateTo({
            url: "/page/calendar/editSampleRecord/sampleList/sampleList?sampleID="+sampleID
        })
    }


});

function showSearchList(allList,query) { //原始数据


    var searchList=allList.filter(function (item) {//利用filter具有筛选和截取的作用，筛选出数组中name值与文本框输入内容是否有相同的字

        return item.name.indexOf(query)>-1;//索引name

    });

    return searchList;
}



