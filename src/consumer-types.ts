import { Context as _Context, ElementType } from '@/types'

export type PropsWithChildren<Props = unknown> = Props & {
  children?: any // Whatever I can't fix it without this lol
}

export type Context<T> = Omit<_Context<T>, '$'>
export type TerraNode = ElementType
