
import common from '@ohos.app.ability.common'
import picker from '@ohos.file.picker';
import fs from '@ohos.file.fs';
import promptAction from '@ohos.promptAction'
import request from '@ohos.request';

export const uploadImage = (url:string,context:common.UIAbilityContext,max:number = 1)=>{

  return new Promise( async (resolve,reject)=>{
    let photoPicker = new picker.PhotoViewPicker();
    let PhotoSelectOptions = new picker.PhotoSelectOptions();
    PhotoSelectOptions.maxSelectNumber = max;
    PhotoSelectOptions.MIMEType = picker.PhotoViewMIMETypes.IMAGE_TYPE
    const result = await photoPicker.select(PhotoSelectOptions)
    const cacheDir = context.cacheDir;

    console.log('开始处理图片缓存写入')
    const uploadFiles = [];
    // 写入缓存文件
    result.photoUris.forEach((URI,index)=>{
      try{
        let srcFile = fs.openSync(URI, fs.OpenMode.READ_ONLY);

        const filename = `upload${index}${Date.now()}.jpg`;
        const destFileNmae = cacheDir+'/'+filename

        let destFile = fs.openSync(destFileNmae,  fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
        // 读取源文件内容并写入至目的文件
        let bufSize = 4096;
        let readSize = 0;
        let buf = new ArrayBuffer(bufSize);
        let readLen = fs.readSync(srcFile.fd, buf, { offset: readSize });
        while (readLen > 0) {
          readSize += readLen;
          fs.writeSync(destFile.fd, buf);
          readLen = fs.readSync(srcFile.fd, buf, { offset: readSize });
        }
        // 关闭文件
        fs.closeSync(srcFile);
        fs.closeSync(destFile);
        uploadFiles.push({
          uri:`internal://cache/${filename}`,
          filename,
          name:'file',
          type:'jpg'
        })

      } catch(e){
        reject(e);
      }

    })



    // 开始处理上传
    // 上传配置
    let uploadConfig = {
      url, //需要手动替换为真实服务器地址
      header: {
        'Accept': '*/*',
        'Content-Type': 'multipart/form-data',
      },
      method: "POST",
      files: uploadFiles,
      data: [ ],
    };

    try {
      request.uploadFile(context, uploadConfig).then((uploadTask) => {
        console.log('上传的结果是')
        uploadTask.on('complete',(data)=>{
          console.info("complete to upload:" + JSON.stringify(data));
          resolve(data);
        })
        uploadTask.on('fail',(data)=>{
          console.info("fail to upload:" + JSON.stringify(data));

        })
        // 监听上传进度
        uploadTask.on('headerReceive', function callback(headers){
          console.info("upOnHeader headers:" + JSON.stringify(headers));
        });

        uploadTask.on('progress',(uploadedSize: number, totalSize: number)=>{
          if(uploadedSize === totalSize) return promptAction.showToast({ message:'上传完成',bottom:500})
          promptAction.showToast({ message:`上传中${((uploadedSize/totalSize)*100).toFixed(2)}%`,bottom:500})
        })
      }).catch((err) => {
        console.error('Failed to request the upload. Cause: ' + JSON.stringify(err));
      });
    } catch (err) {
      console.error('err.code : ' + err.code + ', err.message : ' + err.message);
    }

  })



}