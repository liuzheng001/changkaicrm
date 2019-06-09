Page({
  data: {

      dailyContent :"" ,
      dailyQuestion:"",
      dailyReply   :"",
      scheduleId:0,
  },
  onLoad(query) {//读取scheduleId的日志信息
      dd.showLoading({
          content: '加载中...',
          delay: 1000,
      });
    const scheduleId = query.scheduleId;
    const  t =this;
      const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
      dd.httpRequest({
          url: url,
          method: 'POST',
          data: {
              action:"getDailyRecord",
              scheduleID: scheduleId,
             /* dailyContent:this.data.dailyContent,
              dailyQuestion:this.data.dailyQuestion,
              dailyReply:this.data.dailyReply,*/
          },
          dataType: 'json',
          success: (res) => {
              if (res.data.success === true) {
                 t.setData({
                     scheduleId:scheduleId,
                     dailyContent:res.data.content.dailyContent,
                     dailyQuestion:res.data.content.dailyQuestion,
                     dailyReply:res.data.content.dailyReply,
                 })
              }else{
                  dd.alert({
                      content:'failure:'+JSON.stringify(res)
                  })
              }
          },
          fail: (res) => {
              dd.alert({
                  content:'failure:'+JSON.stringify(res)
              })
          },
          complete: (res) => {
             /* dd.alert({
                  content:'failure:'+JSON.stringify(res)
              })*/
              dd.hideLoading();
          }
      })
  },
  onDailychange(e){//日志内容变更,既input内容变化时,在datailed中event记录
      this.setData({
          [e.currentTarget.dataset.elementName] : e.detail.value
      })
  },
    onSubmit(){ //将数据提交到后台
        dd.showLoading({
            content: '加载中...',
            delay: 1000,
        });
        const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
        dd.httpRequest({
            url: url,
            method: 'POST',
            data: {
                action:"updateDailyRecord",
                scheduleID: this.data.scheduleId,
                dailyContent:this.data.dailyContent,
                 dailyQuestion:this.data.dailyQuestion,
                 dailyReply:this.data.dailyReply,
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success === true) {
                    dd.alert({
                        content:"日志提交成功"
                    })
                }else{
                    dd.alert({
                        content:'failure:'+JSON.stringify(res)
                    })
                }
            },
            fail: (res) => {
                dd.alert({
                    content:'failure:'+JSON.stringify(res)
                })
            },
            complete: (res) => {
                /* dd.alert({
                     content:'failure:'+JSON.stringify(res)
                 })*/
                dd.hideLoading();
            }
        })
    },
});
