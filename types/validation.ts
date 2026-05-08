export const USERNAME_RE = /^[a-z0-9_-]{2,32}$/i

export function isValidUsername(value: string): boolean {
  return USERNAME_RE.test(value)
}
