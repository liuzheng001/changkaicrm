Page({
  data: {
    customList:[//客户清单
        /*{
            name: '美国',
        },
        {
            name: '中国',
        },*/
     ],
    customIndex: 0,
    picturePath:"",
  },
  onLoad() { //从fm中读取custom值列表
      const url = "http://r1w8478651.imwork.net:9998/eapp-corp/getFmMessage.php";
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
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            customIndex: e.detail.value,
        });
    },
    formSubmit(e) { //发起审批
        /* $progress_code = $_REQUEST['$progress_code'];
         $form_values = $_REQUEST['form_values'];
 //发起人id和department
         $originator_user_id = $_REQUEST['originator_user_id'];
         $dept_id = $_REQUEST['dept_id'];*/
        const app = getApp();
        const userId = app.globalData.userId;
        const departments = app.globalData.departments;

        let that = this;
        let form = e.detail.value;
        const url = "http://r1w8478651.imwork.net:9998/eapp-corp/operateWorkflow.php"
        console.log('form发生了submit事件，携带数据为：', e.detail.value);

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
                         ]}
                     ],
                })
            },
            dataType: 'json',
            traditional: true,//这里设置为true
            success: (res) => {
                dd.alert({content: "审批实例id：" + JSON.stringify(res)});
            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                dd.alert({content: JSON.stringify(res)});
            },
            complete: (res) => {
                dd.hideLoading();
            }
        });
    },
    choosePicture(){
       const t = this;
       let imgPath;
        dd.chooseImage({
            count: 2,
            success: (res) => {
                imgPath = res.filePaths[0];
                // dd.saveImage({url:imgPath});
                // debugger;
                t.setData({
                    picturePath:imgPath
                })
            },
        });
    },
});
