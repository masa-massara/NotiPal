Jotai
状態
Primitive and flexible state management for React
Query
TanStack Query provides a set of functions for managing async state (typically external data).

From the Overview docs:

React Query is often described as the missing data-fetching library for React, but in more technical terms, it makes fetching, caching, synchronizing and updating server state in your React applications a breeze.

jotai-tanstack-query is a Jotai extension library for TanStack Query. It provides a wonderful interface with all of the TanStack Query features, providing you the ability to use those features in combination with your existing Jotai state.

Support
jotai-tanstack-query currently supports TanStack Query v5.

Install
In addition to jotai, you have to install jotai-tanstack-query and @tanstack/query-core to use the extension.

npm install jotai-tanstack-query @tanstack/query-core
Incremental Adoption
You can incrementally adopt jotai-tanstack-query in your app. It's not an all or nothing solution. You just have to ensure you are using the same QueryClient instance. QueryClient Setup.

// existing useQueryHook
const { data, isPending, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodoList,
})

// jotai-tanstack-query
const todosAtom = atomWithQuery(() => ({
  queryKey: ['todos'],
}))

const [{ data, isPending, isError }] = useAtom(todosAtom)
Exported functions
atomWithQuery for useQuery
atomWithInfiniteQuery for useInfiniteQuery
atomWithMutation for useMutation
atomWithSuspenseQuery for useSuspenseQuery
atomWithSuspenseInfiniteQuery for useSuspenseInfiniteQuery
atomWithMutationState for useMutationState
All functions follow the same signature.

const dataAtom = atomWithSomething(getOptions, getQueryClient)
The first getOptions parameter is a function that returns an input to the observer. The second optional getQueryClient parameter is a function that return QueryClient.

atomWithQuery usage
atomWithQuery creates a new atom that implements a standard Query from TanStack Query.

import { atom, useAtom } from 'jotai'
import { atomWithQuery } from 'jotai-tanstack-query'

const idAtom = atom(1)
const userAtom = atomWithQuery((get) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json()
  },
}))

const UserData = () => {
  const [{ data, isPending, isError }] = useAtom(userAtom)

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return <div>{JSON.stringify(data)}</div>
}
atomWithInfiniteQuery usage
atomWithInfiniteQuery is very similar to atomWithQuery, however it is for an InfiniteQuery, which is used for data that is meant to be paginated. You can read more about Infinite Queries here.

Rendering lists that can additively "load more" data onto an existing set of data or "infinite scroll" is also a very common UI pattern. React Query supports a useful version of useQuery called useInfiniteQuery for querying these types of lists.

A notable difference between a standard query atom is the additional option getNextPageParam and getPreviousPageParam, which is what you'll use to instruct the query on how to fetch any additional pages.

import { atom, useAtom } from 'jotai'
import { atomWithInfiniteQuery } from 'jotai-tanstack-query'

const postsAtom = atomWithInfiniteQuery(() => ({
  queryKey: ['posts'],
  queryFn: async ({ pageParam }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}`)
    return res.json()
  },
  getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
  initialPageParam: 1,
}))

const Posts = () => {
  const [{ data, fetchNextPage, isPending, isError, isFetching }] =
    useAtom(postsAtom)

  if (isPending) return <div>Loading...</div>
  if (isError) return <div>Error</div>

  return (
    <>
      {data.pages.map((page, index) => (
        <div key={index}>
          {page.map((post: any) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      <button onClick={() => fetchNextPage()}>Next</button>
    </>
  )
}
atomWithMutation usage
atomWithMutation creates a new atom that implements a standard Mutation from TanStack Query.

Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects.

const postAtom = atomWithMutation(() => ({
  mutationKey: ['posts'],
  mutationFn: async ({ title }: { title: string }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body: 'body',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    const data = await res.json()
    return data
  },
}))

const Posts = () => {
  const [{ mutate, status }] = useAtom(postAtom)
  return (
    <div>
      <button onClick={() => mutate({ title: 'foo' })}>Click me</button>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </div>
  )
}
atomWithMutationState usage
atomWithMutationState creates a new atom that gives you access to all mutations in the MutationCache.

const mutationStateAtom = atomWithMutationState((get) => ({
  filters: {
    mutationKey: ['posts'],
  },
}))
Suspense
jotai-tanstack-query can also be used with React's Suspense.

atomWithSuspenseQuery usage
import { atom, useAtom } from 'jotai'
import { atomWithSuspenseQuery } from 'jotai-tanstack-query'

const idAtom = atom(1)
const userAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['users', get(idAtom)],
  queryFn: async ({ queryKey: [, id] }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    return res.json()
  },
}))

const UserData = () => {
  const [{ data }] = useAtom(userAtom)

  return <div>{JSON.stringify(data)}</div>
}
atomWithSuspenseInfiniteQuery usage
import { atom, useAtom } from 'jotai'
import { atomWithSuspenseInfiniteQuery } from 'jotai-tanstack-query'

const postsAtom = atomWithSuspenseInfiniteQuery(() => ({
  queryKey: ['posts'],
  queryFn: async ({ pageParam }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}`)
    return res.json()
  },
  getNextPageParam: (lastPage, allPages, lastPageParam) => lastPageParam + 1,
  initialPageParam: 1,
}))

const Posts = () => {
  const [{ data, fetchNextPage, isPending, isError, isFetching }] =
    useAtom(postsAtom)

  return (
    <>
      {data.pages.map((page, index) => (
        <div key={index}>
          {page.map((post: any) => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      <button onClick={() => fetchNextPage()}>Next</button>
    </>
  )
}
Referencing the same instance of Query Client in your project
Perhaps you have some custom hooks in your project that utilises the useQueryClient() hook to obtain the QueryClient object and call its methods.

To ensure that you reference the same QueryClient object, be sure to wrap the root of your project in a <Provider> and initialise queryClientAtom with the same queryClient value you provided to QueryClientProvider.

Without this step, useQueryAtom will reference a separate QueryClient from any hooks that utilise the useQueryClient() hook to get the queryClient.

Alternatively, you can specify your queryClient with getQueryClient parameter.

Example
In the example below, we have a mutation hook, useTodoMutation and a query todosAtom.

We included an initialisation step in our root <App> node.

Although they reference methods same query key ('todos'), the onSuccess invalidation in useTodoMutation will not trigger if the Provider initialisation step was not done.

This will result in todosAtom showing stale data as it was not prompted to refetch.

⚠️ Note: When using Typescript, it is recommended to use a Map when passing the queryClient value to useHydrateAtoms. You can find a working example in the Initializing State on Render docs

import { Provider } from 'jotai/react'
import { useHydrateAtoms } from 'jotai/react/utils'
import {
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { atomWithQuery, queryClientAtom } from 'jotai-tanstack-query'

const queryClient = new QueryClient()

const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return children
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        {/*
   This Provider initialisation step is needed so that we reference the same
   queryClient in both atomWithQuery and other parts of the app. Without this,
   our useQueryClient() hook will return a different QueryClient object
    */}
        <HydrateAtoms>
          <App />
        </HydrateAtoms>
      </Provider>
    </QueryClientProvider>
  )
}

export const todosAtom = atomWithQuery((get) => {
  return {
    queryKey: ['todos'],
    queryFn: () => fetch('/todos'),
  }
})

export const useTodoMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(
    async (body: todo) => {
      await fetch('/todo', { Method: 'POST', Body: body })
    },
    {
      onSuccess: () => {
        void queryClient.invalidateQueries(['todos'])
      },
      onError,
    }
  )
}
SSR support
All atoms can be used within the context of a server side rendered app, such as a next.js app or Gatsby app. You can use both options that React Query supports for use within SSR apps, hydration or initialData.

Error handling
Fetch error will be thrown and can be caught with ErrorBoundary. Refetching may recover from a temporary error.

See a working example to learn more.

Devtools
In order to use the Devtools, you need to install it additionally.

npm install @tanstack/react-query-devtools
All you have to do is put the <ReactQueryDevtools /> within <QueryClientProvider />.

import {
  QueryClientProvider,
  QueryClient,
  QueryCache,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClientAtom } from 'jotai-tanstack-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return children
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <HydrateAtoms>
          <App />
        </HydrateAtoms>
      </Provider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
Migrate to v0.8.0
Change in atom signature
All atom signatures have changed to be more consistent with TanStack Query. v0.8.0 returns only a single atom, instead of a tuple of atoms, and hence the name change from atomsWithSomething toatomWithSomething.

- const [dataAtom, statusAtom] = atomsWithSomething(getOptions, getQueryClient)
+ const dataAtom = atomWithSomething(getOptions, getQueryClient)
Simplified Return Structure
In the previous version of jotai-tanstack-query, the query atoms atomsWithQuery and atomsWithInfiniteQuery returned a tuple of atoms: [dataAtom, statusAtom]. This design separated the data and its status into two different atoms.

atomWithQuery and atomWithInfiniteQuery
dataAtom was used to access the actual data (TData).
statusAtom provided the status object (QueryObserverResult<TData, TError>), which included additional attributes like isPending, isError, etc.
In v0.8.0, they have been replaced by atomWithQuery and atomWithInfiniteQuery to return only a single dataAtom. This dataAtom now directly provides the QueryObserverResult<TData, TError>, aligning it closely with the behavior of Tanstack Query's bindings.

To migrate to the new version, replace the separate dataAtom and statusAtom usage with the unified dataAtom that now contains both data and status information.

- const [dataAtom, statusAtom] = atomsWithQuery(/* ... */);
- const [data] = useAtom(dataAtom);
- const [status] = useAtom(statusAtom);

+ const dataAtom = atomWithQuery(/* ... */);
+ const [{ data, isPending, isError }] = useAtom(dataAtom);
atomWithMutation
Similar to atomsWithQuery and atomsWithInfiniteQuery, atomWithMutation also returns a single atom instead of a tuple of atoms. The return type of the atom value is MutationObserverResult<TData, TError, TVariables, TContext>.

- const [, postAtom] = atomsWithMutation(/* ... */);
- const [post, mutate] = useAtom(postAtom); // Accessing mutation status from post; and mutate() to execute the mutation

+ const postAtom = atomWithMutation(/* ... */);
+ const [{ data, error, mutate }] = useAtom(postAtom); // Accessing mutation result and mutate method from the same atom
Examples
Basic demo

Devtools demo

Hackernews

