Jotai
状態
Primitive and flexible state management for React
atom
atom
The atom function is to create an atom config. We call it "atom config" as it's just a definition and it doesn't yet hold a value. We may also call it just "atom" if the context is clear.

An atom config is an immutable object. The atom config object doesn't hold a value. The atom value exists in a store.

To create a primitive atom (config), all you need is to provide an initial value.

import { atom } from 'jotai'

const priceAtom = atom(10)
const messageAtom = atom('hello')
const productAtom = atom({ id: 12, name: 'good stuff' })
You can also create derived atoms. We have three patterns:

Read-only atom
Write-only atom
Read-Write atom
To create derived atoms, we pass a read function and an optional write function.

const readOnlyAtom = atom((get) => get(priceAtom) * 2)
const writeOnlyAtom = atom(
  null, // it's a convention to pass `null` for the first argument
  (get, set, update) => {
    // `update` is any single value we receive for updating this atom
    set(priceAtom, get(priceAtom) - update.discount)
    // or we can pass a function as the second parameter
    // the function will be invoked,
    //  receiving the atom's current value as its first parameter
    set(priceAtom, (price) => price - update.discount)
  },
)
const readWriteAtom = atom(
  (get) => get(priceAtom) * 2,
  (get, set, newPrice) => {
    set(priceAtom, newPrice / 2)
    // you can set as many atoms as you want at the same time
  },
)
get in the read function is to read the atom value. It's reactive and read dependencies are tracked.

get in the write function is also to read atom value, but it's not tracked. Furthermore, it can't read unresolved async values in Jotai v1 API.

set in the write function is to write atom value. It will invoke the write function of the target atom.

Note about creating an atom in render function
Atom configs can be created anywhere, but referential equality is important. They can be created dynamically too. To create an atom in render function, useMemo or useRef is required to get a stable reference. If in doubt about using useMemo or useRef for memoization, use useMemo. Otherwise, it can cause infinite loop with useAtom.

const Component = ({ value }) => {
  const valueAtom = useMemo(() => atom({ value }), [value])
  // ...
}
Signatures
// primitive atom
function atom<Value>(initialValue: Value): PrimitiveAtom<Value>

// read-only atom
function atom<Value>(read: (get: Getter) => Value): Atom<Value>

// writable derived atom
function atom<Value, Args extends unknown[], Result>(
  read: (get: Getter) => Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result,
): WritableAtom<Value, Args, Result>

// write-only derived atom
function atom<Value, Args extends unknown[], Result>(
  read: Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result,
): WritableAtom<Value, Args, Result>
initialValue: the initial value that the atom will return until its value is changed.
read: a function that's evaluated whenever the atom is read. The signature of read is (get) => Value, and get is a function that takes an atom config and returns its value stored in Provider as described below. Dependency is tracked, so if get is used for an atom at least once, the read will be reevaluated whenever the atom value is changed.
write: a function mostly used for mutating atom's values, for a better description; it gets called whenever we call the second value of the returned pair of useAtom, the useAtom()[1]. The default value of this function in the primitive atom will change the value of that atom. The signature of write is (get, set, ...args) => Result. get is similar to the one described above, but it doesn't track the dependency. set is a function that takes an atom config and a new value which then updates the atom value in Provider. ...args is the arguments that we receive when we call useAtom()[1]. Result is the return value of the write function.
const primitiveAtom = atom(initialValue)
const derivedAtomWithRead = atom(read)
const derivedAtomWithReadWrite = atom(read, write)
const derivedAtomWithWriteOnly = atom(null, write)
There are two kinds of atoms: a writable atom and a read-only atom. Primitive atoms are always writable. Derived atoms are writable if the write is specified. The write of primitive atoms is equivalent to the setState of React.useState.

debugLabel property
The created atom config can have an optional property debugLabel. The debug label is used to display the atom in debugging. See Debugging guide for more information.

Note: While, the debug labels don’t have to be unique, it’s generally recommended to make them distinguishable.

onMount property
The created atom config can have an optional property onMount. onMount is a function which takes a function setAtom and returns onUnmount function optionally.

The onMount function is called when the atom is subscribed in the provider in the first time, and onUnmount is called when it’s no longer subscribed. In some cases (like React strict mode), an atom can be unmounted and then mounted immediately.

const anAtom = atom(1)
anAtom.onMount = (setAtom) => {
  console.log('atom is mounted in provider')
  setAtom(c => c + 1) // increment count on mount
  return () => { ... } // return optional onUnmount function
}

const Component = () => {
  // `onMount` will be called when the component is mounted in the following cases:
  useAtom(anAtom)
  useAtomValue(anAtom)

  // however, in the following cases,
  //  `onMount` will not be called because the atom is not subscribed:
  useSetAtom(anAtom)
  useAtomCallback(
    useCallback((get) => get(anAtom), []),
  )
  // ...
}
Calling setAtom function will invoke the atom’s write. Customizing write allows changing the behavior.

const countAtom = atom(1)
const derivedAtom = atom(
  (get) => get(countAtom),
  (get, set, action) => {
    if (action.type === 'init') {
      set(countAtom, 10)
    } else if (action.type === 'inc') {
      set(countAtom, (c) => c + 1)
    }
  },
)
derivedAtom.onMount = (setAtom) => {
  setAtom({ type: 'init' })
}
Advanced API
Since Jotai v2, the read function has the second argument options.

options.signal
It uses AbortController so that you can abort async functions. Abort is triggered before new calculation (invoking read function) is started.

How to use it:

const readOnlyDerivedAtom = atom(async (get, { signal }) => {
  // use signal to abort your function
})

const writableDerivedAtom = atom(
  async (get, { signal }) => {
    // use signal to abort your function
  },
  (get, set, arg) => {
    // ...
  },
)
The signal value is AbortSignal. You can check signal.aborted boolean value, or use abort event with addEventListener.

For fetch use case, we can simply pass signal.

See the below example for fetch usage.

options.setSelf
It's a special function to invoke the write function of the self atom.

⚠️ It's provided primarily for internal usage and third-party library authors. Read the source code carefully to understand the behavior. Check release notes for any breaking/non-breaking changes.

Stackblitz

import { Suspense } from 'react'
import { atom, useAtom } from 'jotai'

const userIdAtom = atom(1)
const userAtom = atom(async (get, { signal }) => {
  const userId = get(userIdAtom)
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`,
    { signal },
  )
  return response.json()
})

const Controls = () => {
  const [userId, setUserId] = useAtom(userIdAtom)
  return (
    <div>
      User Id: {userId}
      <button onClick={() => setUserId((c) => c - 1)}>Prev</button>
      <button onClick={() => setUserId((c) => c + 1)}>Next</button>
    </div>
  )
}

const UserName = () => {
  const [user] = useAtom(userAtom)
  return <div>User name: {user.name}</div>
}

const App = () => (
  <>
    <Controls />
    <Suspense fallback="Loading...">
      <UserName />
    </Suspense>
  </>
)

export default App
Navigated to JotaiJotai
