export type Scheduler <Unit> = {
  start: (data: Unit) => void
  stop: () => void
  changeTask: (data: Unit) => void
}

/**
 * A generic low-priority scheduler that executes during down-time
 * using {@link requestIdleCallback}
 *
 * @param doWork the function that should be executed
 * @param onStop an optional callback invoked before stopping
 */
export default function Scheduler <Unit> (
  doWork: (data: Unit) => Optional<Unit>,
  onStop?: (nextUnitOfWork: Unit, deadline: IdleDeadline) => void
): Scheduler<Unit> {
  let nextUnitOfWork: Unit | null = null
  let taskId: number | null = null

  const workLoop = (deadline: IdleDeadline) => {
    while (nextUnitOfWork && deadline.timeRemaining() > 1) {
      nextUnitOfWork = doWork(nextUnitOfWork)
    }

    onStop?.(nextUnitOfWork, deadline)
    requestIdleCallback(workLoop)
  }

  const changeTask = (data: Unit) => {
    nextUnitOfWork = data
  }

  const start = (data: Unit) => {
    taskId === null && stop()
    nextUnitOfWork = data
    taskId = requestIdleCallback(workLoop)
  }

  const stop = () => {
    cancelIdleCallback(taskId)
    taskId = null
  }

  return {
    start,
    stop,
    changeTask
  }
}
