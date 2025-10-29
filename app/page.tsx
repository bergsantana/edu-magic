import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-orange-500 text-2xl">✨</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              EDUMAGIC — Criador de Atividades
            </h1>
            <p className="text-sm text-gray-600">
              Plataforma para gerar e personalizar atividades imprimíveis para sala de aula.
            </p>
          </div>
        </div>
        
        <Button 
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full"
        >
          <Link href="/auth/login">Login</Link>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
          Crie e personalize atividades imprimíveis com magia ✨
        </h1>
        
        <p className="text-lg text-gray-600 mb-12 max-w-2xl leading-relaxed">
          A EduMagic é a sua plataforma inteligente para professores que desejam preparar
          atividades exclusivas, interativas e prontas para sala de aula. Simples, rápida e
          elegante.
        </p>
        
        <Button 
          asChild
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/activity-creator">Começar agora</Link>
        </Button>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-500 max-w-7xl mx-auto">
        © 2025 EduMagic - Todos os direitos reservados.
      </footer>
    </div>
  )
}
