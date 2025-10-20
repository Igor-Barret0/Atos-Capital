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
        "flex flex-col gap-6 rounded-xl border p-8 shadow-sm",
        "bg-[#F8F5F3] border-[#E6DDD5] text-[#3B0B09]",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-[#3B0B09]">
          Entre na sua conta
        </h1>
        <p className="text-sm text-[#6D4C41]">
          Insira seu email e senha para continuar
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-[#6D4C41]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="joao@exemplo.com"
            required
            className="h-12 text-base border-[#E6DDD5] focus:border-[#7A1A15] focus:ring-[#7A1A15]"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-[#6D4C41]">
              Senha
            </Label>
            <a
              href="#"
              className="ml-auto text-sm text-[#D4AF37] hover:underline underline-offset-4"
            >
              esqueceu sua senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="h-12 text-base border-[#E6DDD5] focus:border-[#7A1A15] focus:ring-[#7A1A15]"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-lg bg-[#7A1A15] hover:bg-[#5E120F] text-white"
        >
          Login
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-[#E6DDD5]">
          <span className="relative z-10 bg-[#F8F5F3] px-2 text-[#6D4C41]">
            Ou continue com seu número
          </span>
        </div>

        <Button
          variant="outline"
          className="items-center justify-center border-[#E6DDD5] text-[#3B0B09] hover:bg-[#EFE7E2]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 16"
            className="mr-2 h-4 w-4"
            fill="none"
          >
            <path
              d="M8.003 0C3.582 0 0 3.582 0 8.003c0 4.42 3.582 8.002 8.003 8.002 4.42 0 8.002-3.582 8.002-8.002C16.005 3.582 12.423 0 8.003 0zm0 14.403a6.4 6.4 0 1 1 0-12.803 6.4 6.4 0 0 1 0 12.803zM5.338 11.49a1.2 1.2 0 0 1-.848-2.05l5.654-5.654a1.2 1.2 0 1 1 1.697 1.697L6.187 11.137a1.2 1.2 0 0 1-.849.353z"
              fill="currentColor"
            />
          </svg>
          Login com seu número
        </Button>
      </div>

      <div className="text-center text-sm text-[#6D4C41]">
        Não possui uma conta?{" "}
        <a href="#" className="underline underline-offset-4 text-[#D4AF37]">
          Crie agora!
        </a>
      </div>
    </form>
  )
}
