import { describe, it, expect } from 'vitest'
import { createElement } from '../src/mini-react/createElement'

describe('createElement', () => {
  it('создаёт VNode с указанным типом', () => {
    const vnode = createElement('div', null)
    expect(vnode.type).toBe('div')
  })

  it('сохраняет props и children', () => {
    const vnode = createElement('button', { className: 'primary' }, 'Нажать')

    expect(vnode.props).toEqual({ className: 'primary' })
    expect(vnode.children).toEqual(['Нажать'])
  })

  it('расплющивает вложенные массивы children', () => {
    const vnode = createElement('div', null, ['Первый', ['Второй']])

    expect(vnode.children).toEqual(['Первый', 'Второй'])
  })

  it('заменяет null в props на пустой объект', () => {
    expect(createElement('div', null).props).toEqual({})
  })
})
