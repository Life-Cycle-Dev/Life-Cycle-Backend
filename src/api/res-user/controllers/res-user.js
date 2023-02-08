module.exports = {
    async register(ctx, next) {
      try {
        const { name, email, password } = ctx.request.body;
        const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
        const role = defaultRole ? defaultRole.id : null;

        const user = await strapi.plugins['users-permissions'].services.user.add({
          name,
          email,
          password,
          role,
        });

        const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
          id: user.id,
        });

        return ctx.body = {
          jwt,
          user : {
            email: user.email,
            name: user.name,
            birthdate: user.birthdate,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
          },
        };
      } catch (error) {
        ctx.status = 400;
        return ctx.body = error
      }
    },
    async update(ctx, next) {
      try {
        const cannotUpdate = ['id', 'username', 'email' ,'provider', 'resetPasswordToken',
        'confirmationToken', 'blocked', 'confirmed', 'blocked', 'role'];  
        let { body } = ctx.request;

        // check if body has key that cannot update
        for (const key in body) {
          if (cannotUpdate.includes(key)) {
            return ctx.badRequest('Cannot update this key');
          }
        }

        const authHeader = ctx.request.header.authorization;
        if (!authHeader) {
          return ctx.badRequest('Unauthorized');
        }

        const token = authHeader && authHeader.split(' ')[1];
        const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);

        if (!decoded) {
          return ctx.badRequest('Invalid token');
        }

        const userId = decoded.id;
        const user = await strapi.plugins['users-permissions'].services.user.edit(userId, body);

        return ctx.body = {
          email: user.email,
          name: user.name,
          birthdate: user.birthdate,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
        } 
      } catch (error) {
        ctx.status = 400;
        return ctx.body = error
      }
    }
};