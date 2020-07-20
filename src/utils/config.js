const DebugUrl = 'http://localhost:3002' // 服务器根目录（资源地址）
// const NormalUrl = 'https://www.pmhuai.top'
const NormalUrl = 'https://xxzx.chinaedu.net'
const BaseUrl = '/wx' // 服务器二级目录

const isDebug = true

export default {
  DebugUrl: isDebug ? DebugUrl : NormalUrl,
  BaseUrl: BaseUrl
}
