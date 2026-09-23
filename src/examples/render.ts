// src/mini-react/render.ts
import { diffing } from './diffing'
import type { PropsType, VNodeChild, VNodeRender } from './types'

let vNodePrev: VNodeRender | null = null

export function render(vNode: VNodeRender, container: HTMLElement): void {
  if (vNodePrev === null) {
    // первый рендер
    container.innerHTML = ''
    container.appendChild(mount(vNode))
  } else {
    // обновление
    diffing(container, vNodePrev, vNode, 0)
  }
  vNodePrev = vNode
}

export function mount(vnode: VNodeChild): Node {
  // Пустое — вернём пустой текстовый узел
  if (vnode === null || vnode === undefined || vnode === false || vnode === true) {
    return document.createTextNode('')
  }

  // Текст / число
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode))
  }

  // Массив
  if (Array.isArray(vnode)) {
    const fragment = document.createDocumentFragment()
    for (const child of vnode) {
      fragment.appendChild(mount(child))
    }
    return fragment
  }

  const { type, props, children } = vnode

  // Компонент
  if (typeof type === 'function') {
    return mount(type(props))
  }

  // HTML-элемент
  const element = document.createElement(type)
  applyProps(element, props)

  for (const child of children) {
    element.appendChild(mount(child))
  }

  return element
}

function applyProps(element: HTMLElement, props: PropsType) {
  if (!props) return
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue

    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase()
      element.addEventListener(eventName, value as EventListener)
      continue
    }

    if (key === 'className') {
      element.className = String(value)
      continue
    }

    element.setAttribute(key, String(value))
  }
}
