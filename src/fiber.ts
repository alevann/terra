import { ContextFiber, Fiber, FunctionalFiber } from '@/types'

export const isFunctional = (fiber: Fiber): fiber is FunctionalFiber => fiber.type instanceof Function

export const isContext = (fiber: Fiber): fiber is ContextFiber => typeof fiber.type === 'function' && (fiber.type as any).$isContextProvider
