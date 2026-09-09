import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { projects } from '../data'
import { lightTheme } from '../theme'
import { MilestonesContent, NowPlayingWidget, ProjectDetailContent } from './windows'

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
    expect(screen.getByText(/ReelLab/)).toBeInTheDocument()

    await user.click(screen.getByText('×'))
    expect(onClose).toHaveBeenCalledWith('nowplaying')
  })
})

describe('ProjectDetailContent', () => {
  const kartly = projects.find((p) => p.name === 'Kartly')!

  it('links View Live and Source to the real URLs when a project has them', () => {
    render(<ProjectDetailContent t={lightTheme} project={kartly} onOpenScreenshot={() => {}} />)

    const live = screen.getByText('View Live')
    expect(live.tagName).toBe('A')
    expect(live).toHaveAttribute('href', 'https://stankoo003.github.io/Kartly/')
    expect(live).toHaveAttribute('rel', 'noreferrer')

    expect(screen.getByText('Source')).toHaveAttribute(
      'href',
      'https://github.com/Stankoo003/Kartly',
    )
  })

  it('leaves the buttons disabled for a project with no URLs', () => {
    const ora = projects.find((p) => p.name === 'Ora')!
    expect(ora.live).toBeUndefined()
    render(<ProjectDetailContent t={lightTheme} project={ora} onOpenScreenshot={() => {}} />)

    const live = screen.getByText('View Live')
    expect(live.tagName).toBe('BUTTON')
    expect(live).toBeDisabled()
  })

  it('opens the internal-testing dialog for ReelLab instead of a link', async () => {
    const user = userEvent.setup()
    const reelLab = projects.find((p) => p.name === 'ReelLab')!
    expect(reelLab.live).toBeUndefined()
    render(<ProjectDetailContent t={lightTheme} project={reelLab} onOpenScreenshot={() => {}} />)

    // Nothing is shown until the button is pressed.
    expect(screen.queryByRole('dialog')).toBeNull()

    await user.click(screen.getByText('View Live'))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Available through internal testing')).toBeInTheDocument()
    expect(within(dialog).getByText(/TestFlight/)).toBeInTheDocument()
    expect(within(dialog).getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:aleksastbusiness@gmail.com'),
    )

    await user.click(within(dialog).getByText('Close'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
