import { globalSetup } from 'vitest/config'
import { execSync } from 'child_process'
import { join } from 'path'

const TMP = process.env.TEMP || process.env.TMP || 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\kilo'
const CLEANUP_TOOL = join(TMP, 'cleanup-test-epod.exe')
const BACKEND_DIR = 'E:\\workspace\\api.shipzy.me'

function cleanup() {
    try {
        execSync(`"${CLEANUP_TOOL}"`, {
            encoding: 'utf8',
            timeout: 90000,
            cwd: BACKEND_DIR,
            stdio: ['ignore', 'pipe', 'pipe'],
        })
    } catch {
        // best-effort cleanup
    }
}

// Global teardown: remove the test EPODs created during the run.
export default function globalSetup() {
    return async () => {
        return async () => {
            cleanup()
        }
    }
}