import { Element, ElementProps, ElementType } from './types'

/**
 * This function is the function that JSX compiles down to,
 * it creates {@link Element}s from a type and its props
 *
 * Children are "normalized" to make further processing of the resulting VDOM easier
 * In practice, this normalization allows to make these assumptions:
 *  - the children property is guaranteed to be an array
 *  - the children themselves are always an element
 *
 * @example Result of JSX compilation
 * const Component = <p id='my-id'>Hello world!</p>
 * const Compiled = jsx('p', { id: 'my-id', children: 'Hello world!' })
 *
 * @example Nested JSX calls
 * const Component = <div><SomeComponent /> and text</div>
 * const Complied = jsx('div', { children: [jsx(SomeComponent, null), 'and text'] })
 *
 * @param element a function that returns a VDOM node, or an HTML tag name
 * @param attr the attributes of the element, along with its children
 */
export const jsx = (element: ElementType, { children, ...props }: ElementProps): Element => {
  if (!Array.isArray(children)) {
    children = [children]
  }
  children = children.map(child => (
    typeof child === 'object'
      ? child
      : { type: 'TextElement', props: { nodeValue: child, children: [] } }
  ))

  return {
    type: element,
    props: {
      ...props,
      children
    }
  }
}

/**
 * Not sure why, but without this I get some warnings so, here it is, babel...
 */
export const jsxs = jsx
