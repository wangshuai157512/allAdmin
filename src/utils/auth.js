import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const ProjectState = 'Admin-ProjectState'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getProjectState() {
  return Cookies.get(ProjectState)
}

export function setProjectState(projectState) {
  return Cookies.set(ProjectState, projectState)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
