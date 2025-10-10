import * as React from "react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label" 

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form
      className={cn(
        "flex flex-col gap-6 bg-white rounded-xl border border-gray-100 p-8 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entre na sua conta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Insira seu email e senha para continuar
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="joao@exemplo.com" required className="h-12 text-base" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              esqueceu sua senha?
            </a>
          </div>
          <Input id="password" type="password" required className="h-12 text-base" />
        </div>
        <Button type="submit"  className="w-full h-12 text-lg">
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Ou continue com seu número
          </span>
        </div>
        <Button variant="outline" className="items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" className="mr-2 h-4 w-4" fill="none">
            <path
              d="M8.003 0C3.582 0 0 3.582 0 8.003c0 4.42 3.582 8.002 8.003 8.002 4.42 0 8.002-3.582 8.002-8.002C16.005 3.582 12.423 0 8.003 0zm0 14.403a6.4 6.4 0 1 1 0-12.803 6.4 6.4 0 0 1 0 12.803zM5.338 11.49a1.2 1.2 0 0 1-.848-2.05l5.654-5.654a1.2 1.2 0 1 1 1.697 1.697L6.187 11.137a1.2 1.2 0 0 1-.849.353z"
              fill="currentColor"
            />
          </svg>
          Login com seu número
        </Button>
      </div>
      <div className="text-center text-sm">
        Não possui uma conta?{" "}
        <a href="#" className="underline underline-offset-4">
          Crie agora!
        </a>
      </div>
    </form>
  )
}
