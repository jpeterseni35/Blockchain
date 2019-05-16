/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Shipment3Contract extends Contract {

    async shipment3Exists(ctx, shipment3Id) {
        const buffer = await ctx.stub.getState(shipment3Id);
        return (!!buffer && buffer.length > 0);
    }

    async createShipment3(ctx, shipment3Id, value) {
        const exists = await this.shipment3Exists(ctx, shipment3Id);
        if (exists) {
            throw new Error(`The shipment3 ${shipment3Id} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(shipment3Id, buffer);
    }

    async readShipment3(ctx, shipment3Id) {
        const exists = await this.shipment3Exists(ctx, shipment3Id);
        if (!exists) {
            throw new Error(`The shipment3 ${shipment3Id} does not exist`);
        }
        const buffer = await ctx.stub.getState(shipment3Id);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateShipment3(ctx, shipment3Id, newValue) {
        const exists = await this.shipment3Exists(ctx, shipment3Id);
        if (!exists) {
            throw new Error(`The shipment3 ${shipment3Id} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(shipment3Id, buffer);
    }

    async deleteShipment3(ctx, shipment3Id) {
        const exists = await this.shipment3Exists(ctx, shipment3Id);
        if (!exists) {
            throw new Error(`The shipment3 ${shipment3Id} does not exist`);
        }
        await ctx.stub.deleteState(shipment3Id);
    }

}

module.exports = Shipment3Contract;
