Page({
  data: {
      list: [
          /*{
              group:"公司",
              data:[{auditingNum: 0, group: "公司", progressCode: "PROC-77CFA8D4-6F7D-4D31-AA93-65DCC3088448", templateId: 11, title: "维护品领用流程"},
                  {auditingNum: 17, group: "公司", progressCode: "PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8", templateId: 19, title: "请假"}]
          },
          {
              group:"销售",
              data:[
                  {auditingNum: 0, group: "销售", progressCode: "PROC-77CFA8D4-6F7D-4D31-AA93-65DCC3088448", templateId: 11, title: "维护品领用流程"},
                  {auditingNum: 17, group: "销售", progressCode: "PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8", templateId: 19, title: "请假"}
                  ]
          },*/
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
                 const  list = blockSort(res.data.content.templateList);
                 
                 this.setData({
                     list:list
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
          case "PROC-7E4C2322-CAAF-4FF9-9D76-F8ECE35BDF8A": //急件申请
              url = "/page/emergencyFood/emergencyFood";
              break;
          case "PROC-77CFA8D4-6F7D-4D31-AA93-65DCC3088448": //急件申请
              url = "/page/emergencyFood/emergencyFood";
              break;
          case "PROC-62CE76C7-7187-4AFE-8B67-F87C738BCA0B": //派工申请
              url = "/page/dispatchedWorker/dispatchedWorker";
              break;
          case "PROC-38F20E0E-72C5-4838-8BDC-BAA6F91DBBB7": //付款流程
              url = "/page/pay/pay";
              break;
          case "PROC-DF7AEE3E-B72E-4A6F-9A5B-DA3FC879039A": //调整方案
              url = "/page/adjustmentPlan/adjustmentPlan";
              break;
          default:
              dd.alert({content:"该流程尚不能通过钉钉发起,请联系管理员."})
							return;
      }
      dd.navigateTo({
          url: url
      });
    },
    workflowDebug(){
        dd.navigateTo({
            url:"/page/adjustmentPlan/adjustmentPlan",
        });
    }

});

function blockSort(arr) {  //排序并分组
    let map = {},
        dest = [];
    for(let i = 0; i < arr.length; i++){
        let ai = arr[i];
        if(!map[ai.group]){
            dest.push({
                group: ai.group,
                data: [ai]
            });
            map[ai.group] = ai;
        }else {
            for(let j = 0; j < dest.length; j++){
                let dj = dest[j];
                if(dj.group == ai.group){
                    dj.data.push(ai);
                    break;}
            }
        }
    }
    return dest;

}
