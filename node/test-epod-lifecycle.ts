/**
 * EPOD 全链路测试 — Node SDK（仅服务端，不含 RN）
 */

import { ShipzyClient } from './dist/index';

// ============ 配置 ============

const BASE_URL = process.env.SHIPZY_BASE_URL || 'http://127.0.0.1:1417';
const API_TOKEN = process.env.SHIPZY_API_TOKEN || '';

if (!API_TOKEN) {
    console.error('❌ 请设置环境变量 SHIPZY_API_TOKEN');
    console.error('   示例: SHIPZY_API_TOKEN=your_token npx tsx test-epod-lifecycle.ts');
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
        failed++;
    }
}

// ============ 测试上下文 ============

interface TestContext {
    orderId?: string;
    epodId?: string;
    signUrl?: string;
    evidenceHash?: string;
}

const ctx: TestContext = {};

// ============ 测试用例 ============

async function testCreateOrderWithDocuments() {
    await step('1. 创建订单 + 自动生成 EPOD', async () => {
        try {
            const result = await client.order.createWithDocuments({
                order: {
                    order_no: `TEST-${Date.now()}`,
                    recipient_name: 'Test Recipient',
                    recipient_phone: '+31612345678',
                    delivery_address: {
                        full_name: 'Test Recipient',
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
        } catch (err: any) {
            // Try to get more details from the error
            if (err.data) {
                console.log(`  📋 错误详情: ${JSON.stringify(err.data)}`);
            }
            throw err;
        }
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

        // Store the first EPOD ID for subsequent tests
        if (result.data.data.length > 0 && !ctx.epodId) {
            ctx.epodId = result.data.data[0].id;
            console.log(`  📋 使用已有 EPOD: ${ctx.epodId}`);
        }
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
    await step('4. 生成签署 URL', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.generateSignUrl(ctx.epodId);

        assert(result.code === 0, `响应 code = ${result.code}`);
        assertNotNil(result.data.sign_url, `签署 URL: ${result.data.sign_url}`);

        ctx.signUrl = result.data.sign_url;
        assert(result.data.sign_url.includes('https://'), '签署 URL 为 HTTPS');
    });
}

async function testCaptureProof() {
    await step('5. 采集签名证据', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.captureProof(ctx.epodId, {
            signature_data: 'base64-encoded-test-signature',
            proof_type: 'signature',
        });

        assert(result.code === 0, `响应 code = ${result.code}`);
        assertNotNil(result.data.document_hash, `文档哈希: ${result.data.document_hash}`);
        assert(result.data.hash_locked === true, '哈希已锁定');

        ctx.evidenceHash = result.data.document_hash;
    });
}

async function testGetPdfStatus() {
    await step('6. 获取 PDF 状态', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.generatePdf(ctx.epodId);

        assert(result.code === 0, `响应 code = ${result.code}`);
        assert(
            ['none', 'pending', 'ready', 'failed'].includes(result.data.status || ''),
            `PDF 状态有效: ${result.data.status}`
        );

        if (result.data.status === 'ready') {
            assertNotNil(result.data.pdf_url, `PDF URL: ${result.data.pdf_url}`);
        }
    });
}

async function testMarkDelivered() {
    await step('7. 标记送达', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.deliver(ctx.epodId, {
            delivery_date: new Date().toISOString().split('T')[0],
            remark: 'Test delivery',
        });

        assert(result.code === 0, `响应 code = ${result.code}`);
        assert(result.data.status === 'delivered', `状态已更新为: ${result.data.status}`);
    });
}

async function testVerifyEpod() {
    await step('8. 验证 EPOD', async () => {
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
    await step('9. 更新 EPOD（白名单字段）', async () => {
        if (!ctx.epodId) {
            console.log('  ⚠️ 跳过（无 epodId）');
            return;
        }

        const result = await client.epod.update(ctx.epodId, {
            remark: 'Updated remark',
        });

        assert(result.code === 0, `响应 code = ${result.code}`);
    });
}

// ============ 主函数 ============

async function main() {
    console.log('🚀 EPOD 全链路测试开始');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`🔑 Token: ${API_TOKEN.substring(0, 8)}...`);

    const startTime = Date.now();

    try {
        await testCreateOrderWithDocuments();
        await testGetEpodList();
        await testGetEpodDetail();
        await testGenerateSignUrl();
        await testCaptureProof();
        await testGetPdfStatus();
        await testMarkDelivered();
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
