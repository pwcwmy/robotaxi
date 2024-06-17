import $api from './index';

export const  login = (data)=>{
  return $api.post("/driver/login", data)
}

export const updateLicense = (data)=>{
  return $api.post('/driver/updateLicense',data)
}

export  const getMyLicense = ()=>{
  return $api.get('/driver/getMyLicense',{})
}
export const getBrandList = ()=>{
  return $api.get('/brand/list',{})
}

export const addCar = (data)=>{
  return $api.post('/driver/addCar',data)
}

export  const getMyCar = ()=>{
  return $api.get('/driver/mycar',{})
}