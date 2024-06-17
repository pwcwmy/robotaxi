import $api from '.'

export const  addOrder = (data)=>{
  return $api.post('/order/add',data)
}

export const getOrderInfo = (id:number)=>{
  return $api.get('/order/detail/'+id,{})
}

export const cancelOrder  = (data)=>{
  return $api.post('/order/cancel',data)
}

// 到达起点接用户
export const getClient = (data)=>{
  return $api.post('/order/getClient', data);
}

// 开始订单
export const start = (data)=>{
  return $api.post('/order/start',data)
}

export const completeOrder = (data)=>{
  return $api.post('/order/complete', data)
}

export const payMyOrder = (data)=>{
  return $api.post('/order/pay',data);
}