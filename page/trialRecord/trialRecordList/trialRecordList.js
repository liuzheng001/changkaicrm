/**
 * 由于小程序内暂不支持打开对于的审批详情页和待办页面,所以暂不使用
 */
Page({
    data: {

        navTab: ['已发起','待处理','已处理', '抄送的'],
        currentTabIndex:1,//当前tabIndex

        cursor:1,
        //用于数组的追加和暂存
        // allProject:[],
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
    onLoad() {

        const t = this;
        //还原,否则会被记忆,但this.setData的渲染数据不会被记忆
        // this.data.allProject = [];
        this.data.cursor = 1;
        // this.data.sampleID = query.sampleID;
        getList(this.data.navTab[1],1,t)

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
            // console.log("上拉加载");
            var mythis = this;
            dd.showToast({
                type: 'success',
                content: '加载中...',
                duration: 300,
            });
            getList(this.data.navTab[this.data.currentTabIndex] ,this.data.cursor, mythis)
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

    //进入sample数据详情,如果查阅标志为更改,则设置fm,查阅标志为1,且钉钉任务update,即移出待办
    onRecDetail(e){
        const row =e.currentTarget.dataset.row
        this.setData({
            row,
        })
        const instanceId =e.currentTarget.dataset.instanceId;
        const recordId =e.currentTarget.dataset.recordId;
        const url = getApp().globalData.domain+'/fmSampleRec.php';
        if (this.data.listData[row]['consultFlag'].length>0 && this.data.listData[row]['consultFlag'][0] === 0) { //更新
            dd.httpRequest({
                url: url,
                method: 'get',
                dataType: 'json',
                data: {
                    action:"consulted",
                    userId: getApp().globalData.userId,
                    instanceId,
                    // userId:"0968625005675565",//调试
                },
                success: function (res) {
                    if (res.data.success === true) {
                        const url = getApp().globalData.applicationServer + "customizeWorkflow.php"
                        dd.httpRequest({
                            url: url,
                            method: 'get',
                            dataType: 'json',
                            data: {
                                action: "updateConsult",
                                userId: getApp().globalData.userId,
                                taskId: res.data.taskId,
                                // userId:"0968625005675565",//调试
                            },
                            success: function (res) {
                                if (res.data.success === true) {

                                }
                            }
                        })
                    }
                },
                })
        }
        dd.navigateTo({
            url: "/page/trialRecord/trialRecord?recordId="+recordId
        });
    },

    currentTab: function (e) {
        if (this.data.currentTabIndex == e.currentTarget.dataset.idx) {
            return;
        }
        this.data.listData = [];
        // this.data.cursor = 1;
        getList(this.data.navTab[e.currentTarget.dataset.idx] ,1, this)

        this.setData({
            currentTabIndex: e.currentTarget.dataset.idx
        })
    },
    gotoSampleApply(){
        dd.navigateTo({
            url: "/page/trialRecord/trialRecord"
        })
    }
});

/**
 * 获取项目列表
 */
function getList(select,cursor, mythis){//select为'已发起','待处理','已处理', '抄送的'
    const url = getApp().globalData.domain+'/fmSampleRec.php';
    dd.showLoading()
    dd.httpRequest({
        url: url,
        method: 'post',
        dataType: 'json',
        data: {
            action:"getTrialList",
            userId: getApp().globalData.userId,
            // userId:"0968625005675565",//调试
            size:10,
            cursor,
            select
        },
        success: function (res) {
            if(res.data.success == true) {
                //如果搜出来的结果cursor为空, 就说明后面已经没数据可加载了，所以将state设为0
                if (res.data.nextCursor == null){
                    // mythis.data.cursor =
                        mythis.setData({
                            listData:mythis.data.listData.concat(res.data.instances),
                            cursor:null
                    })
                }else{
                    // mythis.data.cursor = res.data.nextCursor;
                    mythis.setData({
                        listData:mythis.data.listData.concat(res.data.instances),
                        cursor:res.data.nextCursor
                    })
                }
            }else{
                if (res.data.error.errorCode == 401) { //无记录
                    // dd.alert({content: '尚无跟踪记录.'})
                    /*dd.showToast({
                        type: 'fail',
                        content: '无记录',
                        duration: 500,
                        success: () => {
                            mythis.setData({
                                listData:[],
                                cursor:null
                            })
                        },
                    });*/
                    mythis.setData({
                        listData:[],
                        cursor:null
                    })
                }else{
                    dd.alert({content:"获取数据列表失败."});

                }

            }
            dd.hideLoading();
        },
        fail: function (res) {
            dd.alert({content:"获取数据列表失败."+JSON.stringify(res)});
            dd.hideLoading();
        }
    });
}



