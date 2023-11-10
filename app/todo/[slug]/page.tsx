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
      <div className="z-[3]">
        <div className="box-border flex max-w-full flex-row justify-center px-6 py-5">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="grid w-full grid-cols-1 place-items-center gap-[10px] xl:grid-cols-2 xl:gap-4">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <TodoDetails param={id} />
              </HydrationBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
