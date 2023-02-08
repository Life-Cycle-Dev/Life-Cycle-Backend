const request = require('supertest');

const mockUserData = {
  email: "tester@strapi.com",
  password: "1234abc",
  name: "tester"
};

it("test register user and return jwt token", async () => {
  await request(strapi.server.httpServer) 
    .post("/api/user/register")
    .send(mockUserData)
    .expect("Content-Type", /json/)
    .expect(200)
    .then((data) => {
      expect(data.body.jwt).toBeDefined();
      expect(data.body.user).toBeDefined();
    });
});

it("test register with existing user", async () => {
  await request(strapi.server.httpServer) 
    .post("/api/user/register")
    .send(mockUserData)
    .expect(400)
});

it("test register with not complete infomation", async () => {
  await request(strapi.server.httpServer) 
    .post("/api/user/register")
    .send({
      email: "",
      password: "",
    })
    .expect(400)
});
