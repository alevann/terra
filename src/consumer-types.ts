import { Element } from '@/types'

export type PropsWithChildren<Props = unknown> = Props & {
  children: Element
}
