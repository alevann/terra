import { didDepsChange, getPreviousHook, saveHook } from 'src/hooks/utils'

type UseCallbackHook<T = Function> = {
  fn: T
  deps: any[]
}

export const useCallback = <T extends Function> (fn: T, deps?: any[]): T => {
  const [prev] = getPreviousHook<UseCallbackHook<T>>()
  const hook: UseCallbackHook<T> = {
    fn: prev?.fn,
    deps
  }

  // If there's no prev.fn, this is the first render
  // otherwise if deps change fn should be updated
  if (!hook.fn || didDepsChange(hook, prev)) {
    hook.fn = fn
  }

  saveHook(hook)

  return hook.fn
}
