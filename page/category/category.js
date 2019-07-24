Page({
  data: {
      list: [
         /* {
              "title": "请假",
              "templateId":"19",
              "progressCode":"PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8"
          },
          {
              "title": "费用申请",
              "templateId":"25",
              "progressCode":"***"
          },
          {
              "title": "接入钉钉审批",
              "templateId":"",

          }, */
  ]
  },
  onLoad() {  //载入流程类别category
      dd.showLoading();
      const url = getApp().globalData.domain+'/getworkflow.php';

      dd.httpRequest({
          url: url,
          method: 'POST',
          data: {
              action: 'get_template_list',
              userName:getApp().globalData.username,
          },
          dataType: 'json',
          success: (res) => {
              if (res.data.success === true) {
                  // dd.alert({content:res.data.content.templateList})
                 this.setData({
                     list:res.data.content.templateList
                 })
              }else{
                  dd.alert({content:"获取流程模版失败."});
              }
          },
          fail: (res) => {
              console.log("httpRequestFail---", res)
              dd.alert({content:"获取流程模版失败"+JSON.stringify(res)});
              dd.hideLoading();
          },
          complete: (res) => {
              // dd.alert({content: JSON.stringify(res)});
              dd.hideLoading();
          }
      })
  },
  workflowFlagTap(e){

      //由于小程序内暂不支持打开对于的审批详情页和待办页面,所以暂不使用
      /* const templateID = e.currentTarget.dataset.templateID;
      dd.navigateTo({
          url: '/page/category/workflowlist/workflowlist?templateID='+templateID
      })*/
      let url;
      switch (e.currentTarget.dataset.progressCode) { //progressCode
          case "PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8": //请假
              url = "/page/leave/leave";
              break;
          case "PROC-EF196C0C-1EE8-4BDB-8D5E-6F2BB2A5B21C": //样品领用
              url = "/page/samplesapply/samplesapply";
              break;
          case "PROC-BCFBCCA9-4A92-46EF-AFE7-C4C70745ED31": //退换货申请
              url = "/page/exchanges/exchanges";
              break;
          default:
              dd.alert({content:"该流程尚不能通过钉钉发起,请联系管理员."})
							return;
      }
      dd.navigateTo({
          url: url
      });
    },
});
