// rootMiddleware.ts (ngang package.json)
import { middleware } from "./src/middleware";
import { NextRequest } from "next/server";

export function rootMiddleware(request: NextRequest) {
  return middleware(request);
}

export const config = {
  matcher: ["/((?!dang-nhap|_next/static|favicon.ico|public).*)"],
};
