Jotai
状態
Primitive and flexible state management for React
useAtom
useAtom
The useAtom hook is used to read an atom from the state. The state can be seen as a WeakMap of atom configs and atom values.

The useAtom hook returns the atom value and an update function as a tuple, just like React's useState. It takes an atom config created with atom() as a parameter.

At the creation of the atom config, there is no value associated with it. Only once the atom is used via useAtom, does the initial value get stored in the state. If the atom is a derived atom, the read function is called to compute its initial value. When an atom is no longer used, meaning all the components using it are unmounted and the atom config no longer exists, the value in the state is garbage collected.

const [value, setValue] = useAtom(anAtom)
The setValue takes just one argument, which will be passed to the write function of the atom as the third parameter. The end result depends on how the write function is implemented. If the write function is not explicitly set, the atom will simply receive the value passed as a parameter to setValue.

Note: as mentioned in the atom section, referential equality is important when creating atoms, so you need to handle it properly otherwise it can cause infinite loops.

const stableAtom = atom(0)
const Component = () => {
  const [atomValue] = useAtom(atom(0)) // This will cause an infinite loop since the atom instance is being recreated in every render
  const [atomValue] = useAtom(stableAtom) // This is fine
  const [derivedAtomValue] = useAtom(
    useMemo(
      // This is also fine
      () => atom((get) => get(stableAtom) * 2),
      [],
    ),
  )
}
Note: Remember that React is responsible for calling your component, meaning it has to be idempotent, ready to be called multiple times. You will often see an extra re-render even if no props or atoms have changed. An extra re-render without a commit is an expected behavior, since it is the default behavior of useReducer in React 18.

Signatures
// primitive or writable derived atom
function useAtom<Value, Update>(
  atom: WritableAtom<Value, Update>,
  options?: { store?: Store },
): [Value, SetAtom<Update>]

// read-only atom
function useAtom<Value>(
  atom: Atom<Value>,
  options?: { store?: Store },
): [Value, never]
How atom dependency works
Every time we invoke the "read" function, we refresh the dependencies and dependents.

The read function is the first parameter of the atom. If B depends on A, it means that A is a dependency of B, and B is a dependent on A.

const uppercaseAtom = atom((get) => get(textAtom).toUpperCase())
When you create the atom, the dependency will not be present. On first use, we run the read function and conclude that uppercaseAtom depends on textAtom. So uppercaseAtom is added to the dependents of textAtom. When we re-run the read function of uppercaseAtom (because its textAtom dependency is updated), the dependency is created again, which is the same in this case. We then remove stale dependents from textAtom and replace them with their latest versions.

Atoms can be created on demand
While the basic examples here show defining atoms globally outside components, there's no restrictions about where or when we can create an atom. As long as we remember that atoms are identified by their object referential identity, we can create them anytime.

If you create atoms in render functions, you would typically want to use a hook like useRef or useMemo for memoization. If not, the atom would be re-created each time the component renders.

You can create an atom and store it with useState or even in another atom. See an example in issue #5.

You can also cache atoms somewhere globally. See this example or that example.

Check atomFamily in utils for parameterized atoms.

useAtomValue
const countAtom = atom(0)

const Counter = () => {
  const setCount = useSetAtom(countAtom)
  const count = useAtomValue(countAtom)

  return (
    <>
      <div>count: {count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </>
  )
}
Similar to the useSetAtom hook, useAtomValue allows you to access a read-only atom. Nonetheless, it can also be used to access read-write atom's values.

useSetAtom
const switchAtom = atom(false)

const SetTrueButton = () => {
  const setCount = useSetAtom(switchAtom)
  const setTrue = () => setCount(true)

  return (
    <div>
      <button onClick={setTrue}>Set True</button>
    </div>
  )
}

const SetFalseButton = () => {
  const setCount = useSetAtom(switchAtom)
  const setFalse = () => setCount(false)

  return (
    <div>
      <button onClick={setFalse}>Set False</button>
    </div>
  )
}

export default function App() {
  const state = useAtomValue(switchAtom)

  return (
    <div>
      State: <b>{state.toString()}</b>
      <SetTrueButton />
      <SetFalseButton />
    </div>
  )
}
In case you need to update a value of an atom without reading it, you can use useSetAtom().

This is especially useful when the performance is a concern, as the const [, setValue] = useAtom(valueAtom) will cause unnecessary rerenders on each valueAtom update.

Navigated to JotaiJotai
