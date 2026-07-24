import { describe, it, expect } from 'vitest';
import {
    ShipzyClient, EpodClient, OrderClient, EcmrClient, AddressClient,
    CarrierEpodClient, CarrierAddressClient,
    ShipzyConfig, ShipzyError, ShipzyAuthError, VERSION
} from '../src/index';

describe('VERSION', () => {
    it('should have a version', () => {
        expect(VERSION).toBe('1.0.0');
    });
});

describe('ShipzyClient', () => {
    it('should create with all sub-clients', () => {
        const client = new ShipzyClient({ token: 'test' });
        expect(client.epod).toBeInstanceOf(EpodClient);
        expect(client.order).toBeInstanceOf(OrderClient);
        expect(client.ecmr).toBeInstanceOf(EcmrClient);
        expect(client.address).toBeInstanceOf(AddressClient);
        expect(client.carrierEpod).toBeInstanceOf(CarrierEpodClient);
        expect(client.carrierAddress).toBeInstanceOf(CarrierAddressClient);
    });

    it('should update token across all clients', () => {
        const client = new ShipzyClient({ token: 'old' });
        client.updateToken('new-token');
        expect(client.epod.config.token).toBe('new-token');
        expect(client.order.config.token).toBe('new-token');
        expect(client.ecmr.config.token).toBe('new-token');
        expect(client.address.config.token).toBe('new-token');
        expect(client.carrierEpod.config.token).toBe('new-token');
        expect(client.carrierAddress.config.token).toBe('new-token');
    });

    it('should update base URL across all clients', () => {
        const client = new ShipzyClient({ baseUrl: 'https://old.example.com' });
        client.updateConfig({ baseUrl: 'https://new.example.com' });
        expect(client.epod.config.baseUrl).toBe('https://new.example.com');
        expect(client.order.config.baseUrl).toBe('https://new.example.com');
    });
});

describe('Sub-clients', () => {
    it('EpodClient should have correct config', () => {
        const client = new EpodClient({ baseUrl: 'http://localhost:1417', token: 'tok' });
        expect(client.config.baseUrl).toBe('http://localhost:1417');
        expect(client.config.token).toBe('tok');
    });

    it('OrderClient should have correct config', () => {
        const client = new OrderClient({ baseUrl: 'http://localhost:1417' });
        expect(client.config.baseUrl).toBe('http://localhost:1417');
    });

    it('EcmrClient should have correct config', () => {
        const client = new EcmrClient({ timeout: 60000 });
        expect(client.config.timeout).toBe(60000);
    });
});

describe('Errors', () => {
    it('ShipzyError should have status code', () => {
        const err = new ShipzyError('bad request', 400);
        expect(err.statusCode).toBe(400);
        expect(err.name).toBe('ShipzyError');
    });

    it('ShipzyAuthError should be 401', () => {
        const err = new ShipzyAuthError('unauthorized');
        expect(err.statusCode).toBe(401);
        expect(err.name).toBe('ShipzyAuthError');
    });
});
