module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/lca/insertTimeCycleLine',
        handler: 'custom-controllers.insertTimeCycleLine',
        config: {
          auth: false
        }
      }
    ]
}