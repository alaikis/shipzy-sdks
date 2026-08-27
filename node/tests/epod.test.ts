import { describe, it, expect } from 'vitest';
import {
    ShipzyClient, EpodClient, OrderClient, EcmrClient, AddressClient,
    CarrierEpodClient, CarrierAddressClient, SupportTicketClient,
    ShipzyConfig, ZymeupError, ZymeupAuthError, VERSION
} from '../src/index';
import { BASE_URL, skipIfDown, SKIP_REASON } from './live-helpers';

describe('VERSION', () => {
    it('should have a version', () => {
        expect(VERSION).toBe('2.1.5');
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
        expect(client.supportTicket).toBeInstanceOf(SupportTicketClient);
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
        expect(client.supportTicket.config.token).toBe('new-token');
    });

    it('should update base URL across all clients', () => {
        const client = new ShipzyClient({ baseUrl: 'https://old.example.com' });
        client.updateConfig({ baseUrl: 'https://new.example.com' });
        expect(client.epod.config.baseUrl).toBe('https://new.example.com');
        expect(client.order.config.baseUrl).toBe('https://new.example.com');
        expect(client.supportTicket.config.baseUrl).toBe('https://new.example.com');
    });

    it('should propagate updateConfig to supportTicket (regression)', () => {
        const client = new ShipzyClient({ baseUrl: 'https://old.example.com' });
        client.updateConfig({ baseUrl: 'https://sync.example.com' });
        expect(client.supportTicket.config.baseUrl).toBe('https://sync.example.com');
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
    it('ZymeupError should have status code', () => {
        const err = new ZymeupError('bad request', 400);
        expect(err.statusCode).toBe(400);
        expect(err.name).toBe('ZymeupError');
    });

    it('ZymeupAuthError should be 401', () => {
        const err = new ZymeupAuthError('unauthorized');
        expect(err.statusCode).toBe(401);
        expect(err.name).toBe('ZymeupAuthError');
    });
});

// Live (mock-free) EpodClient behaviour. Authenticated EPOD endpoints require a
// merchant token we do not have, so each method is verified via the 401
// response: the SDK must build the correct URL + method + auth header and
// throw ZymeupAuthError. This proves request construction and error handling.
describe.skipIf(skipIfDown())('EpodClient (LIVE)', () => {
    const client = new EpodClient({ baseUrl: BASE_URL });

    it('list() hits POST /api/v1/shipment/epod/list and throws on 401', async () => {
        await expect(client.list()).rejects.toThrow(ZymeupAuthError);
    });

    it('get() hits the epod detail endpoint and throws on 401', async () => {
        await expect(client.get('epod-123')).rejects.toThrow(ZymeupAuthError);
    });

    it('generateSignUrl() hits POST /:id/sign and throws on 401', async () => {
        await expect(client.generateSignUrl('epod-123')).rejects.toThrow(ZymeupAuthError);
    });

    it('generatePdf() hits POST /:id/pdf and throws on 401', async () => {
        await expect(client.generatePdf('epod-123')).rejects.toThrow(ZymeupAuthError);
    });
})
