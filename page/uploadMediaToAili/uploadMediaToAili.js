Page({
    data: {
        database: "",//database
        layout: "",//布局
        // recordId:-1,//记录Id
        recordId: -1,
        filename:''
    },
    onLoad(query) {
        //得到项目名称和试验记录Id
    },
    //扫描fm二维码,得到试验记录Id等信息
    qrScan() {
        const t = this;
        dd.scan({
            type: 'qr',
            success: (res) => {
                if (res.code.indexOf("recordId") === -1) {
                    dd.alert({content: "错误:二维码有误,不能上传"})
                } else {
                    const data = JSON.parse(res.code);
                    t.setData({
                        recordId: data.recordId,
                        layout: data.layout,
                        database: data.database,
                    });
                }
            },
        })
    },

    onUploadMedia() {//上传到阿里云
        const t = this;
        let thumbs = this.data.thumbs;
        let options = ['图片', '视频'];
        dd.showActionSheet({
            title: "选择?",
            items: options,
            //cancelButtonText: '取消好了', //android无效
            success: (res) => {
                const index = res.index;
                if (index === 0) { //选择图片
                    dd.chooseImage({
                        count: 1, //最多只能选1张图片
                        success:  (res) => {
                            //上传
                             uploadMediaToAili(t, res.filePaths[0], "image");

                        },
                        fail: (err) => {
                            console.log(err);
                        },
                    });
                } else {//选择视频
                    dd.chooseVideo({
                        sourceType: ['album', 'camera'],
                        maxDuration: 60,
                        success: async (res) => {
                            // dd.alert({content:JSON.stringify(res)});
                            // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                            if (res.duration > 60) {
                                dd.alert({content: "视频时长不能超过1分钟."})
                            } else {
                                //上传
                                 uploadMediaToAili(t, res.filePath, "video");
                            }
                        },
                        fail: (err) => {
                            console.log(err);
                        },

                    })
                }
            },

        })
    },
})

function uploadMediaToAili(t,path,mediaType) {
    //校验
    const recordId = t.data.recordId;
    const url = getApp().globalData.applicationServer + 'uploadMediasToAiliAndVideoIdToFM.php'
    // alert(path);
    dd.showLoading();
    dd.uploadFile({
        // url: getApp().globalData.domain + '/upload/upload.php',
        url: url,
        type:mediaType,
        fileName: 'file',
        filePath: path,
        formData: {
            recordId: t.data.recordId,
            database:t.data.database,
            layout:t.data.layout,
            type: mediaType,
        },
        success: res => {
            const data = JSON.parse(res.data);
            if (data.success === true) {
                //返回上传图片urls
                dd.hideLoading();
                dd.alert({content: "上传成功"})
                const filename = path;
                t.setData({
                    filename
                })
            } else {
                dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
            }
        },
        fail: function (res) {
            dd.alert({content: `上传失败：${JSON.stringify(res)}`});
        },
        complete(res) {
            dd.hideLoading();
        }
    });

}

