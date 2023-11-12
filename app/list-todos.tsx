'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  CheckSquare2,
  MoreHorizontal,
  Pencil,
  Square,
  Trash,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import axios from 'axios'
import React from 'react'
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

        const handleEditTodo = () => console.log('Edit Todo')
        const handleDelete = async () => await mutation.mutateAsync(todo.id)
        const handleMarkAsDone = () => console.log('Mark as Done')
        return (
          <div
            key={todo.id}
            className="box-border w-[640px] rounded border border-[#ccc] bg-white p-2 hover:border-[#898989] xl:rounded"
          >
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex w-full items-center justify-between">
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
                <DropdownMenuCard
                  handleEditTodo={handleEditTodo}
                  handleDelete={handleDelete}
                  handleMarkAsDone={handleMarkAsDone}
                />
              </div>
              <Link href={`/todo/${todo.id}`} className="flex flex-col pt-2">
                <div className="pr-[5px] text-lg font-medium leading-[22px] text-[#222]">
                  {todo.title}
                </div>
                <div className="pb-[10px] pt-[5px]">{todo.description}</div>
              </Link>
            </div>
          </div>
        )
      })}
    </>
  )
}

type ButtonProps = {
  handleEditTodo: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  handleDelete: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  handleMarkAsDone: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void
}

export function DropdownMenuCard({
  handleEditTodo,
  handleDelete,
  handleMarkAsDone,
}: ButtonProps) {
  const cardItems = [
    {
      text: 'Edit Todo',
      icon: <Pencil className="h-[18px] w-[25px]" />,
      handleClick: handleEditTodo,
    },
    {
      text: 'Delete',
      icon: <Trash className="h-[18px] w-[25px]" />,
      handleClick: handleDelete,
    },
    {
      text: 'Mark as Done',
      icon: <Square className="h-[18px] w-[25px]" />,
      handleClick: handleMarkAsDone,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-6 rounded-sm p-0 px-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <MoreHorizontal className="h-5 w-5 text-[#878A8C]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-sm p-0">
        {cardItems.map((item) => (
          <DropdownMenuItem
            key={item.text}
            className="border-b border-b-gray-200 p-2 text-sm font-medium capitalize text-[#878A8C] last:border-b-0 hover:cursor-pointer hover:bg-[#e9f5fd] hover:text-[#1c1c1c] focus:bg-[#e9f5fd]"
            onClick={item.handleClick}
          >
            <div className="mr-[6px] flex h-6 w-5 items-center">
              {item.icon}
            </div>
            <span>{item.text}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
