import { afterEach, describe, expect, it, vi } from 'vitest'
import { createElement } from '../src/mini-react/createElement'
import { useEffect, useState } from '../src/mini-react/hooks'
import { render, unmount } from '../src/mini-react/render'

function createContainer(): HTMLDivElement {
  return document.createElement('div')
}

function nextTick(): Promise<void> {
  return new Promise(resolve => queueMicrotask(resolve))
}

afterEach(() => {
  // Каждый тест получает чистый контейнер и очищает зарегистрированные эффекты.
  const container = document.createElement('div')
  unmount(container)
})

describe('useState', () => {
  it('сохраняет состояние и обновляет интерфейс', () => {
    const container = createContainer()
    let setCount: ((value: number | ((previous: number) => number)) => void) | undefined

    function Counter() {
      const [count, updateCount] = useState(0)
      setCount = updateCount
      return createElement('button', null, count)
    }

    render(Counter, container)
    setCount?.(previous => previous + 1)

    expect(container.textContent).toBe('1')
  })

  it('поддерживает несколько состояний', () => {
    const container = createContainer()
    let updateFirst: ((value: string) => void) | undefined
    let updateSecond: ((value: number) => void) | undefined

    function Component() {
      const [first, setFirst] = useState('a')
      const [second, setSecond] = useState(1)
      updateFirst = setFirst
      updateSecond = setSecond
      return createElement('p', null, first, second)
    }

    render(Component, container)
    updateFirst?.('b')
    updateSecond?.(2)

    expect(container.textContent).toBe('b2')
  })
})

describe('useEffect', () => {
  it('запускается после render', async () => {
    const container = createContainer()
    const effect = vi.fn()

    render(createElement(() => {
      useEffect(effect, [])
      return createElement('p', null, 'Готово')
    }), container)

    expect(effect).not.toHaveBeenCalled()
    await nextTick()
    expect(effect).toHaveBeenCalledOnce()
  })

  it('не перезапускается с пустыми зависимостями', async () => {
    const container = createContainer()
    const effect = vi.fn()
    let update: ((value: number) => void) | undefined

    function Component() {
      const [count, setCount] = useState(0)
      update = setCount
      useEffect(effect, [])
      return createElement('p', null, count)
    }

    render(Component, container)
    await nextTick()
    update?.(1)
    await nextTick()

    expect(effect).toHaveBeenCalledOnce()
  })

  it('вызывает cleanup перед новым эффектом и при unmount', async () => {
    const container = createContainer()
    const cleanup = vi.fn()
    let update: ((value: number) => void) | undefined

    function Component() {
      const [count, setCount] = useState(0)
      update = setCount
      useEffect(() => cleanup, [count])
      return createElement('p', null, count)
    }

    render(Component, container)
    await nextTick()
    update?.(1)
    await nextTick()
    expect(cleanup).toHaveBeenCalledOnce()

    unmount(container)
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})