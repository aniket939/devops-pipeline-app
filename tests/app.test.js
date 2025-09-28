import request from 'supertest';
import app from '../index.js';

let server;
let token;

beforeAll(async () => {
  server = app.listen(0);

  const res = await request(server)
    .post('/login')
    .send({ username: "admin", password: "password" });
  token = res.body.token;
});

afterAll(done => {
  server.close(done);
});

describe("Task API", () => {
  it("should return tasks", async () => {
    const res = await request(server)
      .get('/tasks')
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should create a new task", async () => {
    const res = await request(server)
      .post('/tasks')
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Task", done: false });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("New Task");
  });

  it("should update an existing task", async () => {
    const res = await request(server)
      .put('/tasks/1')
      .set("Authorization", `Bearer ${token}`)
      .send({ done: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.done).toBe(true);
  });

  it("should delete a task", async () => {
    const res = await request(server)
      .delete('/tasks/2')
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});
