/**
 * 由于小程序内暂不支持打开对于的审批详情页和待办页面,所以暂不使用
 */
Page({
    data: {

        sampleID: "",

        cursor:1,
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
        //当前列表row号
        row:0,

        customerId:"",

    },
    onLoad(query) {
        const t = this;
        //还原,否则会被记忆,但this.setData的渲染数据不会被记忆
        this.data.allProject = [];
        this.data.cursor = 1;

        // this.data.sampleID = query.sampleID;
        this.data.customerId = query.customerId;
        getList(this.data.customerId,this.data.cursor,t)

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
            getList( this.data.customerId,this.data.cursor, mythis)
        }else {
          this.setData({
              cursor:null
          })
        }

    },


    /**
     * 生命周期函数--监听页面卸载
     */
    /*onUnload: function () {

        const that = this
        const pages = getCurrentPages();
        // const currPage = pages[pages.length - 1];   //当前页面
        const prevPage = pages[pages.length - 2];  //上一个页面

        prevPage.setData({
            relevantList: that.data.relevantList

        });
    },*/

    //进入sample数据详情
    onSampleRecDetail(e){
      this.setData({
         row:e.currentTarget.dataset.row
       })
       const sampleDataRecID =e.currentTarget.dataset.id;
        dd.navigateTo({
            url: "/page/calendar/editSampleRecord/editSampleRecord?sampleDataRecID="+sampleDataRecID
        })
    }
});

/**
 * 获取项目列表
 */
function getList(customerId,cursor, mythis){
    const url = getApp().globalData.domain+'/fmSampleRec.php';
    dd.httpRequest({
        url: url,
        method: 'post',
        dataType: 'json',
        data: {
            action:"getCustomerDataRecList",
            customerId: customerId,
            size:10,
            cursor:cursor,
        },

        success: function (res) {
            if(res.data.success == true) {
                //如果搜出来的结果cursor为空, 就说明后面已经没数据可加载了，所以将state设为0
                if (res.data.nextCursor == null){
                    mythis.data.cursor = null;
                  }else{
                    //循环将结果集追加到数组后面
                    for (let i = 0; i < res.data.data.length; i++) {
                        mythis.data.allProject.push(res.data.data[i]);
                    }
                    mythis.data.cursor = res.data.nextCursor;
                    mythis.setData({
                        listData:mythis.data.allProject
                    })
                }
            }else{
                if (res.data.error.errorCode == 401) { //无记录
                    // dd.alert({content: '尚无跟踪记录.'})
                    dd.showToast({
                        type: 'fail',
                        content: '无记录',
                        duration: 500,
                        success: () => {
                            dd.navigateBack();
                        },
                    });
                }else{
                    dd.alert({content:"获取数据列表失败."});

                }

            }
        },
        fail: function (res) {
            dd.alert({content:"获取数据列表失败."+JSON.stringify(res)});
        }
    });
}



