import common from '@ohos.app.ability.common';
import data_preferences from '@ohos.data.preferences'
import defaultAppManager from '@ohos.bundle.defaultAppManager';

class Store {
  private  preferences;
  private  context;

  set(key:string , val: any){
    this.preferences.put(key,val);
    this.preferences.flush(); // 持久化
  }

  get(key: string){
      return new Promise(async (resolve,reject)=>{
        if(!this.preferences){
          data_preferences.getPreferences(this.context,'mystore').then(val=>{
            console.log('用户首选项初始化成功')
            this.preferences  = val;
            this.preferences.get(key,false,(err,res)=>{
              if(err) return reject(err)
              resolve(res)
            })
          })
        } else {
          this.preferences.get(key,false,(err,res)=>{
            if(err) return reject(err)
            resolve(res)
          })
        }
      })
  }

  delete(key: string){
    this.preferences.delete(key);
    this.preferences.flush(); // 持久化
  }


  initStore(context:common.UIAbilityContext){
    this.context = context;
    data_preferences.getPreferences(context,'mystore').then(val=>{
      console.log('用户首选项初始化成功')
      this.preferences  = val;
    })
  }

}

export default new Store();