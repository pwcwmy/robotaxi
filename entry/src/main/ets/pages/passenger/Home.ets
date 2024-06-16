@Entry
@Component
struct Home {
  // @Styles 内部只能使用公共样式, 不能嵌套使用自定义样式
  @Styles bd() {
    .border({width: 1, color: Color.Red, style: BorderStyle.Solid})
  }
  @Styles orderForm() {
    .width('100%').height('100%').backgroundColor(Color.Gray)
  }
  @Styles formZone() {
    .width('90%').height('300lpx').backgroundColor(Color.White).offset({y:-10}).borderRadius(10)
    .shadow({radius: 10, color: 0x000000, offsetX: 15, offsetY: 15})
  }
  @Styles map() {
    .flexGrow(1).height(0).width('100%')
  }
  @Styles formItem() {
    .width('100%').height('120lpx').padding({left:15})
  }
  build() {
    Column() {
      // 顶栏
      Row() {
        Image($r('app.media.user')).width(36) // 图片来源 iconfont
        Image($r('app.media.scan')).width(36)
      }.bd().width('100%').height(50).position({x: 0, y: 0}).zIndex(9).backgroundColor(Color.White).justifyContent(FlexAlign.SpaceBetween).padding(10)
      Column() {
        // 地图
        Column() {

        }.map().bd()
        // 起点终点的表单区域
        Column() {
          // 起点
          Row() {
            Circle({width:'15lpx', height:'15lpx'}).fill(Color.Green)
            Column() {
              Text('选择您上车的位置')
              Text('您常用的上车点').fontSize(10)
            }.alignItems(HorizontalAlign.Start).margin({left:15})
          }.formItem()

          // 终点
          Row() {
            Circle({width:'15lpx', height:'15lpx'}).fill(Color.Orange)
            Column() {
              Text('选择您下车的位置').fontSize(10)
            }.alignItems(HorizontalAlign.Start).margin({left:15})
          }.formItem().backgroundColor(0xd2d2d2).borderRadius(15)
        }.formZone().bd().translate({y: -15})
      }.orderForm()
    }.width('100%').height('100%').bd()
  }
}