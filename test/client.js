process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiFiles = require('chai-files');
const server = require('../server');
const client = require('../app/client/client');
const { remove } = require('../app/client/tools');
const config = require('../app/config').get(process.env.NODE_ENV);

chai.use(chaiHttp);
chai.use(chaiFiles);
chai.should();
const expect = chai.expect;
const file = chaiFiles.file;

describe('Wallet tests', () => {
    var newWallet = {
        password: '123456'
    };

    it('/POST /wallet/create', (done) => {
        const params = {
            'password': newWallet.password,
            'label': 'test'
        };

        chai
            .request(server)
            .post('/wallet/create')
            .send(params)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('address');
                res.body.should.have.property('label');

                newWallet.id = res.body._id;
                newWallet.addr = res.body.address;

                const fileName = config.keystorePath + '/' + newWallet.addr + '.json';
                expect(file(fileName)).to.exist;

                done();
            });
    });

    it('/GET /wallet', (done) => {
        chai
            .request(server)
            .get('/wallets')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('array').have.length.above(0);
                done();
            });
    });

    it('/GET /wallet/:id', (done) => {
        chai
            .request(server)
            .get('/wallet/' + newWallet.id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('address');
                res.body.should.have.property('label');
                res.body.should.have.property('balance');
                done();
            });
    });

    it('/GET /wallet/address/:addr', (done) => {
        chai
            .request(server)
            .get('/wallet/address/' + newWallet.addr)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('address');
                res.body.should.have.property('label');
                res.body.should.have.property('balance');
                done();
            });
    });

    it('/GET /wallet/:id/transfer', (done) => {
        const params = {
            from: newWallet.addr,
            to: "5b13bbbd2202b0b6f33e1f1e6e6785765a6ea889",
            password: "123456"
        }
        chai
            .request(server)
            .post('/wallet/transfer')
            .send(params)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.an('object');
                res.body.should.have.property('Error');
                done();
            });
    });
});