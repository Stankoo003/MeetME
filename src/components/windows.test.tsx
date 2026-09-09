import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { lightTheme } from '../theme'
import { MilestonesContent, NowPlayingWidget } from './windows'

describe('MilestonesContent', () => {
  it('renders the internship on the timeline', () => {
    render(<MilestonesContent t={lightTheme} />)
    expect(screen.getByText('Ing Internship')).toBeInTheDocument()
    expect(screen.getByText('Jul–Sep 2026')).toBeInTheDocument()
  })
})

describe('NowPlayingWidget', () => {
  it('shows the current role and fires onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <NowPlayingWidget
        positionStyle={{}}
        onFocus={() => {}}
        onClose={onClose}
        onDragStart={() => {}}
      />,
    )

    expect(screen.getByText('IngSoftware Internship')).toBeInTheDocument()
    expect(screen.getByText(/AI-Powered Full Stack/)).toBeInTheDocument()

    await user.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalledWith('nowplaying')
  })
})
