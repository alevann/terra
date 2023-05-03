import { Fiber, FunctionalFiber } from '@/types'

export const isFunctional = (fiber: Fiber): fiber is FunctionalFiber => fiber.type instanceof Function
