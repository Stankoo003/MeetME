import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

/**
 * Smoke tests: does the desktop shell actually come up and respond to the two
 * interactions everything else is built on — unlocking, and opening a window
 * from the dock. These are deliberately shallow; their job is to fail loudly
 * when the app stops booting at all.
 */

/** The app boots behind a fake lock screen; get past it into the desktop. */
async function unlock(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('Enter password'), 'admin{Enter}')
  await waitFor(() => expect(screen.queryByPlaceholderText('Enter password')).toBeNull(), {
    timeout: 2000,
  })
}

describe('App', () => {
  it('mounts and renders the lock screen first', () => {
    const { container } = render(<App />)
    expect(container).not.toBeEmptyDOMElement()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('unlocks with the password and shows the dock', async () => {
    const user = userEvent.setup()
    render(<App />)
    await unlock(user)

    expect(screen.getByTitle('About Me')).toBeInTheDocument()
    expect(screen.getByTitle('Projects')).toBeInTheDocument()
    expect(screen.getByTitle('Now Playing')).toBeInTheDocument()
  })

  it('renders the owner name and profile image with a base-aware src', async () => {
    const user = userEvent.setup()
    render(<App />)
    await unlock(user)

    expect(screen.getAllByText('Aleksa Stanković').length).toBeGreaterThan(0)
    const avatar = screen.getByAltText('Aleksa Stanković') as HTMLImageElement
    // Must carry the deploy base prefix, never a bare "/profile.jpg".
    expect(avatar.getAttribute('src')).toBe(`${import.meta.env.BASE_URL}profile.jpg`)
  })

  it('closes and reopens the Now Playing widget from the dock', async () => {
    const user = userEvent.setup()
    render(<App />)
    await unlock(user)

    // Open by default. Closed windows stay mounted and are hidden with
    // display:none (see winStyle in App.tsx), so assert on visibility.
    const widget = document.querySelector('[data-app="nowplaying"]') as HTMLElement
    expect(widget).toBeVisible()
    expect(within(widget).getByText('NOW PLAYING')).toBeInTheDocument()
    expect(within(widget).getByText('IngSoftware Internship')).toBeInTheDocument()

    await user.click(within(widget).getByText('×'))
    await waitFor(() => expect(widget).not.toBeVisible())

    await user.click(screen.getByTitle('Now Playing'))
    await waitFor(() => expect(widget).toBeVisible())
  })
})
