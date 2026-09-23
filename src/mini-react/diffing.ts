import type { PropsType, VNodeChild, VNode } from './types'
import { mount } from './render'

/**
 * Сравнивает oldVNode и newVNode, обновляет DOM-узел внутри parent.
 *
 * @param parent — родительский DOM-узел (в котором лежит старый узел)
 * @param oldVNode — что было
 * @param newVNode — что стало
 * @param index — позиция узла среди детей parent
 */
export function diffing(
  parent: Node,
  oldVNode: VNodeChild,
  newVNode: VNodeChild,
  index: number,
): void {
  // Ничего не изменилось
  if (oldVNode === newVNode) return

  // Новый пустой → удаляем старый
  if (isEmpty(newVNode)) {
    const node = parent.childNodes[index]
    if (node) parent.removeChild(node)
    return
  }

  // Старого не было → создаём новый
  if (isEmpty(oldVNode)) {
    const newNode = mount(newVNode)
    const ref = parent.childNodes[index] ?? null
    if (ref) parent.insertBefore(newNode, ref)
    else parent.appendChild(newNode)
    return
  }

  // Оба текстовые → меняем nodeValue
  if (isText(oldVNode) && isText(newVNode)) {
    if (oldVNode !== newVNode) {
      const text = parent.childNodes[index]
      if (text) text.nodeValue = String(newVNode)
    }
    return
  }

  // Один текст, другой — VNode → заменяем
  if (isText(oldVNode) !== isText(newVNode)) {
    replaceNode(parent, index, newVNode)
    return
  }

  // Оба VNode
  if (!isVNode(oldVNode) || !isVNode(newVNode)) return

  const oldNode = oldVNode
  const newNode = newVNode

  // Компонент с любой стороны → заменяем (пока без оптимизации)
  if (typeof oldNode.type === 'function' || typeof newNode.type === 'function') {
    replaceNode(parent, index, newNode)
    return
  }

  // Разные теги → заменяем
  if (oldNode.type !== newNode.type) {
    replaceNode(parent, index, newNode)
    return
  }

  // 6c. Тот же тег → обновляем props и детей
  const element = parent.childNodes[index] as HTMLElement | undefined
  if (!element) {
    replaceNode(parent, index, newNode)
    return
  }

  // props
  updateProps(element, oldNode.props, newNode.props)

  // дети — попарно по индексам
  const oldChildren = oldNode.children
  const newChildren = newNode.children
  const len = Math.max(oldChildren.length, newChildren.length)

  for (let i = 0; i < len; i++) {
    diffing(element, oldChildren[i], newChildren[i], i)
  }
}

function isEmpty(v: unknown): boolean {
  return v === null || v === undefined || v === false || v === true
}

function isText(v: unknown): v is string | number {
  return typeof v === 'string' || typeof v === 'number'
}

function isVNode(v: VNodeChild): v is VNode {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function replaceNode(parent: Node, index: number, newVNode: VNodeChild): void {
  const newDom = mount(newVNode)
  const oldDom = parent.childNodes[index]
  if (oldDom) parent.replaceChild(newDom, oldDom)
  else parent.appendChild(newDom)
}

function updateProps(element: HTMLElement, oldProps: PropsType, newProps: PropsType): void {
  const previousProps = oldProps ?? {}
  const nextProps = newProps ?? {}

  // Удаляем то, чего нет в новых
  for (const key of Object.keys(previousProps)) {
    if (key === 'children') {
      continue
    }
    if (key.startsWith('on')) {
      continue
    }
    if (!(key in nextProps)) {
      if (key === 'className') {
        element.className = ''
      } else {
        element.removeAttribute(key)
      }
    }
  }

  // Ставим новые (только изменившиеся)
  for (const [key, value] of Object.entries(nextProps)) {
    if (key === 'children') {
      continue
    }
    if (previousProps[key] === value) {
      continue
    }

    if (value === null || value === undefined || value === false) {
      continue
    }

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
