export type VNodeType = string | Function
export type PropsType = Record<string, unknown> | null
export type ChildrenType = Array<VNode | string | number | null | undefined >


export type VNode = {
  type: VNodeType
  props: PropsType
  children: ChildrenType
}

export type VNodeRender = {
  type: VNodeType
  props: PropsType
  children: Array<VNodeRender | string | number | null | undefined>
}
