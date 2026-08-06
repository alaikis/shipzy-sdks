import { ZymeupClient } from './dist/index.js';

const BASE_URL = 'http://127.0.0.1:1417';
const API_TOKEN = '55fd6b65-3b2a-432a-9852-06dd71053752';

const client = new ZymeupClient({
    baseUrl: BASE_URL,
    token: API_TOKEN,
    role: 'merchant',
    maxRetries: 0,
    timeout: 30000,
});

let passed = 0;
let failed = 0;

function assert(cond, msg) {
    if (cond) { console.log(`  ✅ ${msg}`); passed++; }
    else { console.error(`  ❌ ${msg}`); failed++; }
}

function assertExists(val, msg) {
    assert(val !== null && val !== undefined && val !== '', msg);
}

const ctx = {};

async function step(name, fn) {
    console.log(`\n📌 ${name}`);
    try { await fn(); }
    catch (err) {
        console.error(`  ❌ 异常: ${err.message}`);
        if (err.statusCode) console.error(`     HTTP ${err.statusCode}`);
        failed++;
    }
}

// ============ 1. Create Order + EPOD ============
async function step1() {
    await step('1. 创建订单 + 自动生成 EPOD (createWithDocuments)', async () => {
        const result = await client.order.createWithDocuments({
            order: {
                order_no: `E2E-${Date.now()}`,
                recipient_name: 'Jan de Vries',
                customer_name: 'Jan de Vries',
                recipient_email: 'jan@example.com',
                customer_email: 'jan@example.com',
                recipient_phone: '+31612345678',
                customer_phone: '+31612345678',
                currency: 'EUR',
                total_amount: 250.0,
                notes: 'E2E lifecycle test',
                delivery_address: {
                    full_name: 'Jan de Vries',
                    street: 'Keizersgracht',
                    house_number: '100',
                    postal_code: '1015AA',
                    city: 'Amsterdam',
                    country_code: 'NL',
                    phone: '+31612345678',
                    email: 'jan@example.com',
                },
                shipping_address: {
                    full_name: 'Jan de Vries',
                    street: 'Keizersgracht',
                    house_number: '100',
                    postal_code: '1015AA',
                    city: 'Amsterdam',
                    country_code: 'NL',
                    phone: '+31612345678',
                    email: 'jan@example.com',
                },
                sender_address: {
                    full_name: 'Test Sender BV',
                    street: 'Dam Square',
                    house_number: '1',
                    postal_code: '1012JS',
                    city: 'Amsterdam',
                    country_code: 'NL',
                    phone: '+31612345670',
                    email: 'sender@example.com',
                },
            },
            auto_generate: { ecmr: false, epod: true },
            epod_overrides: { delivery_mode: 'carrier' },
            channels: [],
            invite_immediately: false,
        });

        assert(result.code === 0, `code=0 (got ${result.code})`);
        assertExists(result.data?.order?.id, `order.id: ${result.data?.order?.id}`);
        assertExists(result.data?.epod?.id, `epod.id: ${result.data?.epod?.id}`);
        assert(result.data?.epod?.status === 'pending', `epod.status: ${result.data?.epod?.status}`);

        ctx.orderId = result.data.order.id;
        ctx.epodId = result.data.epod.id;
        ctx.epodTrackingNo = result.data.epod.tracking_no;
        console.log(`  📋 orderId: ${ctx.orderId}`);
        console.log(`  📋 epodId: ${ctx.epodId}`);
        console.log(`  📋 trackingNo: ${ctx.epodTrackingNo}`);
    });
}

// ============ 2. List EPODs ============
async function step2() {
    await step('2. 获取 EPOD 列表', async () => {
        const result = await client.epod.list({ page: 1, pageSize: 10, status: 'pending' });
        assert(result.code === 0, `code=0`);
        assert(Array.isArray(result.data?.data), `返回数组`);
        assert(result.data?.total > 0, `total=${result.data?.total}`);
        const found = result.data.data.find(e => e.id === ctx.epodId);
        assert(!!found, `列表中包含刚创建的 EPOD`);
    });
}

// ============ 3. Get EPOD Detail ============
async function step3() {
    await step('3. 获取 EPOD 详情', async () => {
        const result = await client.epod.get(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assert(result.data?.id === ctx.epodId, `id 匹配`);
        assert(result.data?.status === 'pending', `status: ${result.data?.status}`);
        assertExists(result.data?.tracking_no, `tracking_no: ${result.data?.tracking_no}`);
        assertExists(result.data?.recipient_name, `recipient_name: ${result.data?.recipient_name}`);
        console.log(`  📋 recipient: ${result.data?.recipient_name}`);
        console.log(`  📋 delivery_mode: ${result.data?.delivery_mode}`);
    });
}

// ============ 4. Generate Sign URL (merchant) ============
async function step4() {
    await step('4. 生成签署 URL（商户端 epod.generateSignUrl）', async () => {
        const result = await client.epod.generateSignUrl(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assertExists(result.data?.sign_url, `sign_url 存在`);
        ctx.signUrl = result.data.sign_url;
        const url = new URL(result.data.sign_url);
        ctx.signToken = url.pathname.split('/').pop();
        console.log(`  📋 signToken: ${ctx.signToken}`);
        console.log(`  📋 signUrl: ${ctx.signUrl}`);
    });
}

// ============ 5. Public: Get Sign Detail ============
async function step5() {
    await step('5. 公开端：获取签收详情 (GET /open/epod/sign/:token)', async () => {
        const resp = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}`);
        const result = await resp.json();
        if (result.error) {
            console.log(`  ⚠️ 返回错误: ${result.error}`);
            return;
        }
        assert(resp.ok, `HTTP ${resp.status}`);
        assertExists(result.tracking_no, `tracking_no: ${result.tracking_no}`);
        assertExists(result.recipient_name, `recipient: ${result.recipient_name}`);
        assertExists(result.signature_level_required, `signature_level: ${result.signature_level_required}`);
        assertExists(result.allowed_proof_types, `allowed_proofs: ${result.allowed_proof_types?.join(',')}`);
        ctx.policyVersionHash = result.policy_version_hash;
        console.log(`  📋 policyHash: ${ctx.policyVersionHash}`);
    });
}

// ============ 6. Public: Record Consent ============
async function step6() {
    await step('6. 公开端：GDPR 同意 (POST /open/epod/sign/:token/consent)', async () => {
        if (!ctx.policyVersionHash) {
            console.log('  ⚠️ 跳过（无 policyVersionHash）');
            return;
        }
        const resp = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                consent_types: ['delivery', 'signature'],
                policy_version_hash: ctx.policyVersionHash,
            }),
        });
        const result = await resp.json();
        if (!resp.ok) {
            console.log(`  ⚠️ HTTP ${resp.status}: ${result.error || JSON.stringify(result)}`);
            return;
        }
        assert(resp.ok, `HTTP ${resp.status}`);
        assertExists(result.consent_id, `consent_id: ${result.consent_id}`);
        ctx.consentId = result.consent_id;
    });
}

// ============ 7. Public: Capture Signature ============
async function step7() {
    await step('7. 公开端：采集签名 (POST /open/epod/sign/:token/capture)', async () => {
        if (!ctx.consentId) {
            console.log('  ⚠️ 跳过（无 consentId）');
            return;
        }
        const mockSig = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        const resp = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                consent_id: ctx.consentId,
                signature_data: mockSig,
                proof_type: 'signature',
            }),
        });
        const result = await resp.json();
        assert(resp.ok, `HTTP ${resp.status}`);
        assertExists(result.evidence_hash, `evidence_hash: ${result.evidence_hash}`);
        assert(result.status === 'delivered', `status: ${result.status}`);
        console.log(`  📋 hash_locked: ${result.hash_locked}`);
        ctx.evidenceHash = result.evidence_hash;
    });
}

// ============ 8. Get EPOD Detail After Signing ============
async function step8() {
    await step('8. 签署后获取 EPOD 详情（验证状态变更）', async () => {
        const result = await client.epod.get(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assert(result.data?.status === 'delivered', `status: ${result.data?.status}`);
        assertExists(result.data?.signature_data, `signature_data 存在`);
        assertExists(result.data?.document_hash, `document_hash: ${result.data?.document_hash?.substring(0, 16)}...`);
        console.log(`  📋 hash_locked: ${result.data?.hash_locked}`);
    });
}

// ============ 9. Generate PDF ============
async function step9() {
    await step('9. 生成 PDF (epod.generatePdf)', async () => {
        const result = await client.epod.generatePdf(ctx.epodId);
        assert(result.code === 0, `code=0`);
        if (result.data?.pdf_url) {
            ctx.pdfUrl = result.data.pdf_url;
            console.log(`  📋 PDF URL: ${result.data.pdf_url}`);
        } else {
            console.log('  📋 PDF 尚未生成（异步渲染中）');
        }
        console.log(`  📋 pdf_render_status: ${result.data?.pdf_render_status || 'unknown'}`);
    });
}

// ============ 10. Verify EPOD ============
async function step10() {
    await step('10. 验证 EPOD 完整性 (epod.verify)', async () => {
        const result = await client.epod.verify(ctx.epodId);
        assert(result.code === 0, `code=0`);
        assert(typeof result.data?.verified === 'boolean', `verified: ${result.data?.verified}`);
        if (result.data?.error) {
            console.log(`  📋 verify error: ${result.data.error}`);
        }
    });
}

// ============ 11. Update EPOD (whitelist fields) ============
async function step11() {
    await step('11. 更新 EPOD 白名单字段 (epod.update)', async () => {
        const result = await client.epod.update(ctx.epodId, {
            remark: 'E2E test completed',
        });
        assert(result.code === 0, `code=0`);
        console.log(`  📋 更新成功`);
    });
}

// ============ 12. Verify EPOD List Shows Delivered ============
async function step12() {
    await step('12. 列表验证：EPOD 状态为 delivered', async () => {
        const result = await client.epod.list({ page: 1, pageSize: 50, trackingNo: ctx.epodTrackingNo });
        assert(result.code === 0, `code=0`);
        const found = result.data?.data?.find(e => e.id === ctx.epodId);
        assert(!!found, `列表中找到 EPOD`);
        if (found) {
            assert(found.status === 'delivered', `列表中 status: ${found.status}`);
        }
    });
}

// ============ Main ============
async function main() {
    console.log('🚀 EPOD 全链路测试开始');
    console.log(`📍 ${BASE_URL}`);
    console.log(`🔑 ${API_TOKEN.substring(0, 8)}...`);

    const t0 = Date.now();

    await step1();
    await step2();
    await step3();
    await step4();
    await step5();
    await step6();
    await step7();
    await step8();
    await step9();
    await step10();
    await step11();
    await step12();

    const ms = Date.now() - t0;
    console.log('\n' + '='.repeat(50));
    console.log(`📊 结果: ✅ ${passed} 通过 / ❌ ${failed} 失败 / ⏱️ ${ms}ms`);
    console.log('='.repeat(50));

    if (failed > 0) process.exit(1);
}

main();
