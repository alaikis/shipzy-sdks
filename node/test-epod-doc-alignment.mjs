import { ZymeupClient } from './dist/index.js';

const BASE_URL = 'http://127.0.0.1:1417';
const API_TOKEN = '55fd6b65-3b2a-432a-9852-06dd71053752';

const sdk = new ZymeupClient({
    baseUrl: BASE_URL,
    token: API_TOKEN,
    role: 'merchant',
    maxRetries: 0,
    timeout: 30000,
});

let passed = 0;
let failed = 0;
const issues = [];

function assert(cond, msg) {
    if (cond) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.error(`  ❌ ${msg}`); failed++; }
}

function docIssue(area, detail) {
    issues.push({ area, detail });
    console.log(`  ⚠️  文档差异: ${area} — ${detail}`);
}

async function step(name, fn) {
    console.log(`\n📌 ${name}`);
    try { await fn(); }
    catch (err) {
        console.error(`  ❌ 异常: ${err.message}`);
        if (err.statusCode) console.error(`     HTTP ${err.statusCode}`);
        if (err.data) console.error(`     详情: ${JSON.stringify(err.data).substring(0, 200)}`);
        failed++;
    }
}

const ctx = {};

// ============================================================
// 1. createWithDocuments
// ============================================================
async function step1() {
    await step('1. createWithDocuments — 创建订单 + EPOD', async () => {
        const result = await sdk.order.createWithDocuments({
            order: {
                order_no: `ALIGN-${Date.now()}`,
                recipient_name: 'John Doe',
                customer_name: 'John Doe',
                recipient_phone: '8613800000000',
                customer_phone: '8613800000000',
                recipient_email: 'john@example.com',
                customer_email: 'john@example.com',
                currency: 'EUR',
                total_amount: 200.0,
                notes: 'Doc alignment test',
                delivery_address: {
                    full_name: 'John Doe',
                    street: 'Keizersgracht',
                    house_number: '100',
                    postal_code: '1015 AA',
                    city: 'Amsterdam',
                    country_code: 'NL',
                },
                shipping_address: {
                    full_name: 'John Doe',
                    street: 'Keizersgracht',
                    house_number: '100',
                    postal_code: '1015 AA',
                    city: 'Amsterdam',
                    country_code: 'NL',
                },
                sender_address: {
                    full_name: 'Sender BV',
                    street: 'Dam Square',
                    house_number: '1',
                    postal_code: '1012 JS',
                    city: 'Amsterdam',
                    country_code: 'NL',
                },
            },
            auto_generate: { ecmr: false, epod: true },
            epod_overrides: { delivery_mode: 'carrier' },
            channels: [],
        });

        assert(result.code === 0, `code=0`);
        assert(!!result.data?.order?.id, `order.id: ${result.data?.order?.id}`);
        assert(!!result.data?.epod?.id, `epod.id: ${result.data?.epod?.id}`);
        assert(result.data?.epod?.status === 'pending', `epod.status: ${result.data?.epod?.status}`);

        ctx.orderId = result.data.order.id;
        ctx.epodId = result.data.epod.id;
        ctx.epodTrackingNo = result.data.epod.tracking_no;

        // 文档 Epod 类型字段验证
        const epod = result.data.epod;
        assert(typeof epod.delivery_attempts === 'number', `delivery_attempts: ${epod.delivery_attempts}`);
        assert(typeof epod.hash_locked === 'boolean', `hash_locked: ${epod.hash_locked}`);
        assert(['pending', 'delivered', 'failed', 'partial'].includes(epod.status), `status 在文档枚举内`);
        assert(['carrier', 'self-delivery', 'self-pickup'].includes(epod.delivery_mode), `delivery_mode 在文档枚举内`);
    });
}

// ============================================================
// 2. list — 文档: GET /api/v1/shipment/epod/list
// ============================================================
async function step2() {
    await step('2. list — 文档示例数据', async () => {
        // 文档示例:
        // const epods = await sdk.epod.list({
        //   status: 'pending', trackingNo: 'TRK-12345', page: 1, pageSize: 20
        // });
        const result = await sdk.epod.list({ status: 'pending', page: 1, pageSize: 20 });

        assert(result.code === 0, `code=0`);
        assert(Array.isArray(result.data?.data), `data 是数组`);
        assert(typeof result.data?.total === 'number', `total: ${result.data?.total}`);

        const first = result.data?.data?.[0];
        if (first) {
            assert(typeof first.id === 'string', `list item.id`);
            assert(typeof first.tracking_no === 'string', `list item.tracking_no`);
            assert(typeof first.status === 'string', `list item.status`);
        }

        // trackingNo 过滤
        const filtered = await sdk.epod.list({ trackingNo: ctx.epodTrackingNo });
        assert(filtered.data?.data?.some(e => e.id === ctx.epodId), `trackingNo 过滤生效`);
    });
}

// ============================================================
// 3. get — 文档 Epod 类型验证
// ============================================================
async function step3() {
    await step('3. get — 文档 Epod 类型字段验证', async () => {
        const result = await sdk.epod.get(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assert(result.data?.id === ctx.epodId, `id 匹配`);

        const epod = result.data;
        // 文档 Epod 接口核心字段
        for (const f of ['id', 'tracking_id', 'tracking_no', 'status', 'recipient_name', 'proof_type', 'delivery_attempts', 'created_at', 'updated_at']) {
            assert(epod[f] !== undefined && epod[f] !== null, `${f}: ${String(epod[f])?.substring(0, 50)}`);
        }

        // 文档枚举
        assert(['signature', 'photo', 'otp', 'stamp'].includes(epod.proof_type), `proof_type 枚举: ${epod.proof_type}`);
        assert(['none', 'pending', 'ready', 'failed'].includes(epod.pdf_render_status || 'none'), `pdf_render_status 枚举`);
    });
}

// ============================================================
// 4. generateSignUrl — ⚠️ 方法名差异
// ============================================================
async function step4() {
    await step('4. generateSignUrl — ⚠️ 文档写 signUrl()，SDK 是 generateSignUrl()', async () => {
        // 文档: sdk.epod.signUrl('epod-abc123')
        // SDK:  client.epod.generateSignUrl(id)
        docIssue('方法名', '文档示例写 sdk.epod.signUrl()，SDK 实际方法名是 generateSignUrl()');

        const result = await sdk.epod.generateSignUrl(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assert(!!result.data?.sign_url, `sign_url 存在`);
        assert(result.data.sign_url.startsWith('https://'), `sign_url 是 HTTPS`);

        ctx.signUrl = result.data.sign_url;
        const url = new URL(result.data.sign_url);
        ctx.signToken = url.pathname.split('/').pop();
    });
}

// ============================================================
// 5. 公开端 GET /open/epod/sign/:token
// ============================================================
async function step5() {
    await step('5. 公开端: GET /open/epod/sign/:token', async () => {
        const resp = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}`);
        const result = await resp.json();
        if (result.error) { console.log(`  ⚠️ ${result.error}`); return; }

        assert(resp.ok, `HTTP ${resp.status}`);
        assert(!!result.tracking_no, `tracking_no`);
        assert(!!result.recipient_name, `recipient`);
        assert(!!result.signature_level_required, `signature_level: ${result.signature_level_required}`);
        ctx.policyVersionHash = result.policy_version_hash;
    });
}

// ============================================================
// 6. 公开端 POST /open/epod/sign/:token/consent
// ============================================================
async function step6() {
    await step('6. 公开端: POST /consent', async () => {
        if (!ctx.policyVersionHash) { console.log('  ⚠️ 跳过'); return; }
        const resp = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consent_types: ['delivery', 'signature'], policy_version_hash: ctx.policyVersionHash }),
        });
        const result = await resp.json();
        assert(resp.ok, `HTTP ${resp.status}`);
        assert(!!result.consent_id, `consent_id`);
        ctx.consentId = result.consent_id;
    });
}

// ============================================================
// 7. 公开端 POST /open/epod/sign/:token/capture
// ⚠️ API 返回 { status, evidence_hash }，不返回 hash_locked
// ============================================================
async function step7() {
    await step('7. 公开端: POST /capture — ⚠️ 返回无 hash_locked', async () => {
        if (!ctx.consentId) { console.log('  ⚠️ 跳过'); return; }

        docIssue('capture 响应', 'API 返回 { status, evidence_hash }，不返回 hash_locked（hash_locked 在下次 get 时才生效）');

        const mockSig = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const resp = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consent_id: ctx.consentId, signature_data: mockSig, proof_type: 'signature' }),
        });
        const result = await resp.json();
        assert(resp.ok, `HTTP ${resp.status}`);
        assert(!!result.evidence_hash, `evidence_hash`);
        assert(result.status === 'delivered', `status: ${result.status}`);
        // hash_locked 不在 capture 响应中
        assert(result.hash_locked === undefined || result.hash_locked === true, `hash_locked 未返回或为 true (实际: ${result.hash_locked})`);
    });
}

// ============================================================
// 8. get (after signing)
// ============================================================
async function step8() {
    await step('8. get (签名后) — hash_locked=true', async () => {
        const result = await sdk.epod.get(ctx.epodId);
        assert(result.data?.status === 'delivered', `status: ${result.data?.status}`);
        assert(result.data?.hash_locked === true, `hash_locked: true`);
        assert(!!result.data?.signature_data, `signature_data 存在`);
        assert(!!result.data?.document_hash, `document_hash 存在`);
    });
}

// ============================================================
// 9. generatePdf — ⚠️ API 返回 status 而非 pdf_render_status
// ============================================================
async function step9() {
    await step('9. generatePdf — ⚠️ API 返回 status 而非 pdf_render_status', async () => {
        // 文档: pdf_render_status: 'none'|'pending'|'ready'|'failed'
        // API:  { status: "pending", pdf_url: "" }
        docIssue('PDF 字段名', 'API 返回 { status, pdf_url }，文档写 pdf_render_status。SDK 已兼容两个字段名。');

        const result = await sdk.epod.generatePdf(ctx.epodId);
        assert(result.code === 0, `code=0`);
        // 兼容两个字段名
        const st = result.data?.status || result.data?.pdf_render_status;
        console.log(`  📋 status: ${st || 'unknown'}`);
        if (result.data?.pdf_url) console.log(`  📋 pdf_url: ${result.data.pdf_url}`);
    });
}

// ============================================================
// 10. verify
// ============================================================
async function step10() {
    await step('10. verify — 验签', async () => {
        const result = await sdk.epod.verify(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assert(typeof result.data?.verified === 'boolean', `verified: ${result.data?.verified}`);
    });
}

// ============================================================
// 11. deliver — 文档示例
// ============================================================
async function step11() {
    await step('11. deliver — 文档示例数据', async () => {
        const r = await sdk.order.createWithDocuments({
            order: {
                order_no: `DEL-${Date.now()}`, customer_name: 'Del Test', customer_email: 'del@t.com',
                recipient_name: 'Del Test', currency: 'EUR', total_amount: 50,
                delivery_address: { full_name: 'Del Test', street: 'St', house_number: '1', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
                shipping_address: { full_name: 'Del Test', street: 'St', house_number: '1', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
            },
            auto_generate: { ecmr: false, epod: true }, channels: [],
        });
        const id = r.data?.epod?.id;
        if (!id) { console.log('  ⚠️ 跳过'); return; }

        // 文档示例:
        // sdk.epod.deliver('epod-abc123', {
        //   delivery_date: '2026-07-19', photo_url: 'https://...', remark: 'Left at front desk'
        // });
        const result = await sdk.epod.deliver(id, {
            delivery_date: '2026-08-05',
            photo_url: 'https://example.com/photo.jpg',
            remark: 'Left at front desk',
        });
        assert(result.code === 0, `code=0`);
        assert(!!result.data?.sign_url, `deliver 后 sign_url 存在`);
    });
}

// ============================================================
// 12. fail — 文档示例
// ============================================================
async function step12() {
    await step('12. fail — 文档示例数据', async () => {
        const r = await sdk.order.createWithDocuments({
            order: {
                order_no: `FAIL-${Date.now()}`, customer_name: 'Fail Test', customer_email: 'fail@t.com',
                recipient_name: 'Fail Test', currency: 'EUR', total_amount: 30,
                delivery_address: { full_name: 'Fail Test', street: 'St', house_number: '2', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
                shipping_address: { full_name: 'Fail Test', street: 'St', house_number: '2', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
            },
            auto_generate: { ecmr: false, epod: true }, channels: [],
        });
        const id = r.data?.epod?.id;
        if (!id) { console.log('  ⚠️ 跳过'); return; }

        // 文档示例:
        // sdk.epod.fail('epod-abc123', { remark: 'Recipient not home' });
        const result = await sdk.epod.fail(id, { remark: 'Recipient not home' });
        assert(result.code === 0, `code=0`);
        const detail = await sdk.epod.get(id);
        assert(detail.data?.status === 'failed', `status: ${detail.data?.status}`);
    });
}

// ============================================================
// 13. update — 白名单字段
// ============================================================
async function step13() {
    await step('13. update — 文档白名单字段', async () => {
        const r = await sdk.order.createWithDocuments({
            order: {
                order_no: `UPD-${Date.now()}`, customer_name: 'Upd Test', customer_email: 'upd@t.com',
                recipient_name: 'Upd Test', currency: 'EUR', total_amount: 10,
                delivery_address: { full_name: 'Upd Test', street: 'St', house_number: '3', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
                shipping_address: { full_name: 'Upd Test', street: 'St', house_number: '3', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
            },
            auto_generate: { ecmr: false, epod: true }, channels: [],
        });
        const id = r.data?.epod?.id;
        if (!id) { console.log('  ⚠️ 跳过'); return; }

        const result = await sdk.epod.update(id, { remark: 'Updated via SDK', recipient_name: 'Updated Name' });
        assert(result.code === 0, `code=0`);
        const detail = await sdk.epod.get(id);
        assert(detail.data?.remark === 'Updated via SDK', `remark 更新成功`);
        assert(detail.data?.recipient_name === 'Updated Name', `recipient_name 更新成功`);
    });
}

// ============================================================
// 14. generateFromOrder — ⚠️ 返回结构差异
// ============================================================
async function step14() {
    await step('14. generateFromOrder — ⚠️ 返回 { epod, sign_url } 而非扁平', async () => {
        const orderResult = await sdk.order.create({
            order_no: `GFO-${Date.now()}`, customer_name: 'GFO Test', customer_email: 'gfo@t.com',
            currency: 'EUR', total_amount: 75,
            shipping_address: { full_name: 'GFO Test', street: 'St', house_number: '4', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
        });
        const orderId = orderResult.data?.id;
        if (!orderId) { console.log('  ⚠️ 跳过'); return; }

        // 文档示例:
        // sdk.epod.generateFromOrder('ord_123', {
        //   parcel_id: 'parcel_456', recipient_name: 'John Doe',
        //   recipient_phone: '8613800000000', delivery_mode: 'carrier'
        // });
        // 注意: parcel_id 是可选的，文档示例用了假 ID。实际测试不传 parcel_id。
        const result = await sdk.epod.generateFromOrder(orderId, {
            recipient_name: 'John Doe',
            recipient_phone: '8613800000000',
            delivery_mode: 'carrier',
        });

        // 文档说 result.epod.sign_url 自动生成
        // 实际 API 返回 { epod: {...}, sign_url: "...", sign_token_expires_at: "..." }
        // SDK 修复后 result.data.epod 存在
        assert(result.code === 0, `code=0`);
        assert(!!result.data?.epod?.id, `epod.id: ${result.data?.epod?.id}`);
        assert(!!result.data?.sign_url, `sign_url 自动生成`);
        assert(result.data?.epod?.status === 'pending', `status: ${result.data?.epod?.status}`);
        console.log(`  📋 epodId: ${result.data?.epod?.id}`);
        console.log(`  📋 sign_url: ${result.data?.sign_url?.substring(0, 60)}...`);
    });
}

// ============================================================
// 15. captureProof — 商户端采集
// ============================================================
async function step15() {
    await step('15. captureProof — 商户端采集签收证据', async () => {
        const r = await sdk.order.createWithDocuments({
            order: {
                order_no: `CAP-${Date.now()}`, customer_name: 'Cap Test', customer_email: 'cap@t.com',
                recipient_name: 'Cap Test', currency: 'EUR', total_amount: 10,
                delivery_address: { full_name: 'Cap Test', street: 'St', house_number: '5', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
                shipping_address: { full_name: 'Cap Test', street: 'St', house_number: '5', postal_code: '1012 JS', city: 'Amsterdam', country_code: 'NL' },
            },
            auto_generate: { ecmr: false, epod: true }, channels: [],
        });
        const id = r.data?.epod?.id;
        if (!id) { console.log('  ⚠️ 跳过'); return; }

        const result = await sdk.epod.captureProof(id, {
            proof_type: 'signature',
            signature_data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            remark: 'Captured via SDK',
        });
        assert(result.code === 0, `code=0`);
        // captureProof 返回完整 epod 对象
        assert(!!result.data?.id, `epod.id 返回`);
        assert(result.data?.status === 'delivered' || result.data?.status === 'pending', `status: ${result.data?.status}`);
    });
}

// ============================================================
// 16. list 最终验证
// ============================================================
async function step16() {
    await step('16. list 最终验证', async () => {
        const result = await sdk.epod.list({ trackingNo: ctx.epodTrackingNo });
        const found = result.data?.data?.find(e => e.id === ctx.epodId);
        assert(!!found, `列表中找到 EPOD`);
        assert(found?.status === 'delivered', `列表中 status: ${found?.status}`);
    });
}

// ============================================================
// Main
// ============================================================
async function main() {
    console.log('🚀 EPOD 文档对齐全链路测试');
    console.log(`📍 ${BASE_URL}`);
    console.log(`📄 参考: docs.shipzy.me/merchant-sdk/epod`);

    const t0 = Date.now();

    await step1();  await step2();  await step3();  await step4();
    await step5();  await step6();  await step7();  await step8();
    await step9();  await step10(); await step11(); await step12();
    await step13(); await step14(); await step15(); await step16();

    const ms = Date.now() - t0;

    console.log('\n' + '='.repeat(60));
    console.log(`📊 结果: ✅ ${passed} 通过 / ❌ ${failed} 失败 / ⏱️ ${ms}ms`);
    console.log('='.repeat(60));

    if (issues.length > 0) {
        console.log('\n⚠️  文档 vs SDK/接口 差异汇总:');
        for (const i of issues) console.log(`  [${i.area}] ${i.detail}`);
    }

    if (failed > 0) process.exit(1);
}

main();
