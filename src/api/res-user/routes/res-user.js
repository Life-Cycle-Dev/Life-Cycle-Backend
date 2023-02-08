module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/user/register',
        handler: 'res-user.register',
        config: {
          auth: false
        }
      },
      {
        method: 'PUT',
        path: '/user/update',
        handler: 'res-user.update',
        config: {
          auth: false
        }
      },
    ],
};
   