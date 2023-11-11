'use client'

import { useQuery } from '@tanstack/react-query'
import { Todo } from '@prisma/client'
import { MenuSquareIcon, XIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import Link from 'next/link'

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

  const createdAt = new Date(data.createdAt).toLocaleDateString()

  return (
    <div className="flex h-full flex-col items-center justify-start">
      <div className="sticky left-0 right-0 top-0 h-12 w-[calc(100%-10rem)] max-w-7xl bg-[#030303]">
        <div className="m-auto flex h-full w-full max-w-[1128px] items-center px-8">
          <div className="flex w-full max-w-[calc(100%-324px)] flex-shrink flex-grow basis-0 items-center">
            <MenuSquareIcon
              color="#d7dadc"
              height={20}
              width={20}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="butt"
              className="mr-2"
            />
            <div className="inline-flex min-w-0 text-sm font-medium leading-[18px]">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap pr-[5px] text-[#D7DADC]">
                <p>{data.title}</p>
              </div>
            </div>
          </div>
          {/* RightSide */}
          <div className="ml-3 flex w-[312px] justify-end text-xs font-bold leading-4">
            <button
              className="relative box-border flex min-h-[24px] w-auto min-w-[24px] items-center justify-center rounded-full border border-transparent px-[8px] py-[4px] text-center text-xs font-bold hover:opacity-90"
              onClick={() => window.history.back()}
            >
              <XIcon color="#d7dadc" height={20} width={20} />
              <span className="text-[#D7DADC]">Close</span>
            </button>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="relative mx-auto flex w-[calc(100%-10rem)] max-w-7xl justify-center pb-8">
        <div className="my-8 ml-8 mr-3 min-h-screen min-w-0 max-w-full flex-shrink flex-grow basis-0 break-words lg:max-w-[740px]">
          <div className="break-words rounded border border-[#EDEFF1] bg-[#FFF]">
            {/* Todo Details */}
            <div className="flex flex-col gap-2 p-2 pt-2">
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
              <div className="flex flex-col pt-2">
                <div className="pr-[5px] text-lg font-medium leading-[22px] text-[#222]">
                  {data.title}
                </div>
                <div className="pb-[10px] pt-[5px]">{data.description}</div>
              </div>
              <div>
                <div>Bottom</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
