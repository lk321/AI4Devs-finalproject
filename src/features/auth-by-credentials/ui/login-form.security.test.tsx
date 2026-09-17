import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { LoginForm } from './login-form'

function ssr() {
  return renderToStaticMarkup(<LoginForm action={vi.fn()} />)
}

describe('el formulario de acceso no filtra credenciales antes de hidratar', () => {
  it('declara envio por POST, nunca por GET en la URL', () => {
    expect(ssr()).toContain('method="post"')
  })

  it('no ofrece boton de envio hasta que la pagina esta hidratada', () => {
    const markup = ssr()
    const submit = markup.slice(markup.indexOf('type="submit"'))

    expect(submit.slice(0, submit.indexOf('>'))).toContain('disabled')
  })
})
