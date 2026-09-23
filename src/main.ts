import { createElement } from './examples/createElement'
import { useEffect, useState } from './examples/hooks'
import { render } from './examples/render'
import './style.css'

const root = document.querySelector<HTMLDivElement>('#app')!

function Counter() {
  const [state, setState] = useState(0)

  return createElement(
    'section',
    { className: 'demo-card' },
    createElement('h2', null, 'Counter'),
    createElement('p', null, 'Значение: ', state),
    createElement(
      'div',
      { className: 'button-row' },
      createElement('button', { onClick: () => setState(previous => previous - 1) }, '−'),
      createElement('button', { onClick: () => setState(previous => previous + 1) }, '+'),
    ),
  )
}

function Greeting(props: Record<string, unknown>) {
  return createElement('section', { className: 'demo-card' }, createElement('h2', null, 'Greeting'), createElement('p', null, 'Привет, ', String(props.name), '!'))
}

function TodoList() {
  const [todos, setTodos] = useState(['Изучить useState'])
  const [input, setInput] = useState('')

  function addTodo() {
    const title = input.trim()
    if (!title) return
    setTodos(previous => [...previous, title])
    setInput('')
  }

  return createElement(
    'section',
    { className: 'demo-card' },
    createElement('h2', null, 'TodoList'),
    createElement(
      'div',
      { className: 'input-row' },
      createElement('input', {
        value: input,
        placeholder: 'Новая задача',
        onInput: (event: Event) => setInput((event.target as HTMLInputElement).value),
      }),
      createElement('button', { onClick: addTodo }, 'Добавить'),
    ),
    createElement(
      'ul',
      null,
      ...todos.map((todo, index) =>
        createElement(
          'li',
          { className: 'todo-item' },
          todo,
          createElement('button', { onClick: () => setTodos(previous => previous.filter((_, i) => i !== index)) }, 'Удалить'),
        ),
      ),
    ),
  )
}

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setSeconds(previous => previous + 1), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return createElement('section', { className: 'demo-card' }, createElement('h2', null, 'Timer'), createElement('p', null, 'Прошло секунд: ', seconds))
}

function ShowHide() {
  const [visible, setVisible] = useState(true)

  return createElement(
    'section',
    { className: 'demo-card' },
    createElement('h2', null, 'ShowHide'),
    createElement('button', { onClick: () => setVisible(previous => !previous) }, visible ? 'Скрыть' : 'Показать'),
    visible ? createElement('p', null, 'Этот текст можно скрыть.') : null,
  )
}

function App() {
  return createElement(
    'div',
    { className: 'app' },
    createElement('header', { className: 'app__header' }, createElement('h1', null, 'Mini React'), createElement('p', { className: 'subtitle' }, 'Демонстрация компонентов и хуков')),
    createElement('main', { className: 'demo-grid' },
      createElement(Counter),
      createElement(Greeting, { name: 'разработчик' }),
      createElement(TodoList),
      createElement(Timer),
      createElement(ShowHide),
    ),
  )
}

render(App, root)
