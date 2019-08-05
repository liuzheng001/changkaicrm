/**
 * 由于小程序内暂不支持打开对于的审批详情页和待办页面,所以暂不使用
 */
Page({
  data: {

      templateID: "",
      start_time:1496678400000,
      cursor:1,
      /*//用于标识是否还有更多的状态,0代表没有流程了,1代表后面还有
      state: 1,*/


    //用于数组的追加和暂存
      allProject:[],



    //用于渲染页面的数组

      listData:[//日程表
         /* {
              "instanceID": "d6f0436a-6392-47ec-853e-e89ee3f19088",
              "退换货单位": "湖北荆州带钢厂",
              "退换货名称": "12",
              "退换货数量": 12,
              "申请退换时间": "07/21/2019",
              "checked":false
          },
          {
              "instanceID": "ff0124ca-f160-432a-bc4f-2e6ea818c64d",
              "退换货单位": "湖北荆州带钢厂",
              "退换货名称": "12",
              "退换货数量": 12,
              "申请退换时间": "07/21/2019",
                "checked":false

          },*/

          ],
      //选择的关联单
      relevantList:[]

  },
  onLoad() {
      const mythis = this;
      this.data.allProject = [];
      this.data.templateID = "PROC-BCFBCCA9-4A92-46EF-AFE7-C4C70745ED31";
      getDDInstance( this.data.templateID,this.data.cursor, this.data.start_time,mythis)
  },
   /* onPullDownRefresh() { //下拉刷新
        console.log('onPullDownRefresh', new Date())
        const mythis = this;
        mythis.data.cursor =  1;
        mythis.data.allProject = [];
        getDDInstance( this.data.templateID,this.data.cursor, this.data.start_time,mythis)
        dd.stopPullDownRefresh()

    },*/
    /**
     * 页面上拉触底事件的处理函数，与点击加载更多做同样的操作
     */
  onReachBottom: function () {
        if (this.data.cursor != null ) {
            console.log("上拉加载");
            var mythis = this;
            dd.showToast({
                type: 'success',
                content: '加载中...',
                duration: 300,
            });
            getDDInstance( this.data.templateID,this.data.cursor, this.data.start_time,mythis)
        }

    },
    changeChecked(e){   //check 列表项
        const index = e.currentTarget.dataset.index;
        const  target = `listData[${index}].checked`;
        this.setData({
            [target]:e.detail.value,
        });
    },
    getRelevantList(){  //将关联的审核单钉钉ID号记录
         this.data.relevantList =[];
        this.data.listData.forEach(item => {
            if (item.checked == true) {
                this.data.relevantList.push(item.instanceID) ;
            }
        })
        console.log(this.data.relevantList);
        dd.navigateBack(); //返回将执行onUnload,将relevantList返回上一页面

    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

        const that = this
        const pages = getCurrentPages();
        // const currPage = pages[pages.length - 1];   //当前页面
        const prevPage = pages[pages.length - 2];  //上一个页面

        prevPage.setData({
            relevantList: that.data.relevantList

        });
    },

});

/**
 * 获取项目列表
 */
function getDDInstance(DDID,cursor,start_time, mythis){
    const url = getApp().globalData.domain+'/getOapiByName.php';

    dd.httpRequest({
        url: url,
        method: 'post',
        data: {
            event:"get_DD_instance_list",
            process_code: DDID,
            start_time:start_time,
            cursor:cursor,
        },

        success: function (res) {
            if(res.data.success == true) {
                //如果搜出来的结果cursor为空, 就说明后面已经没数据可加载了，所以将state设为0

                //循环将结果集追加到数组后面
                for (var i = 0; i < res.data.content.data.length; i++) {
                        mythis.data.allProject.push(res.data.content.data[i]);
                    }
                if (res.data.nextCursor == null){
                    mythis.setData({
                        listData: mythis.data.allProject,
                        cursor:null,
                    });}
                else {
                    mythis.setData({
                        listData: mythis.data.allProject,
                        cursor: mythis.data.cursor + 1,
                    });
                }
            }else{
                dd.alert({content:"获取关联审核列表失败."});
            }
        },
        fail: function (res) {
            dd.alert({content:"获取关联审核列表失败."+JSON.stringify(res)});
        }
    });
}

