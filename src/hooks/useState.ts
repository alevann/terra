import { getPreviousHook, saveHook } from './utils'
import Terra from '@/Terra'

type Consumer <T> = (state: T) => T
type SetState <T> = (updater: Consumer<T>) => void

type UseStateHook<T> = {
  state: T
  queue: Array<Consumer<T>>
  setState: (action: Consumer<T>) => void
}

export const useState = <T> (initial?: T): [T, SetState<T>] => {
  const [prevHook] = getPreviousHook<UseStateHook<T>>()
  const hook: UseStateHook<T> = {
    state: prevHook ? prevHook.state : initial,
    queue: [],
    setState: prevHook?.setState
  }

  // Guarantee setState always has the same identity so that
  // it can be used with useMemo, useCallback, etc...
  if (!hook.setState) {
    hook.setState = (action: Consumer<T>) => {
      hook.queue.push(action)
      Terra.rendering.triggerRender()
    }
  }

  // Don't think I need this check but you know
  if (prevHook.setState && !Object.is(prevHook.setState, hook.setState)) {
    throw new Error('Mismatched setState identity between renders, this is weird and should not have happened?')
  }

  const actions = prevHook?.queue ?? []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  saveHook(hook)

  return [hook.state, hook.setState]
}

