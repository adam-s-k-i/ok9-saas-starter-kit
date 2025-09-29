import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
    expect(result).toBe('base-class conditional-class')
  })

  it('handles tailwind conflicts correctly', () => {
    const result = cn('p-4 p-8')
    expect(result).toBe('p-8')
  })

  it('handles empty and undefined values', () => {
    const result = cn('class1', undefined, null, '', 'class2')
    expect(result).toBe('class1 class2')
  })

  it('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })
})