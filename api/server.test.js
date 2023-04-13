const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");
const bcrypt = require("bcryptjs");

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

// Write your tests here
test("sanity", () => {
  expect(true).not.toBe(false);
});

describe("[POST]  api/auth/register", () => {
  const newUser = { username: "foo", password: "bar" };
  test("register creates new user in the database", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    expect(await db("users")).toHaveLength(1);
  });
  test("register responds with 201", async () => {
    const res = await request(server).post("/api/auth/register").send(newUser);
    expect(res.status).toBe(201);
  });

  test("register responds with username and password", async () => {
    const res = await request(server).post("/api/auth/register").send(newUser);
    expect(res.body).toMatchObject({ username: "foo" });
    expect(res.body.password !== undefined).toBe(true);
  });

  // test.todo("register uses bcrypt to authenticate the password");
});

// describe("[POST] api/auth/login", () => {
//   const newUser = {
//     username: "Captain Marvel",
//     password: "foobar",
//   };

//   test.todo("must provide a username and password to login");
//   test.todo("on SUCCESSFUL login the body should contain token and message");
//   test.todo("on failed login message is username and password required");
// });
