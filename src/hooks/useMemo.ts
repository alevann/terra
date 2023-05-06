import { didDepsChange, getPreviousHook, saveHook } from 'src/hooks/utils'

type UseMemoHook<T> = {
  value: T
  deps: any[]
}

export const useMemo = <T> (factory: () => T, deps: any[]): T => {
  const [prev] = getPreviousHook<UseMemoHook<T>>()
  const hook: UseMemoHook<T> = {
    value: prev?.value,
    deps
  }

  // If there's no value, it's the first render
  // otherwise call factory if the deps changed
  if (!hook.value || didDepsChange(hook, prev)) {
    hook.value = factory()
  }

  saveHook(hook)
  return hook.value
}
