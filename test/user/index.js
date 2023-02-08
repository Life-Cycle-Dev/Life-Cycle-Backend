const request = require('supertest');

const mockUserData = {
  email: "tester@strapi.com",
  password: "1234abc",
  name: "tester"
};

it("test login user and return jwt token", async () => {
  const user = await strapi.plugins["users-permissions"].services.user.add(mockUserData);

  expect(user).toBeDefined();

  await request(strapi.server.httpServer) 
    .post("/api/auth/local")
    .set("Accept", "*/*")
    .set("Content-Type", "application/json")
    .send({
      identifier: "tester@strapi.com",
      password: "1234abc",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.jwt).toBeDefined();
    })
    .catch((err) => {
      console.log(err);
    });
});

it('test return users data for authenticated user', async () => {
  const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
  const role = defaultRole ? defaultRole.id : null;

  const user = await strapi.plugins['users-permissions'].services.user.add({
    ...mockUserData,
    name: 'tester2',
    email: 'tester2@strapi.com',
    role,
  });

  const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
    id: user.id,
  });

  await request(strapi.server.httpServer) // app server is an instance of Class: http.Server
    .get('/api/users/me')
    .set('accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + jwt)
    .expect('Content-Type', /json/)
    .expect(200)
    .then(data => {
      expect(data.body).toBeDefined();
      expect(data.body.id).toBe(user.id);
      expect(data.body.username).toBe(user.email);
      expect(data.body.email).toBe(user.email);
    });
});