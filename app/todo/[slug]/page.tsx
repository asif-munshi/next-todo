import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Todo } from '@prisma/client'
import axios from 'axios'
import TodoDetails from './todo-details'

async function oneTodo(id: string) {
  const response = await axios.get(`/api/todo/${id}`)
  const todo = response.data as Todo
  return todo
}

export default async function TodoPage({
  params,
}: {
  params: { slug: string }
}) {
  const id = params.slug
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['onetodo', id],
    queryFn: () => oneTodo(id),
  })

  return (
    <div className="min-h-screen bg-[#DAE0E6] pt-12">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TodoDetails param={id} />
      </HydrationBoundary>
    </div>
  )
}
