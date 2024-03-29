const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");

jest.setTimeout(1000 * 60 * 60 * 2);

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await cleanupStrapi();
});

it("test strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require('./user/register');
require('./user/update');
require('./user/login');