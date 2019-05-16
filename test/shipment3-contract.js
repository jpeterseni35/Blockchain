/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { Shipment3Contract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('Shipment3Contract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new Shipment3Contract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"shipment3 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"shipment3 1002 value"}'));
    });

    describe('#shipment3Exists', () => {

        it('should return true for a shipment3', async () => {
            await contract.shipment3Exists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a shipment3 that does not exist', async () => {
            await contract.shipment3Exists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createShipment3', () => {

        it('should create a shipment3', async () => {
            await contract.createShipment3(ctx, '1003', 'shipment3 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"shipment3 1003 value"}'));
        });

        it('should throw an error for a shipment3 that already exists', async () => {
            await contract.createShipment3(ctx, '1001', 'myvalue').should.be.rejectedWith(/The shipment3 1001 already exists/);
        });

    });

    describe('#readShipment3', () => {

        it('should return a shipment3', async () => {
            await contract.readShipment3(ctx, '1001').should.eventually.deep.equal({ value: 'shipment3 1001 value' });
        });

        it('should throw an error for a shipment3 that does not exist', async () => {
            await contract.readShipment3(ctx, '1003').should.be.rejectedWith(/The shipment3 1003 does not exist/);
        });

    });

    describe('#updateShipment3', () => {

        it('should update a shipment3', async () => {
            await contract.updateShipment3(ctx, '1001', 'shipment3 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"shipment3 1001 new value"}'));
        });

        it('should throw an error for a shipment3 that does not exist', async () => {
            await contract.updateShipment3(ctx, '1003', 'shipment3 1003 new value').should.be.rejectedWith(/The shipment3 1003 does not exist/);
        });

    });

    describe('#deleteShipment3', () => {

        it('should delete a shipment3', async () => {
            await contract.deleteShipment3(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a shipment3 that does not exist', async () => {
            await contract.deleteShipment3(ctx, '1003').should.be.rejectedWith(/The shipment3 1003 does not exist/);
        });

    });

});