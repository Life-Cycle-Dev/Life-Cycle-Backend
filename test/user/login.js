const request = require('supertest');

it('test login get users data by jwt', async () => {
  const defaultRole = await strapi.query('plugin::users-permissions.role').findOne({}, []);
  const role = defaultRole ? defaultRole.id : null;

  const user = await strapi.plugins['users-permissions'].services.user.add({
    name: 'tester2',
    email: 'tester2@admin.com',
    password: '1111111',
    provider: 'local',
    role,
  });

  const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
    id: user.id,
  });

  await request(strapi.server.httpServer)
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

it('test login with username and password', async () => {
  await request(strapi.server.httpServer) 
  .post("/api/auth/local")
  .set("accept", "application/json")
  .set("Content-Type", "application/json")
  .send({
    identifier: "tester2@admin.com",
    password: "1111111",
  })
  .expect("Content-Type", /json/)
  .expect(200)
  .then((data) => {
    expect(data.body.jwt).toBeDefined();
  });
});