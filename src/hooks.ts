import { isFunctional } from './fiber'
import Terra from './Terra'

type Consumer <T> = (state: T) => T
type SetState <T> = (updater: Consumer<T>) => void

export const useState = <T> (initial: T): [T, SetState<T>] => {
  const { rendering } = Terra

  if (!rendering.currentWIPFiber || !isFunctional(rendering.currentWIPFiber)) {
    throw new Error('Called a hook but the current fiber is ' + (!rendering.currentWIPFiber ? 'missing' : 'not functional'))
  }

  const prevHook = rendering.currentWIPFiber.shadow && isFunctional(rendering.currentWIPFiber.shadow) && rendering.currentWIPFiber.shadow.hooks?.[Terra.currentHookIndex]
  const hook = {
    state: prevHook ? prevHook.state : initial,
    queue: []
  }

  console.log('applying actions')
  const actions = prevHook?.queue ?? []
  actions.forEach(action => {
    hook.state = action(hook.state)
  })

  const setState = (action: Consumer<T>) => {
    hook.queue.push(action)
    Terra.rendering.triggerRender()
  }

  rendering.currentWIPFiber.hooks.push(hook)
  Terra.currentHookIndex++

  return [hook.state, setState]
}
