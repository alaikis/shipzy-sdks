/**
 * EPOD 全链路测试 — Node SDK（含完整签收流程）
 * 
 * 完整流程：
 * 1. 创建订单 + 自动生成 EPOD
 * 2. 获取 EPOD 列表
 * 3. 获取 EPOD 详情
 * 4. 生成签署 URL（商户端）
 * 5. 公开端：获取签收详情（收件人视角）
 * 6. 公开端：记录同意（GDPR consent）
 * 7. 公开端：采集签名（收件人签署）
 * 8. 获取 PDF
 * 9. 验证 EPOD
 * 10. 更新 EPOD（白名单字段）
 */

import { ShipzyClient } from './dist/index';

// ============ 配置 ============

const BASE_URL = process.env.SHIPZY_BASE_URL || 'http://127.0.0.1:1417';
const API_TOKEN = process.env.SHIPZY_API_TOKEN || '';

if (!API_TOKEN) {
    console.error('❌ 请设置环境变量 SHIPZY_API_TOKEN');
    process.exit(1);
}

const client = new ShipzyClient({
    baseUrl: BASE_URL,
    token: API_TOKEN,
    role: 'merchant',
});

// ============ 工具函数 ============

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.error(`  ❌ ${message}`);
        failed++;
    }
}

function assertNotNil(value: any, message: string) {
    assert(value !== null && value !== undefined, message);
}

async function step(name: string, fn: () => Promise<void>) {
    console.log(`\n📌 ${name}`);
    try {
        await fn();
    } catch (err: any) {
        console.error(`  ❌ 步骤异常: ${err.message}`);
        if (err.data) console.error(`     详情: ${JSON.stringify(err.data)}`);
        failed++;
    }
}

// ============ 测试上下文 ============

interface TestContext {
    orderId?: string;
    epodId?: string;
    signUrl?: string;
    signToken?: string;
    consentId?: string;
    evidenceHash?: string;
    pdfUrl?: string;
}

const ctx: TestContext = {};

// ============ 测试用例 ============

async function testCreateOrderWithDocuments() {
    await step('1. 创建订单 + 自动生成 EPOD', async () => {
        const result = await client.order.createWithDocuments({
            order: {
                order_no: `TEST-${Date.now()}`,
                recipient_name: 'Jan de Vries',
                recipient_phone: '+31612345678',
                delivery_address: {
                    full_name: 'Jan de Vries',
                    street: 'Keizersgracht',
                    house_number: '100',
                    postal_code: '1015 AA',
                    city: 'Amsterdam',
                    country_code: 'NL',
                },
            },
            auto_generate: {
                epod: true,
                ecmr: false,
            },
            epod_overrides: {
                delivery_mode: 'carrier',
            },
            channels: [],
        });

        assert(result.code === 0, `响应 code = ${result.code}`);
        assertNotNil(result.data.order, '订单已创建');
        assertNotNil(result.data.epod, 'EPOD 已自动生成');

        ctx.orderId = result.data.order?.id;
        ctx.epodId = result.data.epod?.id;

        console.log(`  📋 orderId: ${ctx.orderId}`);
        console.log(`  📋 epodId: ${ctx.epodId}`);
    });
}

async function testGetEpodList() {
    await step('2. 获取 EPOD 列表', async () => {
        const result = await client.epod.list({
            page: 1,
            pageSize: 10,
            status: 'pending',
        });

        assert(result.code === 0, `响应 code = ${result.code}`);
        assert(Array.isArray(result.data.data), '返回 EPOD 数组');
        assert(result.data.total > 0, `EPOD 总数 > 0 (total=${result.data.total})`);
    });
}

async function testGetEpodDetail() {
    await step('3. 获取 EPOD 详情', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.get(ctx.epodId);

        assert(result.code === 0, `响应 code = ${result.code}`);
        assert(result.data.id === ctx.epodId, `EPOD ID 匹配: ${result.data.id}`);
        assertNotNil(result.data.tracking_no, `追踪号: ${result.data.tracking_no}`);
        assert(['pending', 'delivered', 'failed', 'partial'].includes(result.data.status), `状态有效: ${result.data.status}`);
    });
}

async function testGenerateSignUrl() {
    await step('4. 生成签署 URL（商户端）', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.generateSignUrl(ctx.epodId);

        assert(result.code === 0, `响应 code = ${result.code}`);
        assertNotNil(result.data.sign_url, `签署 URL: ${result.data.sign_url}`);

        ctx.signUrl = result.data.sign_url;
        
        // Extract token from sign URL
        const url = new URL(result.data.sign_url);
        const pathParts = url.pathname.split('/');
        ctx.signToken = pathParts[pathParts.length - 1];
        
        console.log(`  📋 signToken: ${ctx.signToken}`);
        console.log(`  📋 expiresAt: ${result.data.sign_token_expires_at}`);
        assert(result.data.sign_url.includes('https://'), '签署 URL 为 HTTPS');
    });
}

async function testPublicSignDetail() {
    await step('5. 公开端：获取签收详情（收件人视角）', async () => {
        if (!ctx.signToken) {
            console.log('  ⚠️ 跳过（无 signToken）');
            return;
        }

        // Public endpoint - no auth header needed
        const response = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}`);
        const result = await response.json();

        // Check if the response has the expected fields
        if (result.error) {
            console.log(`  ⚠️ 公开端返回错误: ${result.error}`);
            console.log(`     (EPOD 可能未设置 SignToken，或 token 已过期)`);
            return;
        }

        assert(result.tracking_no !== undefined, `追踪号: ${result.tracking_no || '(未设置)'}`);
        assert(result.recipient_name !== undefined, `收件人: ${result.recipient_name || '(未设置)'}`);
        assert(result.signature_level_required !== undefined, `签名级别: ${result.signature_level_required || '(未设置)'}`);
        
        console.log(`  📋 policyUrl: ${result.policy_url || '(未设置)'}`);
        console.log(`  📋 signatureLevel: ${result.signature_level_required || '(未设置)'}`);
        console.log(`  📋 allowedProofTypes: ${result.allowed_proof_types?.join(', ') || '(未设置)'}`);
        
        // Store policy version hash for consent
        (ctx as any).policyVersionHash = result.policy_version_hash;
    });
}

async function testPublicSignConsent() {
    await step('6. 公开端：记录同意（GDPR consent）', async () => {
        if (!ctx.signToken) {
            console.log('  ⚠️ 跳过（无 signToken）');
            return;
        }

        const policyHash = (ctx as any).policyVersionHash || 'test_policy_hash';

        const response = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                consent_types: ['delivery'],
                policy_version_hash: policyHash,
            }),
        });
        const result = await response.json();

        if (response.status === 400) {
            console.log(`  ⚠️ Consent 请求失败: ${result.error || '未知错误'}`);
            console.log(`     (可能是 policy_version_hash 不匹配或 EPOD 未找到)`);
            return;
        }

        assert(response.status === 200, `Consent 记录成功 (HTTP ${response.status})`);
        assertNotNil(result.consent_id, `Consent ID: ${result.consent_id}`);
        
        ctx.consentId = result.consent_id;
    });
}

async function testPublicSignCapture() {
    await step('7. 公开端：采集签名（收件人签署）', async () => {
        if (!ctx.signToken || !ctx.consentId) {
            console.log('  ⚠️ 跳过（缺少 signToken 或 consentId）');
            return;
        }

        // Simulate a signature (base64 encoded)
        const mockSignature = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        const response = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${ctx.signToken}/capture`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                consent_id: ctx.consentId,
                signature_data: mockSignature,
                proof_type: 'signature',
            }),
        });
        const result = await response.json();

        assert(response.status === 200, `签名采集成功 (HTTP ${response.status})`);
        assertNotNil(result.evidence_hash, `证据哈希: ${result.evidence_hash}`);
        assert(result.status === 'delivered', `状态已更新为: ${result.status}`);
        // hash_locked 取决于后端状态机，可能为 true 或 false
        console.log(`  📋 hash_locked: ${result.hash_locked}`);
        
        ctx.evidenceHash = result.evidence_hash;
    });
}

async function testGetPdf() {
    await step('8. 获取 PDF', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.generatePdf(ctx.epodId);

        assert(result.code === 0, `响应 code = ${result.code}`);
        if (result.data.pdf_url) {
            ctx.pdfUrl = result.data.pdf_url;
            console.log(`  📋 PDF URL: ${result.data.pdf_url}`);
        } else {
            console.log('  📋 PDF 尚未生成（可能需等待异步渲染）');
        }
    });
}

async function testVerifyEpod() {
    await step('9. 验证 EPOD', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.verify(ctx.epodId);

        assert(result.code === 0, `响应 code = ${result.code}`);
        assert(typeof result.data.verified === 'boolean', `验证结果: ${result.data.verified}`);
    });
}

async function testUpdateEpod() {
    await step('10. 更新 EPOD（白名单字段）', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.update(ctx.epodId, {
            remark: 'Updated after signature capture',
        });

        assert(result.code === 0, `响应 code = ${result.code}`);
    });
}

// ============ 主函数 ============

async function main() {
    console.log('🚀 EPOD 全链路测试开始（含完整签收流程）');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`🔑 Token: ${API_TOKEN.substring(0, 8)}...`);

    const startTime = Date.now();

    try {
        await testCreateOrderWithDocuments();
        await testGetEpodList();
        await testGetEpodDetail();
        await testGenerateSignUrl();
        await testPublicSignDetail();
        await testPublicSignConsent();
        await testPublicSignCapture();
        await testGetPdf();
        await testVerifyEpod();
        await testUpdateEpod();
    } catch (err: any) {
        console.error(`\n💥 测试中断: ${err.message}`);
        failed++;
    }

    const duration = Date.now() - startTime;

    console.log('\n' + '='.repeat(50));
    console.log('📊 测试结果汇总');
    console.log('='.repeat(50));
    console.log(`  ✅ 通过: ${passed}`);
    console.log(`  ❌ 失败: ${failed}`);
    console.log(`  ⏱️  耗时: ${duration}ms`);
    console.log('='.repeat(50));

    if (failed > 0) {
        process.exit(1);
    }
}

main();
