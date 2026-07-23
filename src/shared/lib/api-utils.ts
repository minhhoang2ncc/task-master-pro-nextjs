import { NextResponse } from 'next/server'

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export function errorResponse(error: any, defaultMessage: string, status = 500) {
  return NextResponse.json(
    { error: error?.message ?? (typeof error === 'string' ? error : defaultMessage) },
    { status }
  )
}

export async function parseJson(req: Request) {
  try {
    return await req.json()
  } catch {
    return null
  }
}
