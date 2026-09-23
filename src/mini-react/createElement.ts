import type { ChildrenType, VNode, VNodeType } from './types'

export function createElement(
  vNodeType: VNodeType,
  props: Record<string, unknown> | null = {},
  ...children: ChildrenType
): VNode {
  return {
    type: vNodeType || 'div',
    props: props ?? {},
    children: flatten(children),
  }
}

function flatten(children: ChildrenType): ChildrenType {
  const result: ChildrenType = []
  for (const child of children) {
    if (Array.isArray(child)) {
      result.push(...flatten(child))
    } else {
      result.push(child)
    }
  }
  return result
}
