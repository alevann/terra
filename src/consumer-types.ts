import { Element, Context as _Context, ElementFactory } from '@/types'

export type PropsWithChildren<Props = unknown> = Props & {
  children: string | number | boolean | Element | ElementFactory | null | undefined
}

export type Context<T> = Omit<_Context<T>, '$'>
