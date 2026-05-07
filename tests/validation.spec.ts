import { describe, expect, it } from 'vitest'
import { isValidUsername } from '~/types/validation'

describe('isValidUsername', () => {
  it.each([
    ['alice', true],
    ['Bob42', true],
    ['a-b_c', true],
    ['12', true],
    ['a'.repeat(32), true],
  ])('accepts %s', (value, expected) => {
    expect(isValidUsername(value)).toBe(expected)
  })

  it.each([
    ['', false],
    ['a', false],
    ['a'.repeat(33), false],
    ['has space', false],
    ['hello!', false],
    ['email@example.com', false],
    ['☃snowman', false],
  ])('rejects %s', (value, expected) => {
    expect(isValidUsername(value)).toBe(expected)
  })
})
