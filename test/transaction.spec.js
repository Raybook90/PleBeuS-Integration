const supertest = require('supertest');
const app = require('../app');

const username = 'Test';
const minTemp = 15;
const maxTemp = 23;
const iterations = 1000;

describe('Transaction', function()  {
    for (let i = 1; i <= iterations; i++) {
        it(`should make transactions: ${i}`, (done) => {
                supertest(app)
                    .post('/api/transactions')
                    .field('username', username)
                    .field('minTemp', minTemp)
                    .field('maxTemp', maxTemp)
                    .attach('xlsxFile', 'sample-data/random15-20.xlsx')
                    .expect(201, done)
            });
    }
});