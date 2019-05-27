Page({
    data: {
      detailed: [
          {event: "去长安", signTime: '2019/5/14', signAddress: "重庆市江北区"},
          {event: "去成都", signTime: '2019/5/14', signAddress: "重庆市渝北区"},
          {event: "去成都", signTime: '2019/5/14', signAddress: "sffssFsafASFsafaF	QWF32F	23F2esfsaFfsFfF鞯 艺术硕士厅地莾厅地术有专攻在地愿为连理枝"},
          {event: "去成都", signTime: '2019/5/14', signAddress: "重庆市渝北区aFfSAFasfaSFasfaSFAasfsfdafqwer3r133adfadfadsfdfafqwefqwefqwe好"},
      ],
      medias:[
          {src:"http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg"},
          {src:"http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg"},
          ]
    },
    scheduleSubmit(e){
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    },
    onAddEvent(){
        let list = this.data.detailed
        list.push(
            {event: "", signTime: '', signAddress: ""});
        this.setData({
            "detailed":list
        })
    },
    onDeleteEvent(e){
        dd.confirm({
            title: '提示',
            content: '确认删除该日程',
            confirmButtonText: '删除',
            success: (result) => {
                const row = e.currentTarget.dataset.index;
                let list = this.data.detailed;
                list.splice(row,1);
                this.setData({
                    "detailed":list
                })
            },
        })

    }
});
