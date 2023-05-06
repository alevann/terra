import { didDepsChange, getPreviousHook, saveHook } from './utils'
import { Effect } from '@/types'

type UseEffectHook = {
  teardown: (() => unknown) | void
  deps: any[]
}

export const useEffect = (setup: () => UseEffectHook['teardown'], deps?: any[]) => {
  const [prevHook, fiber] = getPreviousHook<UseEffectHook>()
  const hook: UseEffectHook = {
    teardown: prevHook?.teardown,
    deps
  }

  const prevLength = prevHook?.deps?.length
  const length = hook?.deps?.length
  if (prevHook && prevLength !== length) {
    throw new Error('Looks like a dependency has been added at runtime, and that seems weirdly complex to support.' +
      'Not like I thought about it, but just at first glance right? Anyways that\'s not supported sorry')
  }

  // If the dependencies changed, update the hook
  if (prevHook?.deps && didDepsChange(hook, prevHook)) {
    hook.teardown && hook.teardown()
    hook.teardown = setup()
  }
  // Call setup if the component is being mounted
  if (fiber.effect === Effect.Create) {
    hook.teardown = setup()
  }
  // If the component is being unmounted, call the cleanup
  if (fiber.effect === Effect.Delete) {
    hook.teardown && hook.teardown()
  }

  saveHook(hook)
}
