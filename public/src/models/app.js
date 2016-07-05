module.exports = {
  namespace: 'app',
  state: {
    alert: {}
  },
  reducers: {
    setAlert: (action, state) => {
      return { alert: action }
    },
    clearAlert: (action, state) => {
      return { alert: {} }
    }
  },
  effects: {
    alert: (action, state, send) => {
      const id = Math.random() // used to ensure timeout removes correct alert
      send('app:setAlert', { msg: action.msg, _id: id })
      const duration = action.duration || 5000
      window.setTimeout(() => {
        if (state.alert._id && state.alert._id === id) {
          send('app:clearAlert')
        }
      }, duration)
    }
  }
}
