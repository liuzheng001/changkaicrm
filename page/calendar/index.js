Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
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
function daysInMonth(year,month,date,listData){
    //调用getScheduleForMonth()得到listData
    //得到登录人

    return new Promise(function (resolve,reject) {

        /* const app = getApp();
         const username = app.globalData.username;*/

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
            if (listData.find((item) => (item.day === i))) {
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
        function FindFn(item, objIndex, objs) {
            return (item.day === date && item.month === month && item.year === year);
        }

        // const hasSchedule = (listData.findIndex(FindFn)!==-1);//值为正数(即第1个当天日程的下标),-1为无
        const item = listData.find(FindFn);//有值既是找到的元素,undefind则是该日无日程
        let hasSchedule,attendance, scheduleId ;
        ;
        if (item) {
            hasSchedule = true;
            scheduleId = item.scheduleId;

            if (item.startTime === '') {
                attendance = '出勤';
            }
            else if (item.finishTime === '') {
                attendance = '收工';
            } else {
                attendance= '已收工';
            }
        } else {
            hasSchedule = false;
            attendance = '出勤'
        }
        resolve({thisMonth: thisMonth, hasSchedule: hasSchedule, listDataValue: listData,attendance:attendance, scheduleId :scheduleId
                 });

    })



}

function getScheduleForMonth(year,month,username) {
    return new Promise(function (resolve,reject) {
        if(username ==''||!username){
            reject('username 为空或不存在') 
        }
        dd.showLoading();
        // const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
        const url = getApp().globalData.domain+'/getSchdule.php';
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
                        // thumb: item.fieldData['经度'] && item.fieldData['纬度'] ? '/navigation_96px_1201170_easyicon.net.png' : null,
                        date: item.fieldData['签到时间'],
                        long: item.fieldData['经度'],
                        lat: item.fieldData['纬度'],
                        day: item.fieldData['日历表::day'],
                        month: month,
                        year: year,
                        eventID: item.fieldData['日程ID'],
                        startTime:item.fieldData['日历表::出勤时间戳'],
                        finishTime:item.fieldData['日历表::收工时间戳'],
                        scheduleId:item.fieldData['日历外键ID'],
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

function signIn(eventID,tripMode,date,year,month) {
    return new Promise(function (resolve ,reject)
    {
        dd.getLocation({
            type:1,//得到区县信息
            success(res) {
                const long = res.longitude, lat = res.latitude;
                //将高德坐标转为百度
                const bd_lat_lng = bd_encrypt(long, lat)
                dd.showLoading();

                //通过百度api得到地址信息
                let url = 'http://api.map.baidu.com/geocoder/v2/'

              /*  http://api.map.baidu.com/geocoder/v2/?location=29.501519719934816,106.38397129107597&radius=100&output=json&pois=0&extensions_town=true&latest_admin=1&ak=6YIT5WMqe5FCmUDgPaBCQdRv*/
                dd.httpRequest({
                    url: url,
                    method: 'get',
                    data: {
                        extensions_town:true,//返回镇乡信息
                        // location:'29.605311111297674,106.49394266743357',
                        location:bd_lat_lng.bd_lat+','+bd_lat_lng.bd_lng,
                        ak:'6YIT5WMqe5FCmUDgPaBCQdRv',
                        output:'json',
                        latest_admin:1,
                        extensions_poi:null,//不访问poi数据
                    },
                    dataType: 'json',
                    success: (data) => {
                        // alert(JSON.stringify(data));
                        const information = data.data.result.addressComponent;
                        const address =  information.city+information.district+information.town+information.street+information.street_number
                        /*"addressComponent": {
                            "country": "中国",
                                "country_code": 0,
                                "country_code_iso": "CHN",
                                "country_code_iso2": "CN",
                                "province": "重庆市",
                                "city": "重庆市",
                                "city_level": 2,
                                "district": "渝北区",
                                "town": "双凤桥街道",
                                "adcode": "500112",
                                "street": "长凯路",
                                "street_number": "405号",
                                "direction": "附近",
                                "distance": "27"
                        },*/

                        // const address = poi.title + "("+poi.adName + poi.snippet+')'
                        //fm rest api 时间格式format('MM-DD-YYYY HH:mm:ss')
                        // 对Date的扩展，将 Date 转化为指定格式的String
                        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
                        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
                        // 例子：
                        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
                        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18

                        const signTime = new Date().format('MM/dd/yyyy hh:mm:ss'); //fm接收的日期格式不能变



                        // url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
                        url = getApp().globalData.domain+'/getSchdule.php';
                        dd.httpRequest({
                            url: url,
                            method: 'POST',
                            data: {
                                action: 'updateSignIn',
                                eventID: eventID,
                                signTime: signTime,
                                jingdu: bd_lat_lng.bd_lng,
                                weidu: bd_lat_lng.bd_lat,
                                address: address,
                                tripMode: tripMode
                            },
                            dataType: 'json',
                            success: (res) => {
                                // console.log('success----',res)
                                // alert(JSON.stringify(res));
                                if (res.data.content.response.data === '上传成功') {
                                    //重新渲染
                                    // OnScheduleList(date,year,month)
                                    // dd.alert({title: '上传成功'});
                                    resolve({
                                        signTime: signTime,
                                        long: bd_lat_lng.bd_lng,
                                        lat: bd_lat_lng.bd_lat,
                                        address: address,
                                        tripMode: tripMode
                                    });

                                } else {
                                    dd.alert({title: '上传失败'});
                                    reject();
                                }
                                // resolve(listData);
                            },
                            fail: (res) => {
                                console.log("httpRequestFail---", res)
                                // dd.alert({content: JSON.stringify(res)});
                                // dd.hideLoading();
                                // reject('failure');
                            },
                            complete: (res) => {
                                dd.hideLoading();
                            }
                        })

                    },
                    fail: (res) => {
                        console.log("httpRequestFail---", res)
                        // dd.alert({content: JSON.stringify(res)});
                        // dd.hideLoading();
                        // reject('failure');
                    },
                    complete: (res) => {
                        dd.hideLoading();
                    }
                })


            },
            fail(err) {
                dd.alert({title: JSON.stringify(err)})
            },
        })
    })
}
/**
 *
 * @param scheduleId
 * @param chuqiType 出勤 ,收工
 * @param AttendanceMode  搭车,自驾,公交
 */

function attendanceUpdate(scheduleId,chuqiType,AttendanceMode) {
    return new Promise(function (resolve , reject) {
        dd.getLocation({
            success: function (result) {
                const lat = result.latitude;
                const long = result.longitude;
                // alert(lat+'long'+long);
                //将高德坐标转为百度
                const bd_lat_lng = bd_encrypt(long, lat)
                // const url = 'http://liuzheng750417.imwork.net:8088/corp_php-master/getSchdule.php'
                const url = getApp().globalData.domain+'/getSchdule.php';
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        action: 'attendanceUpdate',
                        calendarID: scheduleId,
                        AttendanceMode: AttendanceMode,
                        chuqiType: chuqiType,
                        jingdu: bd_lat_lng.bd_lng,
                        weidu: bd_lat_lng.bd_lat,
                    },
                    dataType: 'json',
                    success: (res) => {
                        // alert(JSON.stringify(response))
                        if (res.data.content.response.data === '上传成功') {
                            dd.alert({title:'出勤状态更改成功'})
                            resolve( {calendarID: scheduleId,
                                    AttendanceMode: AttendanceMode,
                                    chuqiType: chuqiType,})
                            } else {
                            reject('failure')
                        }
                    },

                })
            },
            fail: function (err) {
                alert(JSON.stringify(err));
            }
        })
    })



    /*dd.device.geolocation.get({
        targetAccuracy: 200,
        coordinate: 1,//高德坐标
        withReGeocode: true,
        useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
        onSuccess: function (result) {
            const lat = result.latitude;
            const long = result.longitude;
            // alert(lat+'long'+long);
            //将高德坐标转为百度
            const bd_lat_lng  = bd_encrypt(long,lat)

            DB.Schedule.attendanceUpdate({
                calendarID : calendarID ,
                AttendanceMode:AttendanceMode,
                chuqiType: type,
                jingdu : bd_lat_lng.bd_lng ,
                weidu : bd_lat_lng.bd_lat,
            })
                .then(response => {
                    // alert(JSON.stringify(response))
                    // dispatch(receivePosts(response));
                    if(response.response.data === '上传成功'){
                        alert('出勤状态更改成功')
                        t.getScheduleListforMonth(date,year,month)
                    }
                })
                .catch(error=>{
                        alert('error'+JSON.stringify(error))
                    }
                )
        },
        onFail: function (err) {
            alert(JSON.stringify(err));
        }
    });*/
}


Page({
    data: {
			year:0 ,
			month:0,
			date:0,
			hasSchedule:false, //当前日期有无日程
            scheduleId:0,//日历ID
			todayDate:0,//当前日期的day值,只在当前月有效,其它月份为0
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
            grid: {
                list:[],
                columnNum: 7,
            },
			listData:{//日程表
					onItemTap: 'handleListItemTap',
					data:[
						/*{
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
						*/
					]
			},
            attendance:'出勤',
            isRendering:false,
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
            function FindFn(item, objIndex, objs) {
                return (item.day === date && item.month === month && item.year === year)
            }

            if(e.currentTarget.dataset.date > 15 && e.currentTarget.dataset.index < 15 ){ //到上月
                        this.preMonth();
                }else if(e.currentTarget.dataset.date < 15 && e.currentTarget.dataset.index > 20){//到下月
                        this.nextMonth();
                }else{//当月的
                const item = this.data.listData.data.find(FindFn);//有值既是找到的元素,undefind则是该日无日程
                let hasSchedule,attendance,scheduleId;
                if (item) {
                    hasSchedule = true;
                    scheduleId = item.scheduleId;
                    if (item.startTime === '') {
                        attendance = '出勤';
                    }
                    else if (item.finishTime === '') {
                        attendance = '收工';
                    } else {
                        attendance= '已收工';
                    }
                } else {
                    hasSchedule = false;
                    attendance = '出勤'
                }
								
                this.setData({date:e.currentTarget.dataset.date,hasSchedule: hasSchedule,attendance:attendance,scheduleId:scheduleId})
            }

    },
    attendanceSign() { //出勤状态变更
            //默认为自有当天才能出勤,且改变出勤状态后重新render
        const app = getApp();
        const username = app.globalData.username;
        const date = this.data.date,month=this.data.month,year=this.data.year;

            const t =this;
            if (this.data.hasSchedule === false) {
                dd.alert({title:'尚未设置日程,请先建立日程,再出勤!'});
                return
            }
            if(this.data.attendance=== '出勤') {
                dd.confirm({
                    title: '提示',
                    content: '确定出勤?',
                    success: (result) => {
                        if(result.confirm ==true) {
                            //记录出勤位置
                            attendanceUpdate(t.data.scheduleId, '出勤', null)
                                .then(() => {
                                    const time =  new Date().format('MM/dd/yyyy hh:mm:ss');
                                    //将listData中的相应签到数据,注意入口中的日程全部startTime设置
                                    let listDataValue = t.data.listData.data;
                                    listDataValue.forEach((item,index)=>{
                                        if(item.day === date && item.month === month && item.year === year){
                                            item.startTime = time;
                                            }
                                        }
                                    )

                                  /*  const index = t.data.listData.data.findIndex(FindFn);//有值既是找到的元素,undefind则是该日无日程

=                                    //设置出勤时间戳,代表下一步是收工
                                    listDataValue[index].startTime = true;*/

                                    this.setData({
                                        attendance: '收工',
                                        'listData.data': listDataValue,
                                    })
                                })
                                .catch((err) => dd.alert({title: '出勤或收工失败'}))
                        }
                    },

                })
            }else if(this.data.attendance === '收工') {

                let options = ['自驾', '搭车', '公交'];
                /*ActionSheet.show({
                    options:options ,
                    destructiveButtonIndex: 0,
                    message: '确定收工?',
                    maskClosable: false,
                }, (index) => {
                    if (index < 3) {
                        attendanceUpdate('收工',options[index])
                    }

                })*/
                dd.showActionSheet({
                    title: "确定收工?",
                    items: options,
                    //cancelButtonText: '取消好了', //android无效
                    success: (res) => {
                        const index = res.index;
                        if (index < 3) {
                            attendanceUpdate(t.data.scheduleId,'收工',options[index])
                                .then( ()=> {
                                    //将listData中的相应签到数据更改
                                    const time =  new Date().format('MM/dd/yyyy hh:mm:ss');
                                    //将listData中的相应签到数据,注意入口中的日程全部startTime设置
                                    let listDataValue = t.data.listData.data;
                                    listDataValue.forEach((item,index)=>{
                                            if(item.day === date && item.month === month && item.year === year){
                                                item.finishTime = time;
                                            }
                                        }
                                    )

                                    this.setData({
                                        attendance:'已收工',
                                        'listData.data':listDataValue,
                                    })
                                })
                                .catch((err)=>dd.alert({title:'出勤或收工失败'}))
                        }
                    },
                })
            }
    },
    editSchedule(){ //打开日程
        let scheduleJson ={};
        if (typeof this.data.scheduleId === 'undefined'
        ) {  scheduleJson.scheduleId = 0;
        }else{
            scheduleJson.scheduleId   = this.data.scheduleId;
        }
        scheduleJson.year = this.data.year;
        scheduleJson.month = this.data.month;
        scheduleJson.date = this.data.date;
        scheduleJson.listData = {}
        scheduleJson.listData.data = [];
        scheduleJson.attendance = this.data.attendance;
        if(scheduleJson.scheduleId !== 0) {
            let list = this.data.listData.data;
            list.forEach((item, index) => {
                    if (item.day === this.data.date && item.month === this.data.month && item.year === this.data.year) {
                        //记录该日志内容
                        var value = {eventID: item.eventID, event: item.title,signTime: item.date, signAddress: item.address,isDelete:false};
                        scheduleJson.listData.data.push(value);
                    }
                })
        }
        dd.navigateTo({
            url: '/page/schedule/schedule?scheduleJson='+JSON.stringify(scheduleJson),
        })
    },
    onLoad(){ //页面加载时,计算有效日期
        const app = getApp();
        let year,month,date,todayDate;
        const today = new Date();


        if(this.data.year === 0 && this.data.month === 0 && this.data.date === 0) {
            //得到当前日期,程序首次加载
            year = today.getFullYear(); month = today.getMonth(); date = today.getDate();
        }else{
            year = this.data.year ;month = this.data.month;date = this.data.date;

        }
        if(year === today.getFullYear() && month === today.getMonth()){
            todayDate =today.getDate();
        }else{
            todayDate = 0;
        }

        const username = app.globalData.username;
        getScheduleForMonth(year,month,username)
            .then((listData)=>{return daysInMonth(year,month,date,listData)}
            )
            .then(res => {
                this.setData({
                    'grid.list': res.thisMonth,
                    year: year,
                    month: month,
                    date: date,
                    todayDate: todayDate,
                    'listData.data': res.listDataValue,
                    hasSchedule:res.hasSchedule,
                    attendance:res.attendance,
                    scheduleId:res.scheduleId,
                })
            }).catch(
            err=>dd.alert({title:"载入日历月表失败",content:JSON.stringify(err)})
        )


        /*var today = new Date();
        const year = today.getFullYear() ,month = today.getMonth(),date = today.getDate();
        /*daysInMonth(year,month).then(function (thisMonth) {
            t.setData({'grid.list':thisMonth,year:year,month:month,date:date,todayDate:date});
        }).catch(function(err){alert('读取日程失败:'+err)});*/
        /*daysInMonth(year,month,date,date)
            .then(res => {
                // this.setData({'grid.list':res.thisMonth,year:year,month:month,date:date,todayDate:date});
                this.setData({
                    'grid.list': res.thisMonth,
                    year: year,
                    month: month,
                    date: date,
                    todayDate: date,
                    'listData.data': res.listDataValue,
                    hasSchedule:res.hasSchedule
                })
            }).catch(
                res=>dd.alert({title:"载入月日历失败"})
        )*/

    },
    onShow(){ //页面显示时,每次重新执行,如果直接调用,不延时,在android上将返回错误,ios没问题,感觉是android返回后,没有来的及执行getScheduleForMonth
        const app = getApp();
        console.log('calendar:'+app.globalData.flashScheduleFlag)

        if(app.globalData.flashScheduleFlag === true) {
            app.globalData.flashScheduleFlag = false;
            /*dd.showToast({
                type: 'success',
                content: '更改成功',
                duration: 2000,
                success: () => {
                    let year, month, date, todayDate;
                    const today = new Date();
                    year = this.data.year;
                    month = this.data.month;
                    date = this.data.date;

                    if (year === today.getFullYear() && month === today.getMonth()) {
                        todayDate = today.getDate();
                    } else {
                        todayDate = 0;
                    }

                    const username = app.globalData.username;
                    getScheduleForMonth(year, month, username)
                        .then((listData) => {
                                // console.log('listData:' + JSON.stringify(listData));
                                return daysInMonth(year, month, date, listData)
                            }
                        )
                        .then(res => {
                            // console.log('res:' + JSON.stringify(res));
                            this.setData({
                                'grid.list': res.thisMonth,
                                year: year,
                                month: month,
                                date: date,
                                todayDate: todayDate,
                                'listData.data': res.listDataValue,
                                hasSchedule: res.hasSchedule,
                                attendance: res.attendance,
                                scheduleId: res.scheduleId,
                            })
                        }).catch(
                        err => dd.alert({title: "载入日历月表失败", content: JSON.stringify(err)})
                    )
                }
            });*/
            setTimeout(() => {
                let year, month, date, todayDate;
                const today = new Date();
                year = this.data.year;
                month = this.data.month;
                date = this.data.date;

                if (year === today.getFullYear() && month === today.getMonth()) {
                    todayDate = today.getDate();
                } else {
                    todayDate = 0;
                }

                const username = app.globalData.username;
                getScheduleForMonth(year, month, username)
                    .then((listData) => {
                            // console.log('listData:' + JSON.stringify(listData));
                            return daysInMonth(year, month, date, listData)
                        }
                    )
                    .then(res => {
                        // console.log('res:' + JSON.stringify(res));
                        this.setData({
                            'grid.list': res.thisMonth,
                            year: year,
                            month: month,
                            date: date,
                            todayDate: todayDate,
                            'listData.data': res.listDataValue,
                            hasSchedule: res.hasSchedule,
                            attendance: res.attendance,
                            scheduleId: res.scheduleId,
                        })
                    }).catch(
                    err => dd.alert({title: "载入日历月表失败", content: JSON.stringify(err)})
                )
            }, 500)
        }
    },
    handleListItemTap(e) {
            //只有当天才能签到,而且已经
        // 签到的情况下,显示修改和查看地图
            const day = e.currentTarget.dataset.day,month = e.currentTarget.dataset.month,year = e.currentTarget.dataset.year,lat = e.currentTarget.dataset.lat,long = e.currentTarget.dataset.long,title = e.currentTarget.dataset.title,address = e.currentTarget.dataset.address,eventID =e.currentTarget.dataset.eventID;
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
                                signIn(eventID, tripMode, day, year, month)
                               /* .then(
                                    ()=>{
                                        const app = getApp();
                                        const username = app.globalData.username;
                                        return getScheduleForMonth(year,month,username)}
                                    )*/
                                .then(

                                    (data)=>{

                                        //更改listData和thisMonth,而不用getScheduleForMonth多调用一次数据库
                                        //查找当天有无日程
                                        function updateEventID(item, objIndex, objs) {
                                            if (item.eventID === eventID ){
                                                item.address=data.address;
                                                item.long = data.long;
                                                item.lat = data.lat;
                                                item.date = data.signTime;
                                            }
                                        }
                                        let listData = this.data.listData.data;
                                        //更改listData对应eventID数据
                                        listData.findIndex(updateEventID);
                                        //对listData数据排序,按签到时间由小到大
                                        var objectArraySort = function (keyName) {
                                            return function (objectN, objectM) {
                                                var valueN =  new Date(objectN[keyName]).getTime();
                                                var valueM =  new Date(objectM[keyName]).getTime();
                                                if (valueN < valueM) return -1
                                                else if (valueN > valueM) return 1
                                                else return 0
                                            }
                                        }
                                        listData.sort(objectArraySort('date'))

                                        // return daysInMonth(year,month,day,listData)
                                        return ({listDataValue:listData})
                                    }
                                )
                               .then(res => {
                                            // this.setData({'grid.list':res.thisMonth,year:year,month:month,date:date,todayDate:date});
                                           dd.showToast({
                                               type: 'success',
                                               content: '签到成功',
                                               duration: 2000,
                                               success: () => {

                                               },
                                           });
                                            this.setData({
                                                /*'grid.list': res.thisMonth,
                                                year: year,
                                                month: month,
                                                date: this.data.date,
                                                todayDate: this.data.todayDate,*/
                                                'listData.data': res.listDataValue,
                                                // hasSchedule:res.hasSchedule,
                                                // attendance:res.attendance,

                                            })
                                        })
                              .catch(
                                        err=>dd.alert({title:"载入月日历失败.",content:JSON.stringify(err)})
                                    )

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
      let today = new Date(),todayDate = 0;
      if(year === today.getFullYear() && month === today.getMonth()){
          date = today.getDate();
          todayDate = date;
      }else {
          date = 1;
      }
        /*daysInMonth(year,month,date,todayDate)
            .then(res => {
                // this.setData({'grid.list':res.thisMonth,year:year,month:month,date:date,todayDate:date});
                this.setData({
                    'grid.list': res.thisMonth,
                    year: year,
                    month: month,
                    date: date,
                    todayDate: todayDate,
                    'listData.data': res.listDataValue,
                    hasSchedule:res.hasSchedule
                })
            }).catch(
            res=>dd.alert({title:"载入月日历失败"})
        )*/
        const app = getApp();
        const username = app.globalData.username;
        // const today = new Date();
        // const year = today.getFullYear() ,month = today.getMonth(),date = today.getDate();
        getScheduleForMonth(year,month,username)
            .then((listData)=>{return daysInMonth(year,month,date,listData)}
            )
            .then(res => {
                this.setData({
                    'grid.list': res.thisMonth,
                    year: year,
                    month: month,
                    date: date,
                    todayDate: todayDate,
                    'listData.data': res.listDataValue,
                    hasSchedule:res.hasSchedule,
                    attendance:res.attendance,
                    scheduleId:res.scheduleId,
                })
            }).catch(
            err=>dd.alert({title:"载入月日历失败",content:JSON.stringify(err)})
        )
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
        const app = getApp();
        const username = app.globalData.username;
    
        getScheduleForMonth(year,month,username)
            .then((listData)=>{return daysInMonth(year,month,date,listData)}
            )
            .then(res => {
                this.setData({
                    'grid.list': res.thisMonth,
                    year: year,
                    month: month,
                    date: date,
                    todayDate:todayDate,
                    'listData.data': res.listDataValue,
                    hasSchedule:res.hasSchedule,                    
                    attendance:res.attendance,
                    scheduleId:res.scheduleId,
                })
            }).catch(
            err=>dd.alert({title:"载入月日历失败",content:JSON.stringify(err)})
        )
       /* daysInMonth(year,month,date,todayDate)
            .then(res => {
                // this.setData({'grid.list':res.thisMonth,year:year,month:month,date:date,todayDate:date});
                this.setData({
                    'grid.list': res.thisMonth,
                    year: year,
                    month: month,
                    date: date,
                    todayDate: todayDate,
                    'listData.data': res.listDataValue,
                    hasSchedule:res.hasSchedule
                })
            }).catch(
            res=>dd.alert({title:"载入月日历失败"})
        )  */
    },
    resetCalendar(){ //重新刷新页面,同onload
        this.onLoad()
    }
    /*loginSystem() {
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

    },*/
})

