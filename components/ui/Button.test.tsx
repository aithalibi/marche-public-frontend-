import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders its content and calls the click handler', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<Button onClick={handleClick}>Envoyer</Button>)

    await user.click(screen.getByRole('button', { name: 'Envoyer' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled while loading', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(
      <Button loading onClick={handleClick}>
        Enregistrer
      </Button>
    )

    const button = screen.getByRole('button', { name: 'Enregistrer' })

    expect(button).toBeDisabled()
    await user.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })
})
