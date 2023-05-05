import { getPreviousHook, saveHook } from './utils'
import Terra from '@/Terra'

type Consumer <T> = (state: T) => T
type SetState <T> = (updater: Consumer<T>) => void

export const useState = <T> (initial?: T): [T, SetState<T>] => {
  const [prevHook] = getPreviousHook()
  const hook = {
    state: prevHook ? prevHook.state : initial,
    queue: []
  }

  const actions = prevHook?.queue ?? []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = (action: Consumer<T>) => {
    hook.queue.push(action)
    Terra.rendering.triggerRender()
  }

  saveHook(hook)

  return [hook.state, setState]
}

