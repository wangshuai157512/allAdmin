const isDev = true
let devImgUrl = 'http://localhost:3002'
// let devImgUrl = 'https://uec.chinaedu.net'
let prodImgUrl = 'https://xxzx.chinaedu.net'
const imgUrl = isDev?devImgUrl:prodImgUrl
export default {
  imgUrl
}
