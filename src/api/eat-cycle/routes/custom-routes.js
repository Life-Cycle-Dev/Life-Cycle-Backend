module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/lca/getFood',
        handler: 'custom-controllers.getFood',
        config: {
            auth: false
        }
      },
      {
        method: 'GET',
        path: '/lca/getListFoodOfUser',
        handler: 'custom-controllers.getListFoodOfUser',
        config: {
            auth: false
        }
      },
      {
        method: 'POST',
        path: '/lca/insertFoodOfUser',
        handler: 'custom-controllers.insertFoodOfUser',
        config: {
            auth: false
        }
      },
      {
        method: 'DELETE',
        path: '/lca/deleteFoodOfUser',
        handler: 'custom-controllers.deleteFoodOfUser',
        config: {
            auth: false
        }
      },
    ]
}