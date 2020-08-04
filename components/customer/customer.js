Component({
  mixins: [],
  data: {x:1},
  props: {extra:"default extra",onShowCounter:(data)=>{alert("default value")}},
  didMount() {},
  didUpdate() {
    if(this.data.x>5){
      dd.alert({"content":"x>5将变为1"})
      this.setData({x:1})
    }

  },
  didUnmount() {},
  methods: {
    handleTop(){
      this.setData({x:this.data.x+1})
    },
    showAlert(){
      this.props.onShowCounter("compoent's value")
    },
    showPropsValue(){
        alert(this.props.extra);
    }

  },
});
