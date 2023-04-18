'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  bootstrap({ strapi }) {

    strapi.db.lifecycles.subscribe({
      models: ['plugin::users-permissions.user'],
      async beforeCreate(event) {
        if(event.params.data.auth === 'local') {
          event.params.data.username = event.params.data.email;
        }
      },
      async beforeUpdate(event) {
        if(event.params.data.auth === 'local') {
          event.params.data.username = event.params.data.email;
        }
      }
    });

  },
};
