'use client'

import { useQuery } from '@tanstack/react-query'
import { Todo } from '@prisma/client'
import axios from 'axios'

async function oneTodo(id: string) {
  const response = await axios.get(`/api/todo/${id}`)
  const todo = response.data as Todo
  return todo
}

export default function TodoDetails({ param }: { param: string }) {
  const id = param

  const { data } = useQuery({
    queryKey: ['onetodo', id],
    queryFn: () => oneTodo(id),
  })

  if (!data) return <div>Loading..</div>

  return (
    <div>
      <div className="pr-[5px] text-lg font-medium leading-[22px] text-[#222]">
        {data.title}
      </div>
      <div className="pb-[10px] pt-[5px]">{data.description}</div>
    </div>
  )
}
