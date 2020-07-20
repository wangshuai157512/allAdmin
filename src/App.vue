<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  .el-dialog__body {
    overflow: auto;
    /*padding-bottom: 10px!important;*/
  }



  .query-input__ {
    /*width: 180px;*/
    display: flex;
    align-items: center;
    label {
      font-size: 14px;
      color: #666;
      margin-right: 10px;
    }
  }
  .query-wrap {
    display: flex;
    flex-wrap: wrap;
    .query-input__:first-child {
      margin-left: 0px;
    }
    .query-input__ {
      margin-left: 10px;
      margin-bottom: 10px;
    }
    .query-btn {
      margin-left: 10px;
    }
  }
  .input__ {
    width: 360px;
    margin-top: 20px;
    .input-wrap {
      display: inline-block;
    }
  }


  .upload-input {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .upload-btn {
    position: relative;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
  }
  .upload-btn:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
  }
  .upload-btn:active {
    background: #3a8ee6;
    border-color: #3a8ee6;
    color: #fff;
    outline: none;
  }
  button {
    border-style:solid;
  }
</style>
