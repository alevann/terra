import { jsx } from '../src/jsx-runtime'

describe('JSX with default HTML tags', () => {
  it('should transform a simple element with an ID and text content', () => {
    const output = jsx('p', { id: 'my-id', children: 'some-text' })

    expect(output).toEqual({
      type: 'p',
      props: {
        id: 'my-id',
        children: [{ type: 'TextElement', props: { nodeValue: 'some-text', children: [] } }]
      }
    })
  })

  it('should transform a complex element with nested children and classes', () => {
    const output = jsx('div', {
      className: 'my-class-1',
      children: [
        jsx('p', {
          children: [
            'A div with a class and multiple nested ',
            jsx('span', {
              className: 'red-text',
              children: 'children'
            })
          ]
        })
      ]
    })

    expect(output).toEqual({
      type: 'div',
      props: {
        className: 'my-class-1',
        children: [
          {
            type: 'p',
            props: {
              children: [
                {
                  type: 'TextElement',
                  props: {
                    nodeValue: 'A div with a class and multiple nested ',
                    children: []
                  }
                },
                {
                  type: 'span',
                  props: {
                    className: 'red-text',
                    children: [
                      {
                        type: 'TextElement',
                        props: {
                          nodeValue: 'children',
                          children: []
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    })
  })

  it('should transform a self-closing element', () => {
    const output = jsx('input', null)

    expect(output).toEqual({
      type: 'input',
      props: {
        children: []
      }
    })
  })
})

describe('JSX with custom components', () => {
  test('should transform a custom component with no props', () => {
    const component = () => null // mock component
    const jsxOutput = jsx('div', { children: jsx(component, null) })
    const expectedOutput = {
      type: 'div',
      props: {
        children: [
          {
            type: component,
            props: {
              children: []
            }
          }
        ]
      }
    }
    expect(jsxOutput).toEqual(expectedOutput)
  })

  test('should transform a custom component with props', () => {
    const component = () => null // mock component
    const jsxOutput = jsx(component, { myProp: 'some-text' })
    const expectedOutput = {
      type: component,
      props: {
        myProp: 'some-text',
        children: []
      }
    }
    expect(jsxOutput).toEqual(expectedOutput)
  })

  test('should transform a custom component with children', () => {
    const component = () => null
    const jsxOutput = jsx(component, { children: 'some-text' })
    const expectedOutput = {
      type: component,
      props: {
        children: [
          {
            type: 'TextElement',
            props: {
              nodeValue: 'some-text',
              children: []
            }
          }
        ]
      }
    }
    expect(jsxOutput).toEqual(expectedOutput)
  })

  test('should transform a custom component with children and props', () => {
    const component = () => null
    const jsxOutput = jsx(component, { children: 'some-text', customProp: 1 })
    const expectedOutput = {
      type: component,
      props: {
        customProp: 1,
        children: [
          {
            type: 'TextElement',
            props: {
              nodeValue: 'some-text',
              children: []
            }
          }
        ]
      }
    }
    expect(jsxOutput).toEqual(expectedOutput)
  })
})
