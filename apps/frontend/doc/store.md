Jotai
状態
Primitive and flexible state management for React
Store
createStore
This function is to create a new empty store. The store can be used to pass in Provider.

The store has three methods: get for getting atom values, set for setting atom values, and sub for subscribing to atom changes.

const myStore = createStore()

const countAtom = atom(0)
myStore.set(countAtom, 1)
const unsub = myStore.sub(countAtom, () => {
  console.log('countAtom value is changed to', myStore.get(countAtom))
})
// unsub() to unsubscribe

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)
getDefaultStore
This function returns a default store that is used in provider-less mode.

const defaultStore = getDefaultStore()
Navigated to JotaiJotai
