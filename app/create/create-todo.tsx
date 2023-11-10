'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { createTodoSchema } from '@/lib/validationSchemas'
import useTextarea from '@/hooks/useTextarea'

type TodoForm = z.infer<typeof createTodoSchema>

export default function CreateTodo() {
  return (
    <Tabs defaultValue="post" className="w-full">
      <TabsList className="grid h-[51px] w-full grid-cols-2 p-0">
        <TabsTrigger
          value="post"
          className={`flex h-full w-full items-center justify-center border-b-2 border-r border-b-transparent border-r-[#ccc] data-[state=active]:border-b-2 data-[state=active]:border-b-[#0079D3] data-[state=active]:text-[#0079D3]`}
        >
          Post
        </TabsTrigger>
        <TabsTrigger
          value="url"
          className={`flex h-full w-full items-center justify-center border-b-2 border-b-transparent data-[state=active]:border-b-2 data-[state=active]:border-b-[#0079D3] data-[state=active]:text-[#0079D3]`}
        >
          Url
        </TabsTrigger>
      </TabsList>
      <TabsContent value="post">
        <PostForm />
      </TabsContent>
      <TabsContent value="url">
        <UrlForm />
      </TabsContent>
    </Tabs>
  )
}

//fix any
const createTodo = async (data: any) => {
  const response = await axios.post('/api/todo', data)
  return response.data
}

const PostForm = () => {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TodoForm>({
    resolver: zodResolver(createTodoSchema),
  })
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      router.push('/')
    },
  })

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="rounded border-none">
          <CardContent className="space-y-2 pt-4">
            <div>
              <Textarea
                maxLength={300}
                rows={1}
                placeholder="Title"
                className="box-border block min-h-[39px] w-full resize-none overflow-hidden overflow-x-hidden break-words rounded pr-[68px] text-[#1c1c1c] focus-visible:border focus-visible:border-[#1A1A1B] focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register('title')}
              />
            </div>
            <div className="space-y-1">
              <Textarea
                maxLength={3000}
                placeholder="Description (optional)"
                className="box-border block min-h-[122px] w-full overflow-hidden break-words rounded text-[#1c1c1c] focus-visible:border focus-visible:border-[#1A1A1B] focus-visible:ring-0 focus-visible:ring-offset-0"
                {...register('description')}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button
              variant={'primary'}
              className="h-8 rounded-full text-sm font-bold"
              disabled={isSubmitting}
            >
              Todo
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  )
}

const UrlForm = () => {
  const { titleRef, descriptionRef } = useTextarea()

  return (
    <Card className="rounded border-none">
      <CardContent className="space-y-2 pt-4">
        <div>
          <Textarea
            maxLength={300}
            rows={1}
            placeholder="Title"
            ref={titleRef}
            className="box-border block min-h-[39px] w-full resize-none overflow-hidden overflow-x-hidden break-words rounded pr-[68px] text-[#1c1c1c] focus-visible:border focus-visible:border-[#1A1A1B] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="space-y-1">
          <Textarea
            maxLength={500}
            placeholder="Url"
            ref={descriptionRef}
            className="box-border block min-h-[66px] w-full overflow-hidden break-words rounded text-[#1c1c1c] focus-visible:border focus-visible:border-[#1A1A1B] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          variant={'primary'}
          className="h-8 rounded-full text-sm font-bold"
        >
          Todo
        </Button>
      </CardFooter>
    </Card>
  )
}
