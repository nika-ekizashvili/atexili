import { NextResponse } from "next/server";
import { getSessionUser } from "./auth";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const error = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

/** Auth guard for route handlers. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  return user;
}

/** Wraps a handler so `throw`n Responses (auth) and errors become JSON. */
export function handler<T extends unknown[]>(
  fn: (...args: T) => Promise<NextResponse>,
): (...args: T) => Promise<NextResponse | Response> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof Response) return e;
      console.error(e);
      return error("internal error", 500);
    }
  };
}
