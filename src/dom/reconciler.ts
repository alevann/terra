import { Effect, Element, Fiber } from '../types'

/**
 * Reconciles a fiber and its children
 *
 * @param wipFiber the fiber that is currently being processed
 * @param elements the children of the fiber
 * @param pendingRemoval an optional array which is filled with the nodes marked to be removed
 */
const reconcile = (wipFiber: Fiber, elements: Element[], pendingRemoval?: Fiber[]) => {
  let index = 0
  let oldFiber = wipFiber.shadow && wipFiber.shadow?.child
  let prevSibling = null

  while (index < elements.length || oldFiber) {
    const element = elements[index]
    let newFiber: Fiber | null = null

    const sameType = oldFiber && element && element.type === oldFiber.type

    if (sameType) {
      newFiber = <Fiber> {
        type: oldFiber.type,
        props: element.props,
        node: oldFiber.node,
        parent: wipFiber,
        shadow: oldFiber,
        effect: Effect.Update
      }
    }
    if (element && !sameType) {
      newFiber = <Fiber> {
        type: element.type,
        props: element.props,
        node: null,
        parent: wipFiber,
        shadow: null,
        effect: Effect.Create
      }
    }
    if (oldFiber && !sameType) {
      oldFiber.effect = Effect.Delete
      pendingRemoval.push(oldFiber)
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }

    prevSibling = newFiber
    index++
  }
}

export default {
  reconcile
}
