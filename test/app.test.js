const fs = require('fs');
const { setupStrapi, cleanupStrapi } = require("./helpers/strapi");

jest.setTimeout(1000 * 60 * 60);

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await cleanupStrapi();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
  expect(1 === 2).toBe(true);
});