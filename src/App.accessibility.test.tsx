import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { axe } from 'vitest-axe'
import App from './App'

describe('application accessibility', () => {
  beforeEach(() => window.history.pushState({}, '', '/'))

  it('has no automated accessibility violations on the home page', async () => {
    const { container } = render(<App />)

    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(results.violations).toHaveLength(0)
  })
})
