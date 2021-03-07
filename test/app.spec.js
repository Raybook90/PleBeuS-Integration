const supertest = require('supertest');
const app = require('../app');

describe('App', () => {
    it('should work', (done) =>{
        supertest(app)
            .get('/')
            .expect("Content-Type", /html/)
            .expect(200, done)
    })
});