import { ConstantFiber, ElementProps, Fiber } from '@/types'

/**
 * Creates a new node and immediately commits it to the DOM
 *
 * @param fiber the fiber for which to create a node
 */
const createNode = (fiber: ConstantFiber): HTMLElement => {
  const node = fiber.type === 'TextElement'
    ? document.createTextNode('') as unknown as HTMLElement // shut up typescript
    : document.createElement(fiber.type)

  // FIXME: this updates the DOM synchronously, is this fine?
  //  Pretty sure it draws more than it has to...
  updateNode(node, { children: [] }, fiber.props)

  return node
}

/**
 * This function is kinda stupid, but I like the separation
 * that it provides
 * Pretty much all actual DOM manipulation happens in this file,
 * and I think that's neat
 *
 * @param node the node to append
 * @param parent the parent to append the node to
 */
const appendNode = (node: HTMLElement, parent: HTMLElement) => {
  parent.appendChild(node)
}

/**
 * Diffs the passed props and updates the properties that changed
 *
 * @param node the node to update
 * @param prev the previous props
 * @param next the next props
 */
const updateNode = (node: HTMLElement, prev: ElementProps, next: ElementProps) => {
  const isEvent = key => key.startsWith('on')
  const isProperty = key => key !== 'children' && !isEvent(key) && key in node
  const isNew = key => prev[key] !== next[key]
  const isGone = key => !(key in next)

  // Remove old event listeners
  Object.keys(prev)
    .filter(isEvent)
    .filter(key => isGone(key) || isNew(key))
    .forEach(name => {
      const type = name.toLowerCase().substring(2)
      node.removeEventListener(type, prev[name])
    })
  // Add new event listener, may be completely new or changed
  Object.keys(next)
    .filter(isEvent)
    .filter(isNew)
    .forEach(name => {
      const type = name.toLowerCase().substring(2)
      node.addEventListener(type, next[name])
    })
  // Remove old properties
  Object.keys(prev)
    .filter(isProperty)
    .filter(isGone)
    .forEach(name => {
      node[name] = ''
    })
  // Add new properties, may be completely new or changed
  Object.keys(next)
    .filter(isProperty)
    .filter(isNew)
    .forEach(name => {
      node[name] = next[name]
    })

  // The style of an object is readonly, so it must be applied separately
  const ps = prev.style ?? {}
  const ns = next.style ?? {}

  Object.keys(ps)
    .filter(key => !(key in ns))
    .forEach(style => node.style[style] = '')

  Object.keys(ns)
    .filter(key => ns[key] !== ps[key])
    .forEach(style => node.style[style] = ns[style])
}

/**
 * Removes a node from the DOM, if the passed fiber has no node
 * it looks for the first children which has a node
 *
 * @param fiber the fiber to delete
 * @param node the node of the closest ancestor which has a valid node
 */
const deleteNode = (fiber: Fiber, node: HTMLElement) => {
  if (fiber.node) {
    node.removeChild(fiber.node)
  } else {
    deleteNode(fiber.child, node)
  }
}

export default {
  createNode,
  updateNode,
  appendNode,
  deleteNode
}
