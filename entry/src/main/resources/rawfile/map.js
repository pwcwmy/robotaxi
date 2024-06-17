// 初始化调试工具
const vConsole = new window.VConsole();
setTimeout(()=>{
    vConsole.setSwitchPosition(0,500)
},300)

// 设置地图的安全密钥
window._AMapSecurityConfig  ={
    securityJsCode: "e1747a128d5411191959912d92b8dc27"
}

// 全局变量
var hwMap;
var AMapIns;
var nowMark;
var nowLayer;
var siteServer;
var h5port;

AMapLoader.load({
    key: "91eb57b683ce68a5bb67cb005ba255a5",
    version: "2.0"
}).then(AMap=>{
    AMapIns = AMap;
    const search = window.location.search;
    const query = new URLSearchParams(search);
    const lng = query.get('lng')
    const lat = query.get('lat')
    const ncp = new Promise((resolve, reject)=>{
        console.log('原来的坐标',lng,lat)
        const gcjloc = coordtransform.wgs84togcj02(lng,lat)
        console.log('转换后',gcjloc)
        resolve(new AMapIns.LngLat(gcjloc[0],gcjloc[1]))
        // AMapIns.convertFrom([lng,lat],'gps',(_,result)=>{
        //     resolve(result.locations[0])
        // })
    })
    hwMap = new AMap.Map("map",{
        viewMode: '2d' ,// 默认使用2d地图
        zoom: 16, // 地图的默认缩放等级
        center: ncp
    })
    console.log('ncp', ncp)
    // const position = new AMap.LngLat(113.324063,23.111592); // Marker经纬度
    const position = ncp;

    // 地图选点的标记
    nowMark = new AMap.Marker({
        position,
        content:`<i class="iconfont icon-a-dingwei4"></i>`,
        offset: new AMap.Pixel(0,15)
    })
    hwMap.add(nowMark)

    // 地图选点的文字提示
    nowLayer = new AMap.Marker({
        position,
        content: `<div class="posi">位置信息获取中</div>`,
        offset: new AMap.Pixel(-13,-40)
    })
    hwMap.add(nowLayer)

    // 对地图的移动事件进行监听
    const handleCenterChange = _.debounce((curCenter)=>{
        // 解码做标点的 地址信息
        siteServer.getAddress([curCenter.lng, curCenter.lat],function(status,result){
            if(status === 'complete' && result.info === 'OK'){
                console.log('result', result)
                const { city, province, district, township } = result.regeocode.addressComponent;
                console.log(`${province}${city}${district}`)
                const address = result.regeocode.formattedAddress.replace(`${province}${city}${district}${township}`,'')
                nowLayer.setContent(`<div class="posi">${address}</div>`); // 修改内容
                nowLayer.setPosition(curCenter); // 修改位置
                //  使用h5port把解码之后的地址信息 发送给ets
                // 传递出去的值是字符串的形式
                // 在本项目当中我们约定 web传出的格式 都是 {type:'',payload: 载荷}
                h5port.postMessage(JSON.stringify({
                    type:'passLocation',
                    payload: {
                        name: address,
                        location:  curCenter.lng+','+curCenter.lat
                    }
                }))
            }
        })
    },300)
    handleCenterChange(ncp)


    // 地图除了位置的移动 我们就去获取最新的中心点
    hwMap.on('mapmove',()=>{
        const curCenter = hwMap.getCenter(); // 获取地图最新的中心点坐标
        // 处理选点标记
        nowMark.setPosition(curCenter); // 同步我们的标记点为我们的地图最新的中心
        handleCenterChange(curCenter);
    })

    // 解码
    AMap.plugin('AMap.Geocoder',()=>{
        siteServer = new AMap.Geocoder({
            city: '020',
            extensions: 'base'
        })
    })
})




const handleMessage = (event)=>{
    console.log('从ets发送过来的数据',event.data);
    const { type,payload} = JSON.parse(event.data);
    if(type === 'setCenter'){
        // gps的坐标信息 不能直接是用在 地图框架当中 需要进行一定的转换

        const gcjloc = coordtransform.wgs84togcj02(lng,lat)
        const centerPoint = new AMapIns.LngLat(gcjloc[0],gcjloc[1])
        hwMap.setCenter(centerPoint);
        hwMap.setZoom(16);
        nowLayer.setPosition(centerPoint)

        // AMapIns.convertFrom([payload.lng, payload.lat], 'gps', (_,result)=>{
        //     const centerPoint = result.locations[0]; // gps坐标转换之后的坐标点
        //     hwMap.setCenter(centerPoint);
        //     hwMap.setZoom(16);
        //     nowLayer.setPosition(centerPoint)
        // })
    }

}


//  响应postMessage事件
window.addEventListener('message', function(event){
    console.log('与应用侧建立了通讯');
    if(event.data === '__init_port__' ){
        h5port = event.ports[0];
        h5port.onmessage = handleMessage
        h5port.postMessage(JSON.stringify({type:'webready'}))
    }
})
