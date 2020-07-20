import request from '@/utils/request'
import store from '@/store'
console.log(store)
const uploadImg = file => {
  return new Promise((resolve, reject)=>{
    let formData = new FormData()
    formData.append('file',file)
    request({
      url : '/wx/api/upload/uploadFile',
      method: 'post',
      data : formData,
      onUploadProgress : progressEvent => {
        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
        store.commit('SET_UPLOAD_COMPLETE',complete)
      }
    })
    .then(res => {
      if (res.code === 1) {
        resolve(res.data)
      } else {
        console.log(res)
        // this.$message({
        //   showClose: true,
        //   message: '上传失败',
        //   type: 'error'
        // });
      }
    })
    .catch(err => {
      console.log(err)
    })

  })
}

export default {
  uploadImg
}
