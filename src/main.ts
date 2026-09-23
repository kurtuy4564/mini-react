import { createElement } from './examples/createElement'
import { useEffect, useState } from './examples/hooks'
import { render } from './examples/render'
import './style.css'

const root = document.querySelector<HTMLDivElement>('#app')!
function Counter() {
  const [state, setState] = useState(0)

  useEffect(() => {
    document.title = `Нажато: ${state}`

    return () => {
      document.title = 'Mini React'
    }
  }, [state])

  return createElement(
    'button',
    { onClick: () => setState(previous => previous + 1) },
    'Нажато раз: ',
    state,
  )
}

export const vNode = createElement(
  'div',
  { className: 'app' },

  createElement(Counter),

  // Заголовок страницы
  createElement(
    'header',
    { className: 'app__header' },
    createElement('h1', null, 'Профиль пользователя'),
    createElement('p', { className: 'subtitle' }, 'Демонстрация MiniReact'),
  ),

  // Основная часть
  createElement(
    'main',
    { className: 'app__main' },

    // Пустой блок — render должен его корректно обработать
    createElement('div', { className: 'spacer' }),

    // Числовой ребёнок и null
    createElement('p', { className: 'counter' }, 'Всего карточек: ', 1, null, ' (демо)'),
  ),

  // Подвал
  createElement('footer', { className: 'app__footer' }, '© ', 2025, ' MiniReact'),
)


console.log(vNode)

render(vNode, root)
