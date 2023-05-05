import { isContext, isFunctional } from '@/fiber'
import Terra from '@/Terra'
import { ConstantFiber, Effect, Element, Fiber, FunctionalFiber } from '@/types'
import Painter from './painter'
import Reconciler from './reconciler'
import Scheduler from '@/scheduler'

const { rendering: RenderingContext } = Terra

type AbortRender = () => void

export const render = (element: Element, parent?: HTMLElement): AbortRender => {
  RenderingContext.currentWIPRoot = {
    type: null,
    node: parent,
    props: {
      children: [element]
    },
    shadow: null
  }
  RenderingContext.pendingRemoval = []

  RenderingContext.scheduler = Scheduler(process, checkCommit)
  RenderingContext.scheduler.start(RenderingContext.currentWIPRoot)

  // Why do I need this lol
  return () => {
    RenderingContext.scheduler.stop()
  }
}

// TODO: this should check the deadline and possibly delay the render?
//  Maybe there's a better way than just ignoring it?
const checkCommit = (nextUnitOfWork: Fiber, _: IdleDeadline) => {
  if (nextUnitOfWork || !RenderingContext.currentWIPRoot) {
    return
  }
  RenderingContext.pendingRemoval.forEach(commit)
  commit(RenderingContext.currentWIPRoot.child)

  RenderingContext.currentDOMFiber = RenderingContext.currentWIPRoot
  RenderingContext.currentWIPRoot = null
}

const commit = (fiber: Fiber) => {
  if (!fiber) {
    return
  }

  const parentNode = firstAncestorWithNode(fiber).node
  if (fiber.effect === Effect.Create && fiber.node !== null) {
    Painter.appendNode(fiber.node, parentNode)
  } else if (fiber.effect === Effect.Update) {
    Painter.updateNode(fiber.node ?? parentNode, fiber.shadow.props, fiber.props)
  } else if (fiber.effect === Effect.Delete) {
    Painter.deleteNode(fiber, parentNode)
  }

  commit(fiber.child)
  commit(fiber.sibling)
}

const firstAncestorWithNode = (fiber: Fiber): Fiber => {
  let parentFiber = fiber.parent
  while (!parentFiber.node) {
    parentFiber = parentFiber.parent
  }
  return parentFiber
}

const process = (fiber: Fiber): Optional<Fiber> => {
  if (isFunctional(fiber)) {
    prepareFunctionalElement(fiber)
  } else {
    prepareConstantElement(fiber)
  }

  Reconciler.reconcile(fiber, fiber.props.children, RenderingContext.pendingRemoval)

  if (fiber.child) {
    return fiber.child
  }

  let next = fiber
  while (next) {
    if (next.sibling) {
      return next.sibling
    }
    next = next.parent

    if (next && isContext(next)) {
      next.type.onChildrenRendered()
    }
  }
}

const prepareFunctionalElement = (fiber: FunctionalFiber) => {
  RenderingContext.currentWIPFiber = fiber
  Terra.currentHookIndex = 0
  fiber.hooks = []

  // Fragments (which are functional fibers) return an array of children
  const children = fiber.type(fiber.props)
  fiber.props.children = Array.isArray(children) ? children : [children]
}

const prepareConstantElement = (fiber: ConstantFiber) => {
  if (!fiber.node) {
    fiber.node = Painter.createNode(fiber)
  }
}

export default {
  render
}
