function chatField(): HTMLTextAreaElement | null {
  return document.querySelector('.chat-input textarea')
}

export function lockChat(): void {
  const ta = chatField()
  if (ta) {
    ta.blur()
    ta.setAttribute('readonly', 'readonly')
    ta.setAttribute('disabled', 'disabled')
  }
  const active = document.activeElement as HTMLElement | null
  if (active && typeof active.blur === 'function') active.blur()
}

export function unlockChat(): void {
  const ta = chatField()
  if (ta) {
    ta.removeAttribute('readonly')
    ta.removeAttribute('disabled')
  }
}
