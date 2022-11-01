Page({
    data: {
        inventoryId:"",
        batchNumber:"",
        quantity:"",
        name:"",
    },
    onLoad(query) {
        //判断角色权限,只有技质部人员或者管理员可以建立检测记录

    },
    //扫描fm二维码,得到原材料代号和批号等信息
    qrScan(){
        const t =this;
            dd.scan({
                type: 'qr',
                success: (res) => {
                    if (res.code.indexOf("原材料代号") === -1 || res.code.indexOf("交易ID") === -1 ||res.code.indexOf("入库批号") === -1) { //应建立一个二维码识别码
                        dd.alert({content: "错误:该二维码不是原材料批次二维码"})
                    }
                    else{
                            const data = JSON.parse(res.code);
                            t.setData({
                                inventoryId: data.交易ID,
                                batchNumber: data.入库批号,
                                quantity: data.入库数量,
                                name: data.原材料代号,
                            });
                        }
                    }

            })
    },

    createInspction(){
        const t =this;
        const url = getApp().globalData.applicationServer+"/createMaterialInspection.php"
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                inventoryId: t.data.inventoryId,
                userId: getApp().globalData.userId
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({®'content':"custom:"+JSON.stringify(res.data.content.data)})
                // console.log("供应商列表ok");
                // dd.alert({'content':res.data});
                if (res.data.success == true) {
                    dd.alert({'content':"建立物品检验记录成功,请在授权电脑上完成检测项目"})
                } else {
                    dd.alert({'content':res.data.errorMsg})
                }
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res.data)})
            },
            complete: (res) => {
                dd.hideLoading();
            }
        })
    }

})


