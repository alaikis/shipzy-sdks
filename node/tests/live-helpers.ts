import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FIXTURE = join(__dirname, '.live-fixture.json')

export interface LiveFixture {
    available: boolean
    baseUrl: string
    token: string
    epodId: string
    policyHash: string
}

export function getLiveFixture(): LiveFixture | null {
    if (!existsSync(FIXTURE)) return null
    try {
        return JSON.parse(readFileSync(FIXTURE, 'utf8')) as LiveFixture
    } catch {
        return null
    }
}

export const LIVE: LiveFixture = Object.assign(
    { available: false, baseUrl: '', token: '', epodId: '', policyHash: '' },
    getLiveFixture()
)

export const BASE_URL = process.env.ZYMEUP_BASE_URL || LIVE.baseUrl || 'http://127.0.0.1:1417'

/** Returns true when the live backend is not reachable and tests must skip. */
export function skipIfDown(): boolean {
    return !LIVE.available
}

/** A reason string for `.skip()` when the backend is unavailable. */
export const SKIP_REASON = 'Live backend not available (set ZYMEUP_BASE_URL and start the API server)'