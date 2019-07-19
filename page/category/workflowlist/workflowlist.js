/**
 * 由于小程序内暂不支持打开对于的审批详情页和待办页面,所以暂不使用
 */
Page({
  data: {
      templateID:0,//模版ID
      page:1,//初始页,每页15个
      pagesize: 15, //每页行数
      //用于标识是否还有更多的状态,0代表没有流程了,1代表后面还有
      state: 1,


    //用于数组的追加和暂存
      allProject:[],

    //用于渲染页面的数组

      listData:[//日程表
             /* {
                  // thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',
                  title: "内容1基莾术有专攻奈斯运营成本求其友声春树暮云东奔西走艺术硕士艺术硕士东奔西走春树暮云ad",
                  address: "地址1",
                  date : "04/09/2019 13:35:23",
                  long:'经度',
                  lat:'纬度',
                  day:19,
                  month:4,
                  year:2019,
                  eventID:'日程ID',

              },
              {
                  // thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',
                  title: "内容1基莾术有专攻奈斯运营成本求其友声春树暮云东奔西走艺术硕士艺术硕士东奔西走春树暮云ad",
                  address: "地址1",
                  date : "04/09/2019 13:35:23",
                  long:'经度',
                  lat:'纬度',
                  day:19,
                  month:4,
                  year:2019,
                  eventID:'日程ID',

              },*/

              /*"instanceID": 3103,
             "start": "李孝桂",
            "startDate": "05/20/2019 12:51:46",
            "checkList": "叶明贵\r李孝桂\r叶明贵\r刘正",
             "aduitingList": "",
            "duration": 0,
            "currentStep": ""*/

          ]

  },
  onLoad(query) {
      const mythis = this;
      this.data.allProject = [];
      this.data.page =1;
      this.data.templateID = query.templateID;
      getproinfo( this.data.templateID,this.data.pagesize, this.data.page,mythis)
  },
    onPullDownRefresh() { //下拉刷新
        console.log('onPullDownRefresh', new Date())
        const mythis = this;
        mythis.data.page =  1;
        mythis.data.state = 1;
        mythis.data.allProject = [];
        getproinfo(this.data.templateID, this.data.pagesize, this.data.page, mythis);
        dd.stopPullDownRefresh()

    },
    /**
     * 页面上拉触底事件的处理函数，与点击加载更多做同样的操作
     */
  onReachBottom: function () {
        if (this.data.state == 1) {
            console.log("上拉加载");
            var mythis = this;
            dd.showToast({
                type: 'success',
                content: '加载中...',
                duration: 300,
            });
            mythis.data.page = mythis.data.page + 1;
            getproinfo(this.data.templateID, this.data.pagesize, this.data.page, mythis);
        }

    },

});

/**
 * 获取项目列表
 */
function getproinfo(templateID,pagesize, page, mythis){
    const url = getApp().globalData.domain+'/getworkflow.php';

    dd.httpRequest({
        url: url,
        method: 'post',
        data: {
            action:"get_instance_list",
            templateID: templateID,
            currentPage:page,
            pageSize:pagesize,
        },
        success: function (res) {
            if(res.data.success == true) {

                //如果搜出来的结果<1 就说明后面已经没数据可加载了，所以将state设为0
                if (res.data.content.data == null)
                    mythis.setData({
                        state: 0
                    });
                else {
                    var state = 1;
                    //如果有数据，但小于每次期望加载的数据量（pagesize）,将state设为0，表示后面已没有数据可加载
                    if (res.data.content.data.length < mythis.data.pagesize)
                        state = 0;
                    //循环将结果集追加到数组后面
                    for (var i = 0; i < res.data.content.data.length; i++) {
                        mythis.data.allProject.push(res.data.content.data[i]);
                    }
                    mythis.setData({
                        listData: mythis.data.allProject,
                        state: state
                    });
                }
            }else{
                dd.alert({content:"获取流程列表失败."});
            }
        },
        fail: function (res) {
            dd.alert({content:"获取流程列表失败."+JSON.stringify(res)});
        }
    });
}

