type StateUpdater<T> = T | ((previousState: T) => T)

const hooks: unknown[] = []
let hookIndex = 0
let rerender: (() => void) | null = null

export function useState<T>(initialValue: T): [T, (nextState: StateUpdater<T>) => void] {
  const currentIndex = hookIndex

  if (currentIndex >= hooks.length) {
    hooks[currentIndex] = initialValue
  }

  hookIndex += 1

  function setState(nextState: StateUpdater<T>): void {
    const previousState = hooks[currentIndex] as T
    hooks[currentIndex] =
      typeof nextState === 'function'
        ? (nextState as (previousState: T) => T)(previousState)
        : nextState

    rerender?.()
  }

  return [hooks[currentIndex] as T, setState]
}

export function startHooksRender(): void {
  hookIndex = 0
}

export function setRerender(callback: () => void): void {
  rerender = callback
}
