//百度坐标转高德（传入经度、纬度）
function bd_decrypt(bd_lng, bd_lat) {

    var X_PI = Math.PI * 3000.0 / 180.0;

    var x = bd_lng - 0.0065;

    var y = bd_lat - 0.006;

    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);

    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);

    var gg_lng = z * Math.cos(theta);

    var gg_lat = z * Math.sin(theta);
    return {lng: gg_lng, lat: gg_lat}
}

//高德坐标转百度（传入经度、纬度）
function bd_encrypt(gg_lng, gg_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;

    var x = gg_lng, y = gg_lat;

    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);

    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);

    var bd_lng = z * Math.cos(theta) + 0.0065;

    var bd_lat = z * Math.sin(theta) + 0.006;

    return {

        bd_lat: bd_lat,

        bd_lng: bd_lng

    };
}
function daysInMonth(year,month,date,todayDate,t){
		//调用getScheduleForMonth()得到listData
        //得到登录人
        const app = getApp();
        const username = app.globalData.username;


        getScheduleForMonth(year, month, username).then(function (data) {
            // alert(JSON.stringify(result))
            const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) days[1] = 29

            const index = month, number = days[month];
            let hasEvent;//判断某天有无日程
            let pre = days[index - 1]
            let next = days[index + 1]
            if (index === 0) pre = days[11]
            if (index === 11) next = days[0]
            const thisMonth = []

            let day = new Date(year, index, 1).getDay()

            //?有可能第1个元素hasevent=true
            while (day--) thisMonth.unshift({"text": pre--, hasEvent: false});

            for (let i = 1; i <= number; i++) {
                if (data.find((item) => (item.day === i))) {
                    hasEvent = true;
                } else {
                    hasEvent = false;
                }
                thisMonth.push({"text": i, hasEvent: hasEvent});

            }
            for (let i = 1; i <= next; i++) {
                thisMonth.push({"text": i, hasEvent: false})
            }
            thisMonth.length = 42

            //显示listData中的data数据
            // resolve(thisMonth);
            

            //查找当天有无日程
            function FindFn(item, objIndex, objs){
                return (item.day === date && item.month === month && item.year ===year);
            }
            const hasSchedule =data.findIndex(FindFn);//值为1(即第1个当天日程的下标),-1为无
            if(hasSchedule == -1){
 							t.setData({
                                        'grid.list': thisMonth,
                                        year: year,
                                        month: month,
                                        date: date,
                                        todayDate: todayDate,
                                        'listData.data': data,
										hasSchedule:false
                        })
            }else{
                                         t.setData({
                                        'grid.list': thisMonth,
                                        year: year,
                                        month: month,
                                        date: date,
                                        todayDate: todayDate,
                                        'listData.data': data,
										hasSchedule:true,
                })

            }
             
        })
        .catch(function (err) {
            	dd.alert({content:err})
        })

  }

  function getScheduleForMonth(year,month,username) {
    return new Promise(function (resolve,reject) {
        if(username ==''||!username){
            reject('username 为空或不存在')
        }
        dd.showLoading();
        const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
        dd.httpRequest({
            url: url,
            method: 'POST',
            data: {
                action: 'get_schedule_list_month',
                year: year,
                month: month + 1,
                username: username
            },
            dataType: 'json',
            success: (res) => {
                // console.log('success----',res)
                // alert(JSON.stringify(res));
                let listData = [];

                res.data.content.forEach(function (item) {
                    let content = {
                        title: item.fieldData.日程内容,
                        address: item.fieldData.签到地址,
                        thumb: item.fieldData['经度'] && item.fieldData['纬度'] ? '/navigation_96px_1201170_easyicon.net.png' : null,
                        date: item.fieldData['签到时间'],
                        long: item.fieldData['经度'],
                        lat: item.fieldData['纬度'],
                        day: item.fieldData['日历表::day'],
                        month: month,
                        year: year,
                        eventID: item.fieldData['日程ID'],
                    }
                    listData.push(content)
                })
                // alert(JSON.stringify(listData));
                resolve(listData);
            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                // dd.alert({content: JSON.stringify(res)});
                dd.hideLoading();
                reject('failure');
            },
            complete: (res) => {
                dd.hideLoading();
            }
        })
    })
  }
/**
 *
 * @param eventID
 * @param OnScheduleList
 * tripMode 自驾,公交,搭车
 * @param date
 * @param year
 * @param month
 */

function signIn(eventID,OnScheduleList,tripMode,date,year,month) {

    //打开地图,并修正poi
    /* dd.biz.map.search({
         // 29.8369399124,106.6972446442
         latitude: 29.8369399124, // 纬度
         longitude: 106.6972446442, // 经度

         scope: 100, // 限制搜索POI的范围；设备位置为中心，scope为搜索半径

     })*/
    // const {getScheduleListforMonth} = this
    dd.device.geolocation.get({
        targetAccuracy: 200,
        coordinate: 1,//高德坐标
        withReGeocode: true,
        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result) {

            /* 高德坐标 result 结构
             {
             longitude : Number,
             latitude : Number,
             accuracy : Number,
             address : String,
             province : String,
             city : String,
             district : String,
             road : String,
             netType : String,
             operatorType : String,
             errorMessage : String,
             errorCode : Number,
             isWifiEnabled : Boolean,
             isGpsEnabled : Boolean,
             isFromMock : Boolean,
             provider : wifi|lbs|gps,
             accuracy : Number,
             isMobileEnabled : Boolean
             }
             */
            const lat = result.latitude;
            const long = result.longitude;
            //打开地图,并修正poi
            dd.biz.map.search({

                latitude: lat, // 纬度
                longitude: long, // 经度


                /*无poi地址测试
                latitude: 29.8369399124, // 纬度
                longitude: 106.6972446442, // 经度*/

                scope: 100, // 限制搜索POI的范围；设备位置为中心，scope为搜索半径

                onSuccess: function (poi) {
                    /* result 结构 */
                    /*province: 'xxx', // POI所在省会
                        provinceCode: 'xxx', // POI所在省会编码
                    city: 'xxx', // POI所在城市
                    cityCode: 'xxx', // POI所在城市
                    adName: 'xxx', // POI所在区名称
                    adCode: 'xxx', // POI所在区编码
                    distance: 'xxx', // POI与设备位置的距离
                    postCode: 'xxx', // POI的邮编
                    snippet: 'xxx', // POI的街道地址
                    title: 'xxx', // POI的名称
                    latitude: 39.903578, // POI的纬度
                    longitude: 116.473565, // POI的经度*/

                    const address = poi.title + "("+poi.adName + poi.snippet+')'
                    //fm rest api 时间格式format('MM-DD-YYYY HH:mm:ss')
                    const signTime =  moment().format('MM-DD-YYYY HH:mm:ss')

                    //将高德坐标转为百度
                    const bd_lat_lng  = bd_encrypt(poi.longitude,poi.latitude)

                    DB.Schedule.updateSignIn({
                        eventID : eventID ,
                        signTime:signTime ,
                        jingdu : bd_lat_lng.bd_lng ,
                        weidu : bd_lat_lng.bd_lat,
                        address:address,
                        tripMode:tripMode
                    }).then(response => {
                        // alert(JSON.stringify(response))
                        // dispatch(receivePosts(response));
                        if(response.response.data === '上传成功'){
                            // alert('ad')
                            // this.getScheduleListforMonth(date,year,month)
                            OnScheduleList(date,year,month)

                        }
                    })
                        .catch(error=>{
                                alert('后台错误'+JSON.stringify(error))
                            }
                        )

                    /*    //写入数据库日程方案
                        var url = "http://liuzheng750417.imwork.net:8088/v0.5.3/index.php?m=remotesign&a=submit";
                        $.ajax({
                            type: "POST",
                            url: url,
                            data: "eventID=" + eventID + 'signTime='+"9-9-2018 10:00:00"   + "&jingdu=" + poi.latitude + "&weidu=" + poi.latitude + "&address=" + address,

                            success: function (data) {
                                if (data.status == 1) {
                                    //有更新,更新日历

                                }
                                else {
                                    alert("发生错误:" + data.msg);
                                }
                            },
                            error: function (jqXHR) {
                                alert("发生错误" + jqXHR.status);
                            }

                        })*/

                },
                onFail: function (err) {
                    /*alert("微调错误:"+JSON.stringify(err));*/
                    //未找到poi信息,则直接添加定位信息
                    if (err.errorCode === "3") {
                        const signTime =  moment().format('MM-DD-YYYY HH:mm:ss')
                        //将高德坐标转为百度
                        const bd_lat_lng  = bd_encrypt( long,lat)

                        DB.Schedule.updateSignIn({
                            eventID : eventID ,
                            signTime:signTime ,
                            jingdu : bd_lat_lng.bd_lng ,
                            weidu : bd_lat_lng.bd_lat,
                            address:"无poi",
                            tripMode:tripMode
                        }).then(response => {
                            // alert(JSON.stringify(response))
                            // dispatch(receivePosts(response));
                            if(response.response.data === '上传成功'){
                                // alert('ad')
                                // this.getScheduleListforMonth(date,year,month)
                                OnScheduleList(date,year,month)

                            }
                        })
                            .catch(error=>{
                                    alert('后台错误'+JSON.stringify(error))
                                }
                            )
                    }
                }
            });

        },
        onFail: function (err) {
            alert("定位错误:"+JSON.stringify(err));

        }
    });
}
Page({
    data: {
			year:0 ,
			month:0,
			date:0,
			hasSchedule:false,
			todayDate:0,//当前日期的day值,只在当前月有效,其它月份为0
			grid: {
            	list:[],
            	columnNum: 7
			},
			calendarHead:{
					list:[
						{
							"text":"日"
						},
						{
							"text":"一"
						},{
							"text":"二"
						},{
							"text":"三"
						},{
							"text":"四"
						},{
							"text":"五"
						},{
							"text":"六"
						},
					],
					columnNum: 7
			},
			listData:{//日程表
					onItemTap: 'handleListItemTap',
					data:[
						/*{
						thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',
						title: "内容1基莾术有专攻奈斯运营成本求其友声春树暮云东奔西走艺术硕士艺术硕士东奔西走春树暮云ad",
						address: "地址1",
						//  text:"地址1",
						// imgUrl:  item.fieldData['经度'] && item.fieldData['纬度']?'../../navigation_96px_1201170_easyicon.net.png':null,
             				date : "04/09/2019 13:35:23",
						    long:'经度',
							lat:'纬度',
							day:19,
							month:4,
							year:2019,
							eventID:'日程ID',

						},
						*/
					]
			},
            attendance:'出勤',
		},//data 结束
		handleItemTap(e) {
					// dd.showToast({
					// 	content:  `第${e.currentTarget.dataset.index}个Item`,
					// 	success: (res) => {

					// 	},
					// });
					// console.log(e.currentTarget.dataset.date) 

            const date = e.currentTarget.dataset.date,month=this.data.month,year=this.data.year;

            //查找当天有无日程
            function FindFn(item, objIndex, objs){
                return (item.day === date && item.month === month && item.year ===year);
            }

            if(e.currentTarget.dataset.date > 15 && e.currentTarget.dataset.index < 15 ){ //到上月
							this.preMonth();
					}else if(e.currentTarget.dataset.date < 15 && e.currentTarget.dataset.index > 20){//到下月
							this.nextMonth();
					}else{//当月的
					    //查找当天有无日程
                        const hasSchedule = this.data.listData.data.findIndex(FindFn);//值为1(即第1个当天日程的下标),-1为无
                        if(hasSchedule == -1){
														this.setData({date:e.currentTarget.dataset.date,hasSchedule:false})
                        }else{
                        	this.setData({date:e.currentTarget.dataset.date,hasSchedule:true})
                        }
            }
    },
    attendanceStatus() { //出勤状态变更

    },
    openFM(){ //打开日程fm

    },
	onLoad(){ //页面加载时,计算有效日期
        const app = getApp();
        // getScheduleForMonth(2019,3,'刘正');

				var today = new Date();
				const year = today.getFullYear() ,month = today.getMonth(),date = today.getDate();
				const t = this;
				/*daysInMonth(year,month).then(function (thisMonth) {
                    t.setData({'grid.list':thisMonth,year:year,month:month,date:date,todayDate:date});
                }).catch(function(err){alert('读取日程失败:'+err)});*/
				daysInMonth(year,month,date,date,t)


				// console.log(thisMonth);
		},
		handleListItemTap(e) {
   /* dd.showToast({
      content: `第${e.currentTarget.dataset.index}个Item`,
      success: (res) => {

      },
    });*/
            //只有当天才能签到,而且已经签到的情况下,显示修改和查看地图
            const day = e.currentTarget.dataset.day,month = e.currentTarget.dataset.month,year = e.currentTarget.dataset.year,lat = e.currentTarget.dataset.lat,long = e.currentTarget.dataset.long,title = e.currentTarget.dataset.title,address = e.currentTarget.dataset.address;
            let options;
            const today = new Date();
            if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                if (lat && long) {
                    options = ['修改-自驾', '修改-搭车','修改-公交','查看地图']
                } else {
                    options = ['签到-自驾', '签到-搭车','签到-公交']
                }
            }else{
                if (lat && long) {
                    options = ['已不能修改', '查看地图']
                } else {
                    options = ['已不能签到']
                }
            }
                dd.showActionSheet({
                    title: title,
                    items: options,
                    //cancelButtonText: '取消好了', //android无效
                    success: (res) => {
                        const index = res.index;
                        if (options[index] === '修改-自驾' || options[index] === '修改-搭车' || options[index] === '修改-公交' ||
                            options[index] === '签到-自驾' || options[index] === '签到-搭车' || options[index] === '签到-公交') {
                            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                                var tripMode = options[index].substring(3);
                                // this.signIn(dataItem.eventID, OnScheduleList, tripMode, day, year, month)
                            }

                        } else if (options[index] === '查看地图' && lat && long) {
                            // alert("进入地图")
                            // alert(dataItem['lat']);

                            //将百度坐标转换为高德
                            const gd_lat_lng = bd_decrypt(long, lat)

                            dd.openLocation({
                                longitude: gd_lat_lng.lng.toString(), // 纬度
                                latitude: gd_lat_lng.lat.toString(), // 经度
                                name: title,
                                address: address,
                                /*longitude: '120.126293',
                                latitude: '30.274653',
                                name: '黄龙万科中心',
                                address: '学院路77号',*/
                            });
                        }
                        }
                    });


  },
	preMonth(){
		let month = this.data.month,year = this.data.year,date;
			if (month === 0) {
          month = 11;
          year--;
      }else {
          month--;
      }
			var today = new Date(),todayDate = 0;
      if(year === today.getFullYear() && month === today.getMonth()){
          date = today.getDate();
					todayDate = date;
      }else {
          date = 1;
      }
		const t = this;
		daysInMonth(year,month,date,todayDate,t);
	},
	nextMonth(){
		let month = this.data.month,year = this.data.year,date;
					if (month === 11) {
						month = 0;
						year++;
      		}else {
         		 month++;
     		 	}
					var today = new Date(),todayDate = 0;
					if(year === today.getFullYear() && month === today.getMonth()){
							date = today.getDate();
							todayDate = date;
					}else {
							date = 1;
					}
        const t = this;
        daysInMonth(year,month,date,todayDate,t);
    },
    loginSystem() {
        dd.showLoading();
        dd.getAuthCode({
            success:(res)=>{
                this.setData({
                    authCode:res.authCode
                })
                // dd.alert({content: "step1"+res.authCode});
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                        // dd.alert({content: "step2"});
                        console.log('success----',res)
                        let userId = res.data.result.userId;
                        let userName = res.data.result.userName;
                        const app = getApp();
                        app.globalData.userId = userId;
                        app.globalData.username = userName;
                        this.setData({
                            userId:userId,
                            userName:userName,
                            hideList:false
                        })
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---",res)
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }

                });
            },
            fail: (err)=>{
                // dd.alert({content: "step3"});
                dd.alert({
                    content: JSON.stringify(err)
                })
            }
        })

    },
})

