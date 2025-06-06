Jotai
状態
Primitive and flexible state management for React
Provider
Provider
The Provider component is to provide state for a component sub tree. Multiple Providers can be used for multiple subtrees, and they can even be nested. This works just like React Context.

If an atom is used in a tree without a Provider, it will use the default state. This is so-called provider-less mode.

Providers are useful for three reasons:

To provide a different state for each sub tree.
To accept initial values of atoms.
To clear all atoms by remounting.
const SubTree = () => (
  <Provider>
    <Child />
  </Provider>
)
Signatures
const Provider: React.FC<{
  store?: Store
}>
Atom configs don't hold values. Atom values reside in separate stores. A Provider is a component that contains a store and provides atom values under the component tree. A Provider works like React context provider. If you don't use a Provider, it works as provider-less mode with a default store. A Provider will be necessary if we need to hold different atom values for different component trees. Provider can take an optional prop store.

const Root = () => (
  <Provider>
    <App />
  </Provider>
)
store prop
A Provider accepts an optional prop store that you can use for the Provider subtree.

Example
const myStore = createStore()

const Root = () => (
  <Provider store={myStore}>
    <App />
  </Provider>
)
useStore
This hook returns a store within the component tree.

const Component = () => {
  const store = useStore()
  // ...
}
Navigated to JotaiJotai
