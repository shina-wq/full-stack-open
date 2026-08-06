const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");

const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

// reset db after each test
beforeEach(async () => {
  await User.deleteMany({});

  await api.post("/api/users").send({
    username: "root",
    name: "Superuser",
    password: "sekret",
  });
});

// test successful creation
test("a valid user is created", async () => {
  const usersAtStart = await User.find({});

  const newUser = {
    username: "mluukkai",
    name: "Matti",
    password: "salainen",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await User.find({});

  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((user) => user.username);

  assert(usernames.includes(newUser.username));
});

// username too short
test("creation fails if username is too short", async () => {
  const usersAtStart = await User.find({});

  const newUser = {
    username: "ab",
    name: "Test",
    password: "password",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400);

  assert.match(result.body.error, /username/i);

  const usersAtEnd = await User.find({});

  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

// password too short
test("creation fails if password is too short", async () => {
  const usersAtStart = await User.find({});

  const newUser = {
    username: "tester",
    name: "Test",
    password: "ab",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400);

  assert.match(result.body.error, /password/i);

  const usersAtEnd = await User.find({});

  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

// duplicate username
test("creation fails with duplicate username", async () => {
  const usersAtStart = await User.find({});

  const newUser = {
    username: "root",
    name: "Another Root",
    password: "password",
  };

  const result = await api
    .post("/api/users")
    .send(newUser)
    .expect(400);

  assert.match(result.body.error, /unique/i);

  const usersAtEnd = await User.find({});

  assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});

after(async () => {
  const mongoose = require("mongoose");
  await mongoose.connection.close();
});