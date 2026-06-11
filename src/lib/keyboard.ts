/**
 * Guard for the site's global key handlers (menu w/s/arrow navigation,
 * content focus cycling, focus-area switching in page.tsx).
 *
 * All three handlers listen on `window` and call preventDefault(), so without
 * a guard they swallow keystrokes that were meant for something else — e.g.
 * typing "w" into a future search box would move the menu instead of typing.
 *
 * Return true when the event should be left alone (handlers bail out without
 * preventDefault), false when game-style navigation may claim it.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- stub; remove once implemented
export function shouldIgnoreKeyboardEvent(event: KeyboardEvent): boolean {
  // TODO(human): decide which events game navigation must never intercept.
  // Consider: events targeting editable elements (input / textarea / select /
  // isContentEditable), and events with modifier keys held (metaKey, ctrlKey,
  // altKey) so browser/OS shortcuts like Cmd+ArrowLeft keep working.
  return false;
}
