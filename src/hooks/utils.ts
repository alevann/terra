import { isFunctional } from '@/fiber'
import Terra from '@/Terra'
import { FunctionalFiber } from '@/types'

export const getPreviousHook = <T = any> (): [Optional<T>, FunctionalFiber] => {
  const { rendering } = Terra

  if (!rendering.currentWIPFiber) {
    throw new Error('Called a hook but the current fiber is missing')
  }
  if (!isFunctional(rendering.currentWIPFiber)) {
    throw new Error('Called a hook but the current fiber is not functional')
  }

  const prevHook = rendering.currentWIPFiber.shadow
    && isFunctional(rendering.currentWIPFiber.shadow)
    && rendering.currentWIPFiber.shadow.hooks?.[Terra.currentHookIndex]

  return [prevHook, rendering.currentWIPFiber]
}

export const saveHook = (hook: any) => {
  if (!isFunctional(Terra.rendering.currentWIPFiber)) {
    throw new Error('This should not have happened... damn')
  }
  Terra.rendering.currentWIPFiber.hooks.push(hook)
  Terra.currentHookIndex++
}
