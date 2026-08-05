import { describe, expect, it } from 'vitest'
import { VERSION } from '../src/index'

describe('VERSION', () => {
  it('exports the current version', () => {
    expect(VERSION).toBe('2.1.1')
  })
})
