import { createElement } from './examples/createElement'
import { render } from './examples/render';
import './style.css'

// const element = createElement(
//   'div',
//   { className: 'card' },
//   createElement('h1', null, 'Заголовок'),
//   createElement('p', null, 'Текст'),
// )

export const element = createElement(
  'div',
  { className: 'app' },

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


console.log(element);

render(element, document.querySelector<HTMLDivElement>('#app')!)

