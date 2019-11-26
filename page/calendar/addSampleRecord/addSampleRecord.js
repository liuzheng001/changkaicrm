Page({
  data: {
      showModal:false,
      testCategory: ['现场检测', '取样检测'],
      testCategoryIndex:-1, //检测类型序号
      //选择产品
      selectProduct:[],
      selectProductIndex:-1,
      //选择设备
      selectMachine:[],
      selectMachineIndex:-1,
      //试样类别
      category:''
  },
  onLoad() {
      //读取fm选择样品记录列表
      const url = getApp().globalData.domain+"/fmSampleRec.php";
      dd.httpRequest({
          url: url,
          method: 'get',
          data: {
              action:'getSampleMessage',
              sampleID:'369C0181-2C3E-4816-A515-26823341FCB5'
          },
          dataType: 'json',
          success: (res) => {
              // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
              this.setData({
                  selectProduct:res.data.content.response.data.selectProduct,
                  selectMachine:res.data.content.response.data.selectMachine,
                  category:res.data.content.response.data.category
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
    onChangeShow(isShow){
        this.setData({
            showModal:isShow
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
});


