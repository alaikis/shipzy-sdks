import { describe, expect, it } from 'vitest'
import { VERSION } from '../src/index'

describe('VERSION', () => {
  it('exports the current pre-release version', () => {
    expect(VERSION).toBe('0.1.0-alpha.1')
  })
})
