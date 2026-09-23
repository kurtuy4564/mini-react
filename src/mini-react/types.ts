export type PropsType = Record<string, unknown> | null
export type Component = (props: PropsType) => VNode
export type VNodeType = string | Component
export type VNodeChild = VNode | string | number | boolean | null | undefined | VNodeChild[]
export type ChildrenType = VNodeChild[]

export type VNode = {
  type: VNodeType
  props: PropsType
  children: ChildrenType
}
