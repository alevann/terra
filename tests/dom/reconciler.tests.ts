import { Effect, Fiber, ConstantElement } from '@/types'
import Reconciler from '@/dom/reconciler'

describe('reconcile', () => {
  let wipFiber: Fiber
  let elements: ConstantElement[]
  let pendingRemoval: Fiber[]

  beforeEach(() => {
    wipFiber = {
      type: 'div',
      props: { children: [] },
      shadow: {
        child: null,
        sibling: null,
        parent: null,
        type: 'div',
        props: { children: [] },
        shadow: null,
      },
    }
    elements = []
    pendingRemoval = []
  })

  it('should not throw when called with empty elements array', () => {
    expect(() => Reconciler.reconcile(wipFiber, elements)).not.toThrow()
  })

  it('should create new fibers for new elements', () => {
    const element: ConstantElement = { type: 'span', props: { children: [] } }
    elements = [element]
    Reconciler.reconcile(wipFiber, elements)
    expect(wipFiber.child?.type).toEqual('span')
    expect(wipFiber.child?.effect).toEqual(Effect.Create)
  })

  it('should update existing fibers with matching element types', () => {
    const element: ConstantElement = { type: 'div', props: { className: 'test' } }
    elements = [element]
    wipFiber.shadow.child = {
      type: 'div',
      props: { className: 'initial' },
      node: document.createElement('div'),
      shadow: null,
      effect: null,
    }
    Reconciler.reconcile(wipFiber, elements)
    expect(wipFiber.child?.props.className).toEqual('test')
    expect(wipFiber.child?.node).toBeDefined()
    expect(wipFiber.child?.effect).toEqual(Effect.Update)
  })

  it('should remove old fibers for elements that are no longer present', () => {
    const element: ConstantElement = { type: 'span', props: { children: [] } }
    elements = [element]
    wipFiber.shadow.child = {
      type: 'div',
      props: { className: 'initial' },
      node: document.createElement('div'),
      shadow: null,
      effect: null,
      sibling: {
        type: 'span',
        props: { children: [] },
        shadow: null,
        effect: null,
      },
    }
    Reconciler.reconcile(wipFiber, elements, pendingRemoval)
    expect(wipFiber.child?.type).toEqual('span')
    expect(pendingRemoval.length).toEqual(1)
    expect(pendingRemoval[0].type).toEqual('div')
    expect(pendingRemoval[0].effect).toEqual(Effect.Delete)
  })
})
