import { diffing } from './diffing'
import { cleanupEffects, finishHooksRender, setRerender, startHooksRender } from './hooks'
import type { PropsType, VNode, VNodeChild } from './types'

let vNodePrev: VNode | null = null
let rootRender: (() => VNode) | null = null

export function render(vNode: VNode | (() => VNode) | null, container: HTMLElement): void {
  if (vNode === null) {
    cleanupEffects()
    container.innerHTML = ''
    vNodePrev = null
    rootRender = null
    return
  }

  startHooksRender()
  rootRender = typeof vNode === 'function' ? vNode : () => vNode
  const nextVNode = rootRender()

  if (vNodePrev === null) {
    // первый рендер
    container.innerHTML = ''
    container.appendChild(mount(nextVNode))
  } else {
    // обновление
    diffing(container, vNodePrev, nextVNode, 0)
  }
  vNodePrev = nextVNode

  setRerender(() => {
    vNodePrev = null
    render(rootRender, container)
  })
  finishHooksRender()
}

export function unmount(container: HTMLElement): void {
  render(null, container)
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

    if (key === 'style' && typeof value === 'object' && value !== null) {
      Object.assign(element.style, value)
      continue
    }

    if (key === 'value' && 'value' in element) {
      element.value = String(value)
      continue
    }

    element.setAttribute(key, String(value))
  }
}
