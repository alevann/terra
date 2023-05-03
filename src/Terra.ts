import { Scheduler } from '@/scheduler'
import { Fiber } from '@/types'

type ITerra = {
  currentHookIndex: number
  rendering: {
    currentWIPFiber: Fiber
    currentWIPRoot: Fiber
    currentDOMFiber: Fiber
    pendingRemoval: Fiber[]
    scheduler: Scheduler<Fiber>
    triggerRender: () => void
  }
}

const triggerRender = () => {
  if (!Terra.rendering.currentDOMFiber) {
    throw new Error('setState has been called during the first render, ' +
      'this is not supported because why would you do that? ' +
      '(also it causes a crash that I don\'t feel like fixing so...)')
  }

  Terra.rendering.currentWIPRoot = {
    type: null,
    node: Terra.rendering.currentDOMFiber.node,
    props: Terra.rendering.currentDOMFiber.props,
    shadow: Terra.rendering.currentDOMFiber
  }
  Terra.rendering.pendingRemoval = []
  Terra.rendering.scheduler.changeTask(Terra.rendering.currentWIPRoot)
}

const Terra: ITerra = {
  currentHookIndex: 0,
  rendering: {
    currentWIPFiber: null,
    currentWIPRoot: null,
    currentDOMFiber: null,
    pendingRemoval: [],
    scheduler: null,
    triggerRender
  }
}

export default Terra
