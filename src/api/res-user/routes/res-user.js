module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/users/register',
        handler: 'res-user.register',
        config: {
          auth: false
        }
      },
      {
        method: 'PUT',
        path: '/users/update',
        handler: 'res-user.update',
        config: {
          auth: false
        }
      },
      {
        method: 'POST',
        path: '/users/handleGoogleSignIn',
        handler: 'res-user.handleGoogleSignIn',
        config: {
          auth: false
        }
      },
    ],
};
   