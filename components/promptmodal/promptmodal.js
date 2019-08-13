Component({
  mixins: [],
  didMount() {},
  didUpdate() {},
  didUnmount() {},


    props: {
          //是否显示modal
          show:false,
          height:"80%",
          onConfirm:()=>{},
          onCancel:()=>{},
      },


      data: {

      },

   //* 组件的方法列表

  methods: {
      clickMask() {
      // this.setData({show: false})
      },

      cancel() {
          // this.setData({ show: false });
          // this.triggerEvent('cancel')
          this.props.onCancel();

      },

      confirm() {
          // this.setData({ show: false })
          this.props.onConfirm();
          // this.triggerEvent('confirm')
      }
}

});

