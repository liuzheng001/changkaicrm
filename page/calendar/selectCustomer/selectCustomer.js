Page({
  data: {
      //选择配方号,两级pickerView
      originData:{
          /*{
              "重庆江达铝合金轮圈有限公司": [{
              "sampleRecID": "6DFC100A-56D9-43FD-BD0A-BAE9F2388213",
              "categoryAndTime": "切削类09/11/2019"
              },
               {
              "sampleRecID": "6DFC100A-56D9-43FD-BD0A-BAE9F2388213",
              "categoryAndTime": "切削类09/11/2019"
              }
              ]
          },
              {
              "重庆黎宏机械制造有限公司": {
              "sampleRecID": "124A0676-1922-443B-8DAC-9A1E6FEAFE8F",
              "categoryAndTime": "清洗类11/08/2019"
              }
          },

          }*/
      },
      value:[0,0],
      firstKey:'',
  },
  onLoad() {
    //从后台得到客户和试用记录列表,二级picker
      const url = getApp().globalData.domain+"/fmSampleRec.php";
      dd.httpRequest({
          url: url,
          method: 'get',
          data: { //传递当前签到经纬度
              action:'getSampleList',
              longitude:104,
              latitude:106,
          },
          dataType: 'json',
          success: (res) => {
              // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
              if (res.data.success === true) {
                  const firstKey = Object.keys(res.data.data)[0];
                  let originData = res.data.data;
                  originData['所有'] =[{
                          "sampleRecID": "-1",
                          "categoryAndTime": "所有客户"
                  }]

                  this.setData({
                      originData:originData,
                      firstKey:firstKey
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
            if (firstKey == "所有") {
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
                        }/*else{
                            return;
                        }*/
                    },
                })
            }
        }
        this.setData({
            firstKey: firstKey,
            value:[e.detail.value[0],secondNum],
        });

    },
    onCreateTrackRec(){

    }

});
