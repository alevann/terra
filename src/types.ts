export type ElementFactory = (props: Element['props']) => Element
export type ElementName = keyof HTMLElementTagNameMap | 'TextElement'
export type ElementType = ElementName | ElementFactory

/**
 * An element is a node in the Virtual DOM, it may be a functional element or a constant element
 */
export type Element<Props extends Record<string, any> = any> = {
  type: ElementType
  props: Props & {
    children: Element[]
  }
}

export type ElementProps<Props extends Record<string, any> = any> = Element<Props>['props']

/**
 * A functional element, is any function which returns an element (JSX)
 */
export type FunctionalElement<Props extends Record<string, any> = any> = Element<Props> & {
  type: ElementFactory
}

/**
 * A constant element, is an element which uses default HTML tags
 */
export type ConstantElement<Props extends Record<string, any> = any> = Element<Props> & {
  type: ElementName
}

export enum Effect {
  Create,
  Update,
  Delete
}

export type BaseFiber = {
  props: ElementProps
  node?: HTMLElement
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
  shadow: Fiber
  effect?: Effect
}

export type Fiber = FunctionalFiber | ConstantFiber | ContextFiber

export type FunctionalFiber = BaseFiber & {
  type: ElementFactory
  hooks: any[]
}

export type ConstantFiber = BaseFiber & {
  type: ElementName
}

export type ContextFiber = FunctionalFiber & {
  type: ContextProvider
}

export type ProviderProps<T> = {
  value: T,
  children?: Element | Element[]
}
export type ContextProvider<T = any> = {
  (props: ProviderProps<T>): ProviderProps<T>['children']
  $isContextProvider: boolean
  onChildrenRendered: () => void
}
export type Context<T = any> = {
  Provider: ContextProvider<T>
  $: {
    get value (): T
  }
}
