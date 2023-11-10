'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Todo } from '@prisma/client'

async function allTodos() {
  const response = await axios.get('/api/todo')
  const todos = response.data as Todo[]
  return todos
}

async function deleteTodo(id: string) {
  return await axios.delete(`/api/todo/${id}`)
}

export default function ListTodos() {
  const { data } = useQuery({
    queryKey: ['todos'],
    queryFn: allTodos,
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  if (!data) return <div>Loading..</div>
  if (data.length == 0) return <div>No Todos</div>

  return (
    <>
      {data.map((todo) => {
        const createdAt = new Date(todo.createdAt).toLocaleDateString()
        return (
          <div
            key={todo.id}
            className="box-border w-[640px] rounded border border-[#ccc] bg-white p-2 hover:border-[#898989] xl:rounded"
          >
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex w-full flex-row items-center justify-start text-xs font-normal">
                <Link href={'/'}>
                  <Avatar className="mr-1 h-5 w-5 rounded-[50%]">
                    <AvatarImage
                      src="https://github.com/asif-munshi.png"
                      alt="@asif"
                    />
                    <AvatarFallback className="rounded-full bg-slate-600 text-white">
                      AM
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex h-full flex-row gap-2">
                  <Link href={'/'} className="hover:underline">
                    asif-munshi
                  </Link>
                  <div className="text-[#787C7E]">{createdAt.toString()}</div>
                </div>
              </div>
              <Link href={`/todo/${todo.id}`} className="flex flex-col pt-2">
                <div className="pr-[5px] text-lg font-medium leading-[22px] text-[#222]">
                  {todo.title}
                </div>
                <div className="pb-[10px] pt-[5px]">{todo.description}</div>
              </Link>
              <div>
                <Button
                  variant={'destructive'}
                  onClick={async () => await mutation.mutateAsync(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
