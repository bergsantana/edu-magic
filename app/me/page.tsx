"use client"
import { useUser } from "@/contexts/UserContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, Wand2 } from "lucide-react";
import Link from "next/link";

export default function MePage() { 

    const { user, logout}  = useUser()
    return (
        <div>
             <header className="border-b border-border bg-card px-6 py-4">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wand2 className="h-8 w-8 text-primary" />
                        <div>
                          <h1 className="text-2xl font-bold text-foreground">
                            EDUMAGIC — Criador de Atividades?
                          </h1>
                          <p className="text-sm text-muted-foreground">
                            Plataforma para gerar e personalizar atividades imprimíveis para
                            sala de aula.
                          </p>
                        </div>
                      </div>
            
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            <span>{user?.name || "Professor"}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <Link  href="/me" className="flex items-center gap-2">
                            Perfil
                            </Link>
                            </DropdownMenuItem>
                          <DropdownMenuItem>Configuração</DropdownMenuItem>
                          <DropdownMenuItem onClick={logout} className="text-red-600">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sair
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </header>

            {/* Navigation */}
            <div className="border-b border-border bg-card px-6 py-3">
                <div className="mx-auto flex max-w-7xl gap-3">
                    <Button variant="ghost" asChild>
                        <Link href="/activity-creator">Criar nova atividade</Link>
                    </Button>
                    <Button variant="ghost" disabled>Minhas atividades</Button>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Perfil
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-6 py-8">
                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <div className="bg-card border border-border rounded-lg shadow-sm p-8">
                            <h1 className="text-2xl font-bold text-foreground mb-6">Minha Conta</h1>
                            {user ? (
                                <div className="space-y-6">
                                    <div className="border-b border-border pb-4">
                                        <label className="text-sm font-medium text-muted-foreground block mb-2">
                                            Nome
                                        </label>
                                        <p className="text-lg text-foreground">{user.name}</p>
                                    </div>
                                    <div className="border-b border-border pb-4">
                                        <label className="text-sm font-medium text-muted-foreground block mb-2">
                                            Email
                                        </label>
                                        <p className="text-lg text-foreground">{user.email}</p>
                                    </div>
                                    <div className="pt-2">
                                        <label className="text-sm font-medium text-muted-foreground block mb-2">
                                            ID do Usuário
                                        </label>
                                        <p className="text-lg text-foreground font-mono">{user.id}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Carregando informações do usuário...
                                </p>
                            )}
                        </div>

                        {/* Past Activities Section */}
                        {user && (
                            <div className="w-full mt-6  ">
                                <div className="bg-card border border-border rounded-lg shadow-sm p-8">
                                    <h2 className="text-xl font-bold text-foreground mb-6">Atividades Geradas (Em breve) </h2>
                                    <div className="space-y-4">
                                        {/* Activity 1 - Word Search */}
                                        <div className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                            Caça-Palavras
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            5 de novembro, 2025
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-foreground mb-1">
                                                        Animais da Amazônia
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Ciências • 5º ano • 10 palavras
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" disabled>
                                                    Ver
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Activity 2 - Word Search */}
                                        <div className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                            Caça-Palavras
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            3 de novembro, 2025
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-foreground mb-1">
                                                        Sistema Solar
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Ciências • 5º ano • 8 palavras
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    Ver
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Activity 3 - Connect the Words */}
                                        <div className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                                            Ligar as Palavras
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            1 de novembro, 2025
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-foreground mb-1">
                                                        Verbos e Ações
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Português • 4º ano • 12 pares
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" disabled>
                                                    Ver
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Activity 4 - True or False */}
                                        <div className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                                                            Verdadeiro ou Falso
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            30 de outubro, 2025
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-foreground mb-1">
                                                        História do Brasil
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        História • 6º ano • 15 questões
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" disabled>
                                                    Ver
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}