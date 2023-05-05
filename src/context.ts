import { Context, ProviderProps } from '@/types'

export const createContext = <T> (): Context<T> => {
  let values: T[] = []

  const Provider = Object.assign(
    ({ value: newValue, children }: ProviderProps<T>) => {
      values.push(newValue)
      return children
    },
    {
      $isContextProvider: true,
      onChildrenRendered: () => values.pop()
    }
  )

  return {
    Provider,
    $: {
      get value () {
        return values[values.length-1]
      }
    }
  }
}
