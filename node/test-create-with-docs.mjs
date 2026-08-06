import { ZymeupClient } from './dist/index.js';

const client = new ZymeupClient({
    baseUrl: 'http://127.0.0.1:1417',
    token: '55fd6b65-3b2a-432a-9852-06dd71053752',
    timeout: 30000,
    maxRetries: 0,
});

async function main() {
    console.log('=== Step 1: Verify auth via /api/v1/admin/whoami ===');
    try {
        const resp = await fetch('http://127.0.0.1:1417/api/v1/admin/whoami', {
            headers: { 'Authorization': 'Bearer 55fd6b65-3b2a-432a-9852-06dd71053752' },
        });
        const whoami = await resp.json();
        console.log('whoami:', JSON.stringify(whoami, null, 2));
        if (!whoami.user_id) {
            console.error('Auth failed — no user_id');
            return;
        }
    } catch (e) {
        console.error('whoami failed:', e.message);
        return;
    }

    console.log('\n=== Step 2: List existing orders ===');
    try {
        const list = await client.order.list({ page: 1, pageSize: 5 });
        console.log('Orders:', JSON.stringify(list, null, 2));
    } catch (e) {
        console.error('list failed:', e.message);
    }

    console.log('\n=== Step 3: Create order with documents (ECMR + EPOD) ===');
    const orderNo = `SDK-${Date.now()}`;
    const payload = {
        order: {
            order_no: orderNo,
            customer_name: 'Test Customer',
            customer_email: 'test@example.com',
            customer_phone: '+31612345678',
            currency: 'EUR',
            total_amount: 150.0,
            notes: 'SDK test order via createWithDocuments',
            shipping_address: {
                full_name: 'Test Receiver',
                street: 'Keizersgracht',
                house_number: '100',
                city: 'Amsterdam',
                postal_code: '1015AA',
                country_code: 'NL',
                phone: '+31612345679',
                email: 'receiver@example.com',
            },
            sender_address: {
                full_name: 'Test Sender',
                street: 'Dam Square',
                house_number: '1',
                city: 'Amsterdam',
                postal_code: '1012JS',
                country_code: 'NL',
                phone: '+31612345670',
                email: 'sender@example.com',
            },
        },
        auto_generate: { ecmr: true, epod: true },
        channels: ['copy_url'],
        invite_immediately: false,
        recipient_email: 'receiver@example.com',
        recipient_phone: '+31612345679',
        lang: 'en',
    };

    try {
        const result = await client.order.createWithDocuments(payload);
        console.log('Result:', JSON.stringify(result, null, 2));

        if (result.code === 200 || result.code === 0 || result.data) {
            console.log('\n✅ Order created successfully!');
            if (result.data?.order) {
                console.log('   Order ID:', result.data.order.id);
                console.log('   Order No:', result.data.order.order_no);
                console.log('   Status:', result.data.order.status);
            }
            if (result.data?.ecmr) {
                console.log('   ECMR ID:', result.data.ecmr.id);
                console.log('   ECMR Status:', result.data.ecmr.status);
            }
            if (result.data?.epod) {
                console.log('   EPOD ID:', result.data.epod.id);
                console.log('   EPOD Status:', result.data.epod.status);
            }
            if (result.data?.sign_url) {
                console.log('   Sign URL:', result.data.sign_url);
            }
            if (result.data?.notification_results) {
                console.log('   Notifications:', JSON.stringify(result.data.notification_results));
            }
        } else {
            console.error('❌ Failed:', result.error || result.message || JSON.stringify(result));
        }
    } catch (e) {
        console.error('createWithDocuments error:', e.message);
        if (e.statusCode) console.error('Status:', e.statusCode);
    }
}

main();
