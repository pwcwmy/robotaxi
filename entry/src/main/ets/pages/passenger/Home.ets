import webview from '@ohos.web.webview';
import { login } from '../../../../apis/user'

@Entry
@Component
struct Home {
  // @Styles 内部只能使用公共样式, 不能嵌套使用自定义样式
  @Styles bd() {
    .border({width: 1, color: Color.Red, style: BorderStyle.Solid})
  }
  @Styles orderForm() {
    .width('100%').height('100%')
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
  // 创建一个webview的控制器
  webController: webview.WebviewController = new webview.WebviewController();

  // 侧栏的初始位移 -250
  @State offsetX: number = 0
  @State positionX: number = 0;

  // 如果登录了就显示手机号，否则显示请登录按钮
  @State userPhone: string = ''

  // 约束手势：左拖动/右拖动
  private panOption: PanGestureOptions = new PanGestureOptions({
    direction: PanDirection.Left | PanDirection.Right,
  })
  // 页面的构建函数
  build() {
    Column() {
      // 顶栏
      Row() {
        Image($r('app.media.user')).width(36) // 图片来源 iconfont
        Image($r('app.media.scan')).width(36)
      }.width('100%').height(50).position({x: 0, y: 0}).zIndex(9).justifyContent(FlexAlign.SpaceBetween).padding(10)

      Column() {
        // 地图
        Column() {
          Web({src: $rawfile('homemap.html'), controller: this.webController})
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
        }.formZone().translate({y: -15})
      }.orderForm()

      // 侧栏抽屉
      Column() {
        // 显示手机号或者立即登录
        Row() {
          Image($r('app.media.user')).width(35).margin({right:10})
          if (this.userPhone) {
            Text('尾号' + this.userPhone.slice(7)).fontSize(25)
          } else {
            Text('立即登录')
          }
        }.margin({top:100})
        // 余额栏
        Row() {
          Column(){
            Text('余额（元）').fontSize(13).margin({bottom:8})
            Text('239.99')
          }.width(0).flexGrow(1).borderWidth({right:1}).borderStyle(BorderStyle.Solid).borderColor(0xf07b30)
          Column(){
            Text('优惠券（张）').fontSize(13).margin({bottom:8})
            Text('20')
          }.width(0).flexGrow(1).borderWidth({right:1}).borderStyle(BorderStyle.Solid).borderColor(0xffac00)
        }.width('90%').backgroundColor(Color.Orange).height('120lpx').margin({top:30}).borderRadius(10)

        // 订单行程
        Row(){
          Badge({
            value: '10',
            style: {badgeSize: 6, badgeColor: 'FA2A2D'}
          }){
            Image($r('app.media.order')).width(20).margin({right:10})
          }
          Text('订单行程')
        }.justifyContent(FlexAlign.Start).width('90%').margin({top:40})

        // 联系客服
        Row(){
          Image($r('app.media.service')).width(20).margin({right:10})
          Text('联系客服')
        }.justifyContent(FlexAlign.Start).width('90%').margin({top:40})

        // 设置
        Row(){
          Image($r('app.media.setup')).width(20).margin({right:10})
          Text('设置')
        }.justifyContent(FlexAlign.Start).width('90%').margin({top:40})

      }
        .height('100%')
        .backgroundColor(0xe3e3e3)
        .position({x:0, y:0})
        .width(250)
        .zIndex(99)
        .translate({x: this.offsetX, z: 0})
        .gesture(
          // 绑定一个手势
          PanGesture(this.panOption)
            // 拖动过程中的事件
            .onActionUpdate((event: GestureEvent) => {
              // 如果手势是想左边拖动一定的距离我们认为用户的目的是关闭这个侧栏
              if(event.offsetX <=-60){
                animateTo({
                  duration: 300, // 动画时长
                },()=>{
                  this.offsetX = -250 // 完全关闭侧栏
                })
                return false
              }
              // event.offsetX 当前的手势拖动的位移
              this.offsetX =  (this.positionX + event.offsetX) <=0 ? (this.positionX + event.offsetX):0
            })
            .onActionEnd(()=>{
              this.positionX  =  this.offsetX
            })
        )
    }.width('100%').height('100%').bd()
  }
}