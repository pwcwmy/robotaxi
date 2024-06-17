import promptAction from '@ohos.promptAction';
import useStore from '../store/index'
import picker from '@ohos.file.picker';
import fs from '@ohos.file.fs';
import http  from '@ohos.net.http';
import display from '@ohos.display';
import common from '@ohos.app.ability.common';
import request  from '@ohos.request';

export const baseUrl = "192.168.50.101:3000";

const requestSelf = async (url , method: http.RequestMethod = http.RequestMethod.GET, extraData: any = {})=>{
  console.log('到这里去操作了', url.includes('http'))

  const store = useStore;

  // console.log('token',await store.get('token'))
  const token = await store.get('token');
  let httpRequest = http.createHttp();

  httpRequest.on('headersReceive', (header) => {
    console.info('header: ' + JSON.stringify(header));
  });

  const data:any = await httpRequest.request(
    // 填写HTTP请求的URL地址，可以带参数也可以不带参数。URL地址需要开发者自定义。请求的参数可以在extraData中指定
    url.includes('http') ? url : baseUrl+url,
    {
      method, // 可选，默认为http.RequestMethod.GET 
      // 开发者根据自身业务需要添加header字段
      header: {
        'Content-Type': 'application/json',
        'authorization':  token || ''
      },
      extraData,
      expectDataType: http.HttpDataType.STRING, // 可选，指定返回数据的类型
      usingCache: true, // 可选，默认为true
      priority: 1, // 可选，默认为1
      connectTimeout: 60000, // 可选，默认为60000ms
      readTimeout: 60000, // 可选，默认为60000ms
      usingProtocol: http.HttpProtocol.HTTP1_1, // 可选，协议类型默认值由系统自动指定
    },
  );
  //
  // console.info('Result:' + JSON.stringify(data.result));
  // console.info('code:' + JSON.stringify(data.responseCode));
  // // data.header为HTTP响应头，可根据业务需要进行解析
  // console.info('header:' + JSON.stringify(data.header));
  // console.info('cookies:' + JSON.stringify(data.cookies)); // 8+

  httpRequest.off('headersReceive'); // 移除监听
  // 当该请求使用完毕时，调用destroy方法主动销毁
  httpRequest.destroy();
  return JSON.parse(data.result);


};


const $api = {
  post(url,data){
    console.log('执行post请求')
    return requestSelf(url,http.RequestMethod.POST,data);
  },
  get(url,data){
    console.log('执行get请求')
    return requestSelf(url,http.RequestMethod.GET,data);
  }
}

export default $api;