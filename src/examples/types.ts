export type VNodeType = string | Function
export type PropsType = Record<string, unknown> | null
export type VNodeChild = VNodeRender | string | number | boolean | null | undefined
export type ChildrenType = VNodeChild[]


export type VNode = {
  type: VNodeType
  props: PropsType
  children: ChildrenType
}

export type VNodeRender = {
  type: VNodeType
  props: PropsType
  children: ChildrenType
}
