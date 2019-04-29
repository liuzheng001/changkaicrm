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
    dd.showToast({
      content: `第${e.currentTarget.dataset.index}个Item`,
      success: (res) => {

      },
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

