# Terra

![tests](https://github.com/alevann/terra/actions/workflows/tests.yml/badge.svg?event=push)

A React clone I'm making cause why not, check the table below to see how Terra compares to React:

| (Chad) Terra                            | (Virgin) React                                     |
|-----------------------------------------|----------------------------------------------------|
| Is made with love by a single guy       | Developed by a heartless mega-corporation          |
| Way cooler name, not even a competition | Has QA and testing                                 |
| Super small, no bloat                   | Has useful features                                |
| Cares for the environment               | Doesn't care for the environment and hates puppies |

After reading through that, and realizing that Terra is perfect for you, you may ask: is this production ready?
And to that I say: everything is production ready if you use it in production, go forth.

## TODO

Stuff that needs to be done, but won't necessarily be done:

* [x] Update README
* [ ] Fix public package API to allow importing directly from `terra/dom` instead of `terra/dist/dom`
* [ ] `PropsWithChildren` causes TS2322 even if children are passed, no clue why
* [x] Context API
  * [x] createContext
  * [x] useContext
  * [x] Context.Provider
* [ ] More hooks
  * [x] useMemo
  * [ ] useRef
  * [ ] useReducer
  * [x] useCallback
  * [x] Do custom hooks even work? -- Hell yeah they do baby (apparently)
  * [ ] Hook implementations should be tested (not manually)
* [x] Fragments
* [ ] Lazy loading
* [x] Tests
  * [x] This list is really depressing, so I'm marking this as done 
