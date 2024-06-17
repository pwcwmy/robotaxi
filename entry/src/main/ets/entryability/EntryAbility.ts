import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import webSocket from '@ohos.net.webSocket';
import useStore from '../../../store'
import { baseUrl } from '../../../apis'

export default class EntryAbility extends UIAbility {

  reconnect(curIns?,url?){
    // 重连的话 先把上一个socket实例进行事件移除
    if(curIns){
      curIns.off('message')
      curIns.off('error')
      curIns.off('open')
      curIns.off('close')
    }
    let ws = webSocket.createWebSocket();
    this.initSocket(ws,url);
  }

  initSocket(ws,url?){
    let soc = ws || webSocket.createWebSocket(); // 如果有传入socket实例就是用传入的 没有就创建
    let ping;
    // 接受到消息事件
    soc.on('message',(err,value)=>{
      console.log('socket message fired')
      console.log(value);// 约定从webscoket传递过来的值是字符串
      const { type , payload } = JSON.parse(value);
      this.context.eventHub.emit(type,payload)
    })
    // 出现错误的事件
    soc.on('error',(err)=>{
      console.log('scoket error fired')
      setTimeout(()=>{
        if(ping) clearInterval(ping); // 结束心跳包的发送
        this.reconnect(false,url);
      },2000)
    })
    // 链接成功
    soc.on('open',()=>{
      console.log('打开socket通讯成功');
      ping = setInterval(()=>{
        // 约定传递给服务器的值都是 字符串 所以，约定格式 是 { type:'',payload:'' }
        soc.send(JSON.stringify({type:'ping'}))  // 保持跟服务器的心跳链接  避免被socket中断通讯
      },3000)
      //  全局订阅发送socket消息
      this.context.eventHub.on('sendmsg',(data)=>{
        // console.log('要发送消息了',JSON.stringify(data))
        soc.send(JSON.stringify(data))
      })
    })
    // 链接关闭
    soc.on('close',()=>{
      console.log('scoket close fired')
      setTimeout(()=>{
        if(ping) clearInterval(ping); // 结束心跳包的发送
        this.reconnect(false,url);
      },2000)
    })

    // 开始去链接socket服务器
    soc.connect(url,(err,value)=>{
      if(!err){
        console.log('与服务器连接失败')
      }else {
        console.log('与服务器连接失败')
        setTimeout(()=>{
          this.reconnect(false,url)
        },2000)
      }
    })
  }

  onCreate(want, launchParam) {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onCreate');
    this.context.eventHub.on('startSocket', (url) => {
      //  初始化我们的socket通讯
      this.initSocket(false, url)
    })
  }

  onDestroy() {
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    // Main window is created, set main page for this ability
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageCreate');

    windowStage.loadContent('pages/passenger/Home', (err, data) => {
      if (err.code) {
        hilog.error(0x0000, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(0x0000, 'testTag', 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }

  onWindowStageDestroy() {
    // Main window is destroyed, release UI related resources
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground() {
    // Ability has brought to foreground
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onForeground');
  }

  onBackground() {
    // Ability has back to background
    hilog.info(0x0000, 'testTag', '%{public}s', 'Ability onBackground');
  }
}
