import type { VNodeRender } from './types'

export function render(vnode: VNodeRender, container: HTMLElement): void {
  const { type, children, props } = vnode

  if (typeof type === 'function') {
    const result = type(props)

    render(result, container)
    return
  }

  const element = document.createElement(type)
  if (typeof props?.className === 'string') {
    element.className = props.className
  }

  for (const el of children) {
    if (el === null || el === undefined) {
      continue
    }

    if (typeof el === 'string' || typeof el === 'number') {
      element.appendChild(document.createTextNode(String(el)))
    } else {
      render(el, element)
    }
  }

  container.appendChild(element)

  return
}
