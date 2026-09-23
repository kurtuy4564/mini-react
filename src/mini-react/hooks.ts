type StateUpdater<T> = T | ((previousState: T) => T)
type EffectCleanup = () => void
type EffectCallback = () => void | EffectCleanup
type EffectSlot = {
  callback: EffectCallback
  dependencies?: unknown[]
  cleanup?: EffectCleanup
}

const hooks: unknown[] = []
const effects: Array<EffectSlot | undefined> = []
let hookIndex = 0
let rerender: (() => void) | null = null
let effectsToRun: EffectSlot[] = []
let effectsVersion = 0

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

export function useEffect(callback: EffectCallback, dependencies?: unknown[]): void {
  const currentIndex = hookIndex
  const previousEffect = effects[currentIndex]
  const dependenciesChanged =
    previousEffect === undefined ||
    dependencies === undefined ||
    previousEffect.dependencies === undefined ||
    dependencies.length !== previousEffect.dependencies.length ||
    dependencies.some((dependency, index) => dependency !== previousEffect.dependencies?.[index])

  if (dependenciesChanged) {
    const effect = previousEffect ?? { callback }
    effect.callback = callback
    effect.dependencies = dependencies
    effects[currentIndex] = effect
    effectsToRun.push(effect)
  }

  hookIndex += 1
}

export function finishHooksRender(): void {
  const pendingEffects = effectsToRun
  const version = effectsVersion
  effectsToRun = []

  queueMicrotask(() => {
    if (version !== effectsVersion) return

    for (const effect of pendingEffects) {
      effect.cleanup?.()
      effect.cleanup = effect.callback() ?? undefined
    }
  })
}

export function cleanupEffects(): void {
  effectsVersion += 1
  effectsToRun = []

  for (const effect of effects) {
    effect?.cleanup?.()
  }
  effects.length = 0
  rerender = null
}
