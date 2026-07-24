import { describe, it, expect } from 'vitest';
import { EpodClient, ShipzyClient, ShipzyConfig, ShipzyError, ShipzyAuthError, VERSION } from '../src/index';

describe('VERSION', () => {
    it('should have a version string', () => {
        expect(VERSION).toBeTypeOf('string');
        expect(VERSION.length).toBeGreaterThan(0);
    });
});

describe('EpodClient', () => {
    it('should create with default config', () => {
        const client = new EpodClient();
        expect(client).toBeInstanceOf(EpodClient);
    });

    it('should create with custom config', () => {
        const client = new EpodClient({
            baseUrl: 'http://localhost:1417',
            token: 'test-token',
            timeout: 60000,
        });
        expect(client).toBeInstanceOf(EpodClient);
    });

    it('should update token', () => {
        const client = new EpodClient();
        client.setToken('new-token');
        // No exception thrown
        expect(true).toBe(true);
    });
});

describe('ShipzyClient', () => {
    it('should create with default config', () => {
        const client = new ShipzyClient();
        expect(client).toBeInstanceOf(ShipzyClient);
        expect(client.epod).toBeInstanceOf(EpodClient);
    });

    it('should update token', () => {
        const client = new ShipzyClient();
        client.updateToken('new-token');
        // No exception thrown
        expect(true).toBe(true);
    });
});

describe('ShipzyError', () => {
    it('should have status code', () => {
        const error = new ShipzyError('test error', 400);
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('test error');
        expect(error.name).toBe('ShipzyError');
    });
});

describe('ShipzyAuthError', () => {
    it('should always be 401', () => {
        const error = new ShipzyAuthError('unauthorized');
        expect(error.statusCode).toBe(401);
        expect(error.name).toBe('ShipzyAuthError');
    });
});
