import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Get Todo by param
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  try {
    const oneTodo = await prisma.todo.findUnique({
      where: { id: id },
    })
    return NextResponse.json(oneTodo, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// Delete Todo by param
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  try {
    const deleteTodo = await prisma.todo.delete({
      where: { id: id },
    })

    return NextResponse.json(`${deleteTodo.id} has been successfully deleted`, {
      status: 200,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
