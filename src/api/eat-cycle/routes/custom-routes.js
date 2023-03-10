'use strict';

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
        method: 'POST',
        path: '/lca/insertFood',
        handler: 'custom-controllers.insertFood',
        config: {
            auth: false
        }
      },
    ]
}