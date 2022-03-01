const request = require('supertest')
const server = require('./api/server')
const db = require('./data/dbConfig')

const userA = { username: 'foo', password: 'bar' }
const userB = { username: 'fizz', password: 'buzz' }
const userC = { username: 'foo', password: 'buzz' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
afterAll(async () => {
  await db.destroy()
})

test('[0] Is the latest version of the project', () => {
  const pjson = require('./package.json')
  expect(pjson.version).toBe('0.0.1')
})

describe('server.js', () => {
  // 👉 AUTH
  // 👉 AUTH
  // 👉 AUTH
  describe('auth endpoints', () => {
    describe('[POST] /api/auth/register', () => {
      beforeEach(async () => {
        await db('users').truncate()
      })
      test('[1] adds a new user with a bcrypted password to the users table on success', async () => {
        await request(server).post('/api/auth/register').send(userA)
        const user = await db('users').first()
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('username')
        expect(user).toHaveProperty('password')
        expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(user.username).toBe(userA.username)
      }, 750)
      test('[2] responds with the new user with a bcrypted password on success', async () => {
        const { body } = await request(server).post('/api/auth/register').send(userA)
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('username')
        expect(body).toHaveProperty('password')
        expect(body.password).toMatch(/^\$2[ayb]\$.{56}$/)
        expect(body.username).toBe(userA.username)
      }, 750)
      test('[3] responds with a proper status code on success', async () => {
        const { status } = await request(server).post('/api/auth/register').send(userA)
        expect(status + '').toMatch(/2/)
      }, 750)
      test('[4] responds with an error status code if username exists in users table', async () => {
        await request(server).post('/api/auth/register').send(userA)
        const { status } = await request(server).post('/api/auth/register').send(userA)
        expect(status + '').toMatch(/4|5/)
      }, 750)
      test('[5] responds with "username taken" message if username exists in users table', async () => {
        await request(server).post('/api/auth/register').send(userA)
        const { body } = await request(server).post('/api/auth/register').send(userA)
        expect(JSON.stringify(body)).toEqual(expect.stringMatching(/taken/i))
      }, 750)
      test('[6] responds with an error status code if username or password are not sent', async () => {
        let res = await request(server).post('/api/auth/register').send({})
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/register').send({ username: 'foo' })
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/register').send({ password: 'bar' })
        expect(res.status + '').toMatch(/4|5/)
      }, 750)
      test('[7] responds with "username and password required" message if either is not sent', async () => {
        let res = await request(server).post('/api/auth/register').send({})
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/register').send({ username: 'foo' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/register').send({ password: 'bar' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
      }, 750)
    })
    describe('[POST] /api/auth/login', () => {
      beforeEach(async () => {
        await db('users').truncate()
        await request(server).post('/api/auth/register').send(userA)
      })
      test('[8] responds with a proper status code on successful login', async () => {
        const res = await request(server).post('/api/auth/login').send(userA)
        expect(res.status).toBe(200)
      }, 750)
      test('[9] responds with a welcome message and a token on successful login', async () => {
        const res = await request(server).post('/api/auth/login').send(userA)
        expect(res.body).toHaveProperty('message')
        expect(res.body).toHaveProperty('token')
      }, 750)
      test('[10] responds with an error status code if username or password are not sent', async () => {
        let res = await request(server).post('/api/auth/login').send({})
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/login').send({ username: 'foo' })
        expect(res.status + '').toMatch(/4|5/)
        res = await request(server).post('/api/auth/login').send({ password: 'bar' })
        expect(res.status + '').toMatch(/4|5/)
      }, 750)
      test('[11] responds with "username and password required" message if either is not sent', async () => {
        let res = await request(server).post('/api/auth/login').send({})
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/login').send({ username: 'foo' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
        res = await request(server).post('/api/auth/login').send({ password: 'bar' })
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
      }, 750)
      test('[12] responds with a proper status code on non-existing username', async () => {
        const res = await request(server).post('/api/auth/login').send(userB)
        expect(res.status + '').toMatch(/4|5/)
      }, 750)
      test('[13] responds with "invalid credentials" message on non-existing username', async () => {
        const res = await request(server).post('/api/auth/login').send(userB)
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/invalid/i))
      }, 750)
      test('[14] responds with a proper status code on invalid password', async () => {
        const res = await request(server).post('/api/auth/login').send(userC)
        expect(res.status + '').toMatch(/4|5/)
      }, 750)
      test('[15] responds with "invalid credentials" message on invalid password', async () => {
        const res = await request(server).post('/api/auth/login').send(userC)
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/invalid/i))
      }, 750)
    })
  })

  // 👉 JOKES
  // 👉 JOKES
  // 👉 JOKES
  describe('jokes endpoint', () => {
    describe('[GET] /api/jokes', () => {
      beforeEach(async () => {
        await db('users').truncate()
        await request(server).post('/api/auth/register').send(userA)
      })
      test('[16] responds with an error status code on missing token', async () => {
        const res = await request(server).get('/api/jokes')
        expect(res.status + '').toMatch(/4|5/)
      }, 750)
      test('[17] responds with a "token required" message on missing token', async () => {
        const res = await request(server).get('/api/jokes')
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/required/i))
      }, 750)
      test('[18] responds with an error status code on invalid token', async () => {
        const res = await request(server).get('/api/jokes').set('Authorization', 'bad token')
        expect(res.status + '').toMatch(/4|5/)
      }, 750)
      test('[19] responds with a "token invalid" message on invalid token', async () => {
        const res = await request(server).get('/api/jokes').set('Authorization', 'bad token')
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/invalid/i))
      }, 750)
      test('[20] responds with the jokes on valid token', async () => {
        const { body: { token } } = await request(server).post('/api/auth/login').send(userA)
        const res = await request(server).get('/api/jokes').set('Authorization', token)
        expect(JSON.stringify(res.body)).toEqual(expect.stringMatching('Did you hear about the guy whose'))
      }, 750)
    })
  })
})
