import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Todo } from '@prisma/client'
import axios from 'axios'
import SubHeader from '@/components/SubHeader/SubHeader'
import ListTodos from './list-todos'

async function allTodos() {
  const response = await axios.get('/api/todo')
  const todos = response.data as Todo[]
  return todos
}

export default async function Home() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: allTodos,
  })

  return (
    <main className="min-h-screen bg-[#DAE0E6] pt-12">
      <div className="z-[3]">
        <div className="box-border flex max-w-full flex-row justify-center px-6 py-5">
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <SubHeader />
            <div className="grid w-full grid-cols-1 place-items-center gap-[10px] xl:grid-cols-2 xl:gap-4">
              <HydrationBoundary state={dehydrate(queryClient)}>
                <ListTodos />
              </HydrationBoundary>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
