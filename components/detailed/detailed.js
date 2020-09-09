Component({
    mixins: [],
    props:{
        //向父组件传值函数,空函数就可以了
        onReturnDetailed:(detailed)=>{}
    },
    data: {
        // listData: {
        onItemTap: 'handleListItemTap',
        catchDelete: 'catchDelete',
        onAdd: 'onAdd',
        onAddPicture: 'onAddPicture',
        onDeletePicture: 'onDeletePicture',
        onPicturePreview: 'onPicturePreview',
        header: '明细表',
        detailed: [
            {
                first: '第一行',
                second: '第二行',
                thumbs: [],
            },
            {
                thumbs:[{src:'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'},{src:'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'},{src:'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'},{src:'http://47.103.63.213/eapp-corp/upload/1557635457409-2019-05-12.jpg'}],
                title: '标题图片',
                arrow: 'horizontal',
                thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',

            },
        ]
        // }
    },
    didMount() {},
    didUpdate() {},
    didUnmount() {},
    methods: {
        handleListItemTap(e) {
            dd.showToast({
                content: `第${e.currentTarget.dataset.index}个Item`,
                success: (res) => {

                },
            });
        },
        catchDelete(e){
            const row = e.currentTarget.dataset.index;
            let list = this.data.detailed;
            list.splice(row,1);
            this.setData({
                "detailed":list
            })

        },
        onAdd() {
            let list = this.data.detailed
            list.push({
                first: 'add很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
                second: '子元素垂直对齐',
                thumbs:[],
                thumb: 'https://zos.alipayobjects.com/rmsportal/NTuILTPhmSpJdydEVwoO.png',

            });
            this.setData({
                "detailed":list
            })
            this.props.onReturnDetailed(list);
        },
        onPicturePreview(e){
            const imageUrl = e.currentTarget.dataset.src;
            dd.previewImage({
                urls:[imageUrl]
            });
        },
        onAddPicture(e){
            const t = this;
            const num = e.currentTarget.dataset.num;

            let thumbs = this.data.detailed[num].thumbs;
            dd.chooseImage({
                success: (res) => {
                    res.forEach(item)
                    const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                    //将数据存入,但没有上传
                    thumbs.push({
                        src: path
                    });
                    const  target = `detailed[${num}].thumbs`;
                    t.setData({
                            [target]:thumbs
                        }
                    );

                },
            });
        },
        onDeletePicture(e){
            const t = this;
            const num = e.currentTarget.dataset.num; //入口行号
            const no = e.currentTarget.dataset.no; //第几张图

            let thumbs = this.data.detailed[num].thumbs;
            thumbs.splice(no,1);
            const  target = `detailed[${num}].thumbs`;
            t.setData({
                    [target]:thumbs
                }
            );
        },
    },
});

