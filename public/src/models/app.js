const alertTypeMap = {
  success: 1,
  warning: 2,
  error: 3,
  info: 4
}
const defaultType = alertTypeMap.error

module.exports = {
  namespace: 'app',
  state: {
    alert: {}
  },
  reducers: {
    setAlert: (action, state) => {
      const alert = Object.assign({}, action, {
        type: action.type
          ? (alertTypeMap[action.type] || defaultType) // in case type is provided but not an actual option
          : defaultType,
        duration: action.duration || 3
      })
      return {alert}
    },
    clearAlert: (action, state) => {
      return { alert: {} }
    }
  }
}
