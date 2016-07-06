module.exports = {
  namespace: 'app',
  state: {
    alert: {}
  },
  reducers: {
    setAlert: (data, state) => {
      return { alert: action }
    },
    clearAlert: (data, state) => {
      return { alert: {} }
    }
  },
  effects: {
    alert: (data, state, send, done) => {
      const id = Math.random() // used to ensure timeout removes correct alert
      const duration = data.duration || 5000
      send('app:setAlert', { msg: data.msg, _id: id }, () => {
        window.setTimeout(() => {
          if (state.alert._id && state.alert._id === id) {
            send('app:clearAlert', null, done)
          }
        }, duration)
      })
    }
  }
}
