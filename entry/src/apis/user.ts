import $api from '.'

export const test = (data)=>{
  return $api.post('/test', data)
}

export const sendCode = (data)=>{
  return $api.post('/sendcode', data)
}

export const login = (data)=>{
  return $api.post('/user/login',data)
}

export const checkUserState = ()=>{
  return $api.post('/user/status',{})
}