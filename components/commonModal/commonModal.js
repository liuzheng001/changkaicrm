
/**
 * 自定义modal浮层
 * 使用方法：
 * <modal show="{{showModal}}" height='60%' bindcancel="modalCancel" bindconfirm='modalConfirm'>
     <view>你自己需要展示的内容</view>
  </modal>

  属性说明：
  show： 控制modal显示与隐藏
  height：modal的高度 
  bindcancel：点击取消按钮的回调函数
  bindconfirm：点击确定按钮的回调函数

  使用模块：
  场馆 -> 发布 -> 选择使用物品
 */

Component({
  /**
   * 组件的属性列表
   */
  props: {
    //是否显示modal
    show: false,
      //父组件的参数
    parameter: "**",

    //modal的高度
    // height: '100%',
    onCancelRecord:(data)=>{ 
      
         console.log(data);
    },
    onCreateRecord:(data)=>{
        console.log(data);
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      // this.setData({show: false})
    },

    cancel() {
      //不能直接用this.setData({ show: false })方法设置props，这样可以关闭modal，但第2次再打开就不行，只有将数据传到父组件，通过父组件setData
      this.props.onCancelRecord(false);
      // this.setData({ show: false })
      // this.triggerEvent('cancel')
    },

    confirm() {
        //不能直接用this.setData({ ifShow: false })方法，这样可以关闭modal，但第2次再打开就不行，只有将数据传到父组件，通过父组件setData
        // this.props.onChangeShow(false);
        this.props.onCreateRecord(this.props.parameter);
        // this.setData({ show: false })
      // this.triggerEvent('confirm')
      // dd.alert({content:'确定'})

    },

  },

})
// ————————————————
// 版权声明：本文为CSDN博主「solocoder222」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/solocoder/article/details/80696752
