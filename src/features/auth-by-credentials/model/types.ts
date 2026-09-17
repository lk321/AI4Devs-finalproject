export type AuthActionResult = { error: string } | void

export type SignInAction = (
  input: { email: string; password: string },
  next?: string,
) => Promise<AuthActionResult>

export type SignUpAction = (input: {
  email: string
  password: string
  alias: string
  city: string
}) => Promise<AuthActionResult>
