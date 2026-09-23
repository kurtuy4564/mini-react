export type PropsType = Record<string, unknown> | null
export type Component = (props: PropsType) => VNodeRender
export type VNodeType = string | Component
export type VNodeChild =
  | VNodeRender
  | string
  | number
  | boolean
  | null
  | undefined
  | VNodeChild[]
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
