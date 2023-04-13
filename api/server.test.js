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
});

describe("[POST] api/auth/login", () => {
  const newUser = {
    username: "Captain Marvel",
    password: "foobar",
  };

  test("must provide a username and password to login", async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: newUser.username });
    expect(res.body.message).toBe("username and password required");
  });
  test("on SUCCESSFUL login the body should contain token and message", async () => {
    await request(server).post("/api/auth/register").send(newUser);
    const res = await request(server).post("/api/auth/login").send(newUser);
    expect(res.body.message).toBe(`welcome, ${newUser.username}`);
    expect(res.body.token !== undefined).toBe(true);
  });
});

describe("[GET] /api/jokes", () => {
  test("endpoint is restricted without Authorization", async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body.message).toBe("token required");
  });
  test.todo("with authorization token you receive the jokes");
});
