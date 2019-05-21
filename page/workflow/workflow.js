Page({
  data: {},
  onLoad() {},
    getDepartmentList() { //从服务器得到部门信息
        const app = getApp();
        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                event:'get_department_list',
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data)})
            },
            fail: (res) => {

            },
            complete: (res) => {
            }

        })
    },
    createTestWorkflow(){ //建立审批流程测试 progress-code:PROC-RIYJUE5W-ESNW8ITXOOCISY4HMD1T1-U6GEGBJJ-O1
        const app = getApp();
        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'post',
            data: {
                event:'createworkflow',
                process_code : 'PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8',
                originator_user_id : app.globalData.userId,
                dept_id: 76408150,
                // approvers : ,
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data)})
            },
            fail: (res) => {

            },
            complete: (res) => {
            }

        })
    },
    listTestWorkflow(){ //审批流程list progress-code:PROC-RIYJUE5W-ESNW8ITXOOCISY4HMD1T1-U6GEGBJJ-O1
        const app = getApp();
        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'post',
            data: {
                event:'listWorkflow',
                process_code : 'PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8',
                start_time : 1557409200000,
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data.result.list)})
                console.log(res.data.result.list)
            },
            fail: (res) => {

            },
            complete: (res) => {
            }

        })
    },
    getWorkflow(){ //get具体的审批流程,从listTestWorkflow中list来 progress-code:PROC-RIYJUE5W-ESNW8ITXOOCISY4HMD1T1-U6GEGBJJ-O1

        /*"260401be-ee89-468e-9eb3-3c58da73c2d7","3e6c82de-d483-484f-93e0-8fbc32b33a60","37953552-2207-4938-a753-cb2e9525f38f","eb032918-44d1-47ef-acbc-e27d6568bda1","c6db2639-327e-4114-84e1-a4820710b204","9b16fcba-6163-42be-bc88-25e84f197949","dd5013f9-a791-4e88-bff8-14629bcac33a","16c2378a-5060-42cd-9484-9b8a5bf8edde","f92bc6ce-d208-4cc9-bd68-98985f199aee","935055cc-4a04-4100-b0fa-13722e*/
        // PROC-6AA9FF64-D13D-402A-82E8-4ED79BFA6FC8,请假code
        const app = getApp();
        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'post',
            data: {
                event:'getWorkflow',
                process_instance_id:"5ac1448d-4e3c-4bd2-9de3-7ee9ebf0bf70",
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data.process_instance)})
                console.log(res.data.process_instance)
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })
    },
    registerCallback(){ //注册回调函数

        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'post',
            data: {
                event:'registerCallback',
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data)})
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })
    },
    callbackState(){
        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'post',
            data: {
                event:'callbackState',
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data)})
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })
    },
    deletecallback(){
        const url = getApp().gloablData.domain+"/getOapiByName.php";
        dd.httpRequest({
            url: url,
            method: 'post',
            data: {
                event:'deletecallback',
            },
            dataType: 'json',
            success: (res) => {
                dd.alert({'content':JSON.stringify(res.data)})
            },
            fail: (res) => {
                dd.alert({'content':JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })
    },


});
