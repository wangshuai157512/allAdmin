
const globalData = {
  state  : {
    uploadComplete : 0
  },
  mutations : {
    SET_UPLOAD_COMPLETE : (state,complete) => {
      state.uploadComplete = complete
      console.log(state.uploadComplete)
    }
  }
}

export default globalData
