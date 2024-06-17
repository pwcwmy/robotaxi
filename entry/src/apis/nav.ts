import $api from './index';

const  keyMapkey = 'b66f8dc02cb315c691792bd9cf161676';
const  originlocation = '113.268554,23.132943';
const baseData = {
  key:keyMapkey,
  location: originlocation
}

export const  getPosByWord = (data)=>{
  return $api.get("https://restapi.amap.com/v5/place/around", {
    ...baseData,
    ...data
  })
}

