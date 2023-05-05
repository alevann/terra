import { Element, Context as _Context } from '@/types'

export type PropsWithChildren<Props = unknown> = Props & {
  children: Element | Element[]
}

export type Context<T> = Omit<_Context<T>, '$'>
