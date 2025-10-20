import { GalleryVerticalEnd } from "lucide-react"


import { LoginForm } from "../../src/components/login-form"
import Image from "next/image"


export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 gap-12">
      {/* Lado esquerdo – formulário */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Atos Capital.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <LoginForm />
          </div>
        </div>
      </div>


      {/* Lado direito – fundo marrom e logo sem blur */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#5E120F" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo-atos-branco.png"
            alt="Logo Atos"
            fill
            className="object-contain opacity-90 filter brightness-90"
          />
        </div>
      </div>
    </div>
  )
}
