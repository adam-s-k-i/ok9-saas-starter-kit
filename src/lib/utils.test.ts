import { cn } from './utils'

describe('cn utility function', () => {
  test('merges class names correctly', () => {
    const result = cn('class1', 'class2')
    expect(result).toBe('class1 class2')
  })

  test('handles conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
    expect(result).toBe('base-class conditional-class')
  })

  test('handles tailwind conflicts correctly', () => {
    const result = cn('p-4 p-8')
    expect(result).toBe('p-8')
  })

  test('handles empty and undefined values', () => {
    const result = cn('class1', undefined, null, '', 'class2')
    expect(result).toBe('class1 class2')
  })

  test('handles arrays of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })
})