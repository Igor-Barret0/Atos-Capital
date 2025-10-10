import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "../../src/components/login-form"
import Image from "next/image"
// import logo-atos from '../../public/logo-atos.png'


export default function LoginPage() {
  return (
  <div className="grid min-h-screen lg:grid-cols-2 gap-12">
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
      {/*Alterar fundo do lado direito ou qualquer outra coisa na div da direita*/}
      <div className="relative bg-gray-200 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
         <Image src="/logo-atos.png" alt="Logo Atos" fill className="object-contain opacity-50 filter brightness-90" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent" />
      </div>
    </div>
  )
}
