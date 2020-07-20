const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  projectState: state => state.user.projectState,
  roles: state => state.user.roles
}
export default getters
