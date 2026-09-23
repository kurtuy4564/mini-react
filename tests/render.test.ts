import { describe, expect, it, vi } from 'vitest'
import { createElement } from '../src/mini-react/createElement'
import { render } from '../src/mini-react/render'

function createContainer(): HTMLDivElement {
  return document.createElement('div')
}

describe('render', () => {
  it('создаёт DOM-элемент с текстом и вложенными children', () => {
    const container = createContainer()

    render(
      createElement('section', null, createElement('h1', null, 'Заголовок'), 'Текст'),
      container,
    )

    expect(container.innerHTML).toBe('<section><h1>Заголовок</h1>Текст</section>')
  })

  it('применяет className, value и style', () => {
    const container = createContainer()

    render(
      createElement('input', {
        className: 'search',
        value: 'hello',
        style: { color: 'red' },
      }),
      container,
    )

    const input = container.firstElementChild as HTMLInputElement
    expect(input.className).toBe('search')
    expect(input.value).toBe('hello')
    expect(input.getAttribute('style')).toContain('color: red')
  })

  it('вызывает обработчик события', () => {
    const container = createContainer()
    const onClick = vi.fn()

    render(createElement('button', { onClick }, 'Нажать'), container)
    container.querySelector('button')?.click()

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('обновляет текст при повторном render', () => {
    const container = createContainer()

    render(createElement('p', null, 'До'), container)
    render(createElement('p', null, 'После'), container)

    expect(container.textContent).toBe('После')
  })

})