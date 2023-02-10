const request = require('supertest');

const mockUserData = {
  email: "testupdate@me.com",
  password: "meawmeawmeaw",
  name: "meaw"
};

const mockUserData2 = {
    email: "testupdate2@me.com",
    password: "meawmeawmeaw",
    name: "meaw"
};

const actionUpdateUser = async (jwt, data) => {
    return new Promise(async (resolve, reject) => {
        await request(strapi.server.httpServer)
        .put(`/api/users/update`)
        .set('Authorization', 'Bearer ' + jwt)
        .send(data)
        .then((data) => {
            resolve(data)
        });
    });
}


it("test update user with allow key", async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUserData,
        role,
    });

    const jwt = await strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    let updateUser = await actionUpdateUser(jwt , {name: "maomaomao"})
    expect(updateUser.status).toBe(200);
    expect(updateUser.body.name).toBe("maomaomao");

    updateUser = await actionUpdateUser(jwt , {height: 12.4})
    expect(updateUser.status).toBe(200);
    expect(updateUser.body.height).toBe(12.4);

    updateUser = await actionUpdateUser(jwt , {weight: 120.4})
    expect(updateUser.status).toBe(200);
    expect(updateUser.body.weight).toBe(120.4);

    updateUser = await actionUpdateUser(jwt , {gender: 'M'})
    expect(updateUser.status).toBe(200);
    expect(updateUser.body.gender).toBe('M');
});

it("test update user with not allow key", async () => {
    const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
    const role = defaultRole ? defaultRole.id : null;
    const user = await strapi.plugins['users-permissions'].services.user.add({
        ...mockUserData2,
        role,
    });

    const jwt = await strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
    });

    let updateUser = await actionUpdateUser(jwt , {email: "12121212@1212.com"})
    expect(updateUser.status).toBe(400);
});