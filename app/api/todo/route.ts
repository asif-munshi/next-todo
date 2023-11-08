import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createTodoSchema } from '@/lib/validationSchemas'

export async function POST(request: Request) {
  const body = await request.json()
  const validation = createTodoSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 })
  }

  try {
    const newTodo = await prisma.todo.create({
      data: { title: body.title, description: body.description },
    })

    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const allTodos = await prisma.todo.findMany()
    return NextResponse.json(allTodos, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
