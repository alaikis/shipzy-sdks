import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURE = join(__dirname, '.live-fixture.json')
const BASE_URL = process.env.ZYMEUP_BASE_URL || 'http://127.0.0.1:1417'
const TMP = process.env.TEMP || process.env.TMP || 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\kilo'
const GO_TOOL = join(TMP, 'test-epod.exe')
const BACKEND_DIR = 'E:\\workspace\\api.shipzy.me'

// Idempotent: skip creation if the fixture already holds a valid token.
function fixtureValid(): boolean {
    if (!existsSync(FIXTURE)) return false
    try {
        const f = JSON.parse(readFileSync(FIXTURE, 'utf8'))
        return f.available === true && !!f.token
    } catch {
        return false
    }
}

console.error('[setup-live] running (top-level)')

async function healthCheck(): Promise<boolean> {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/config/map-provider?region=EU`, {
            signal: AbortSignal.timeout(5000),
        })
        return res.ok
    } catch {
        return false
    }
}

async function createTestEpod(): Promise<{ token: string; epodId: string }> {
    const out = execSync(`"${GO_TOOL}"`, {
        encoding: 'utf8',
        timeout: 90000,
        cwd: BACKEND_DIR,
        stdio: ['ignore', 'pipe', 'pipe'],
    })
    const tokenMatch = out.match(/token=([A-Za-z0-9_-]+)/)
    const idMatch = out.match(/tracking_id=([A-Za-z0-9_-]+)/)
    return { token: tokenMatch?.[1] || '', epodId: idMatch?.[1] || '' }
}

async function fetchPolicyHash(token: string): Promise<string> {
    try {
        const res = await fetch(`${BASE_URL}/api/v1/open/epod/sign/${token}`, {
            signal: AbortSignal.timeout(10000),
        })
        const d = await res.json()
        return d?.policy_version_hash || ''
    } catch {
        return ''
    }
}

// Top-level await: vitest awaits this module before collecting/importing test
// files, so the fixture exists when describe.skipIf() is evaluated.
await (async function setupLive() {
    if (fixtureValid()) {
        console.error('[setup-live] fixture already valid, skipping creation')
        return
    }
    console.error('[setup-live] healthCheck...')
    if (!(await healthCheck())) {
        console.error('[setup-live] backend DOWN')
        writeFileSync(FIXTURE, JSON.stringify({ available: false, baseUrl: BASE_URL }))
        return
    }
    const { token, epodId } = await createTestEpod()
    const policyHash = token ? await fetchPolicyHash(token) : ''
    console.error(`[setup-live] backend UP token=${token}`)
    writeFileSync(
        FIXTURE,
        JSON.stringify({ available: true, baseUrl: BASE_URL, token, epodId, policyHash })
    )
})()