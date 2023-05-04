import Painter from '@/dom/painter'

describe('updateNode', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    node = null
  })

  test('updates node properties', () => {
    const prevProps = { id: 'prev-id', className: 'prev-class', style: { color: 'red' } }
    const nextProps = { id: 'next-id', className: 'next-class', style: { color: 'blue', fontSize: '20px' } }

    Painter.updateNode(node, {}, prevProps)
    expect(node.id).toBe('prev-id')
    expect(node.className).toBe('prev-class')
    expect(node.style.color).toBe('red')

    Painter.updateNode(node, prevProps, nextProps)
    expect(node.id).toBe('next-id')
    expect(node.className).toBe('next-class')
    expect(node.style.color).toBe('blue')
    expect(node.style.fontSize).toBe('20px')
  })

  test('removes old event listeners and adds new ones', () => {
    const prevProps = { onClick: jest.fn(), onMouseEnter: jest.fn() }
    const nextProps = { onClick: prevProps.onClick, onMouseLeave: jest.fn() }

    const addListenersSpy = jest.spyOn(node, 'addEventListener')
    const remListenersSpy = jest.spyOn(node, 'removeEventListener')

    Painter.updateNode(node, {}, prevProps)
    expect(addListenersSpy).toHaveBeenCalledTimes(2)
    expect(addListenersSpy.mock.calls[0][1]).toBe(prevProps.onClick)
    expect(addListenersSpy.mock.calls[1][1]).toBe(prevProps.onMouseEnter)
    expect(remListenersSpy).not.toHaveBeenCalled()

    addListenersSpy.mockClear()
    remListenersSpy.mockClear()

    Painter.updateNode(node, prevProps, nextProps)
    expect(remListenersSpy).toHaveBeenCalledTimes(1)
    expect(remListenersSpy.mock.calls[0][1]).toBe(prevProps.onMouseEnter)
    expect(addListenersSpy).toHaveBeenCalledTimes(1)
    expect(addListenersSpy.mock.calls[0][1]).toBe(nextProps.onMouseLeave)
  })

  test('removes old properties and sets new ones', () => {
    const prevProps = { id: 'prev-id', className: 'prev-class', hidden: true }
    const nextProps = { id: 'next-id', className: 'next-class', lang: 'en' }

    Painter.updateNode(node, {}, prevProps)
    expect(node.id).toBe('prev-id')
    expect(node.className).toBe('prev-class')
    expect(node.hidden).toBe(true)

    Painter.updateNode(node, prevProps, nextProps)
    expect(node.id).toBe('next-id')
    expect(node.className).toBe('next-class')
    expect(node.hidden).toBe(false)
    expect(node.lang).toBe('en')
  })

  test('sets inline styles', () => {
    const prevProps = { style: { color: 'red', fontSize: '16px' } }
    const nextProps = { style: { color: 'blue', fontWeight: 'bold' } }

    Painter.updateNode(node, {}, prevProps)
    expect(node.style.color).toBe('red')
    expect(node.style.fontSize).toBe('16px')

    Painter.updateNode(node, prevProps, nextProps)
    expect(node.style.color).toBe('blue')
    expect(node.style.fontSize).toBe('')
    expect(node.style.fontWeight).toBe('bold')
  })

  test('updateNode clears inline-styles correctly', () => {
    const prevProps = { style: { color: 'blue', backgroundColor: 'white' } }
    const nextProps = { style: {} }

    Painter.updateNode(node, {}, prevProps)
    expect(node.style.color).toBe('blue')
    expect(node.style.backgroundColor).toBe('white')

    Painter.updateNode(node, prevProps, nextProps)
    expect(node.style.color).toBe('')
    expect(node.style.backgroundColor).toBe('')
  })
})
