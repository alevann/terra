import { Context } from '@/types'

export const useContext = <T> (context: Context<T>): T => {
  return context.$.value
}
