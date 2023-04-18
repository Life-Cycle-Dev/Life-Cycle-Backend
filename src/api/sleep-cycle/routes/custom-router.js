module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/lca/insertTimeSleep',
        handler: 'custom-controllers.insertTimeSleep',
        config: {
          auth: false
        }
      },
      {
        method: 'PUT',
        path: '/lca/updateTimeSleep',
        handler: 'custom-controllers.updateTimeSleep',
        config: {
          auth: false
        }
      }
    ]
}