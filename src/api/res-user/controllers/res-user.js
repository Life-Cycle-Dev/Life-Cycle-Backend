const uploader = require("../../../../helper/uploader");

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
          provider: "local",
          auth: "local",
          username: email,
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
            weight: user.weight
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
          profileImage: user.profileImage
        } 
      } catch (error) {
        ctx.status = 400;
        return ctx.body = error
      }
    },

    async handleGoogleSignIn(ctx, next) {
      try {
        const { name, email, uid, img } = ctx.request.body;

        const existingUser = await strapi.entityService.findMany(
            'plugin::users-permissions.user',
            {filters: { email: email }}
        );

        if(existingUser.length == 0) {
          const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
          const role = defaultRole ? defaultRole.id : null;
          const imgId = await uploader.uploadToLibrary(img);

          const user = await strapi.plugins['users-permissions'].services.user.add({
            name,
            email,
            password: uid,
            role,
            provider: "local",
            auth: "google",
            username: uid,
            profileImage: imgId.id
          });

          const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: user.id,
          });

          ctx.status = 200;
          return ctx.body = {
            jwt,
            user : {
              email: user.email,
              name: user.name,
              birthdate: user.birthdate,
              gender: user.gender,
              height: user.height,
              weight: user.weight
            },
          };

        } 

        if(existingUser[0].auth != "google") {
          ctx.status = 400;
          return ctx.body = {
            message : "This email is already registered by another method"
          };
        }

        if(existingUser[0].username == uid) {
          const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
            id: existingUser[0].id,
          });
  
          ctx.status = 200;
          return ctx.body = {
            jwt,
            user : {
              email: existingUser[0].email,
              name: existingUser[0].name,
              birthdate: existingUser[0].birthdate,
              gender: existingUser[0].gender,
              height: existingUser[0].height,
              weight: existingUser[0].weight
            },
          };
        }

        ctx.status = 400;
        return ctx.body = {
          message : "Unauthorized"
        };
      } catch (error) {
        console.log(error);
        ctx.status = 400;
        return ctx.body = {
          message : error.message
        }
      }
    }
};