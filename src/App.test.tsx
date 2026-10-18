import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('Phase 2 and 3 application flow', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  it('navigates from the home page to practice setup', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Start practice' }))

    expect(
      screen.getByRole('heading', { name: 'Set up your practice' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Practice' })).toHaveClass(
      'nav-link--active',
    )
  })

  it('requires a complete setup and passes it to the practice route', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Start practice' }))
    const startButton = screen.getByRole('button', { name: 'Start practice' })
    expect(startButton).toBeDisabled()

    await user.click(screen.getByLabelText('Addition'))
    await user.click(screen.getByLabelText(/Level 2: Easy/))
    await user.click(screen.getByLabelText('5 questions'))

    expect(startButton).toBeEnabled()
    await user.click(startButton)

    expect(
      screen.getByRole('heading', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: 'Question 1 of 5' }),
    ).toBeInTheDocument()
  })
})
