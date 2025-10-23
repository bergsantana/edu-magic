"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wand2, User, Loader2 } from "lucide-react"
// Import React Markdown for rendering markdown content
import ReactMarkdown from 'react-markdown'
import jsPDF from 'jspdf'

export function ActivityCreator() {
  const [formData, setFormData] = useState({
    escola: false,
    nome: false,
    professor: false,
    disciplina: false,
    serie: false,
    ano: false,
    sala: false,
    turno: false,
    disciplinaValue: "portugues",
    serieValue: "5",
    tema: "",
    dificuldade: "facil",
    numItens: "10",
    tipoAtividade: "questionario",
  })

  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [wordSearchData, setWordSearchData] = useState<{grid: string[][]; wordList: string[]} | null>(null)
  const [isGeneratingWordSearch, setIsGeneratingWordSearch] = useState(false)

  const generateWordSearchPDF = () => {
    if (!wordSearchData) return

    const disciplinaNames = {
      portugues: 'Português',
      matematica: 'Matemática',
      ciencias: 'Ciências',
      historia: 'História',
      geografia: 'Geografia',
      ingles: 'Inglês'
    }

    const dificuldadeNames = {
      facil: 'Fácil',
      medio: 'Médio',
      dificil: 'Difícil'
    }

    // Create new PDF document
    const doc = new jsPDF()
    let yPosition = 20

    // Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`CAÇA-PALAVRAS - ${formData.tema.toUpperCase()}`, 20, yPosition)
    yPosition += 15

    // Form information
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Disciplina: ${disciplinaNames[formData.disciplinaValue as keyof typeof disciplinaNames]}`, 20, yPosition)
    yPosition += 6
    doc.text(`Série/Ano: ${formData.serieValue}º ano`, 20, yPosition)
    yPosition += 6
    doc.text(`Tema: ${formData.tema}`, 20, yPosition)
    yPosition += 6
    doc.text(`Dificuldade: ${dificuldadeNames[formData.dificuldade as keyof typeof dificuldadeNames]}`, 20, yPosition)
    yPosition += 10

    // Add selected header fields
    const cabecalhoFields = Object.entries(formData)
      .filter(([key, value]) => 
        ['escola', 'nome', 'professor', 'disciplina', 'serie', 'ano', 'sala', 'turno'].includes(key) && value
      )

    if (cabecalhoFields.length > 0) {
      cabecalhoFields.forEach(([key, _]) => {
        const labels = {
          escola: 'Escola',
          nome: 'Nome',
          professor: 'Professor(a)',
          disciplina: 'Disciplina',
          serie: 'Série',
          ano: 'Ano',
          sala: 'Sala',
          turno: 'Turno'
        }
        doc.text(`${labels[key as keyof typeof labels]}: _________________`, 20, yPosition)
        yPosition += 6
      })
      yPosition += 5
    }

    // Instructions
    doc.setFont('helvetica', 'bold')
    doc.text('INSTRUÇÕES:', 20, yPosition)
    yPosition += 6
    doc.setFont('helvetica', 'normal')
    doc.text('Encontre as palavras escondidas na grade abaixo. As palavras podem estar', 20, yPosition)
    yPosition += 6
    doc.text('na horizontal, vertical ou diagonal.', 20, yPosition)
    yPosition += 15

    // Grid title
    doc.setFont('helvetica', 'bold')
    doc.text('CAÇA-PALAVRAS:', 20, yPosition)
    yPosition += 10

    // Add the grid with monospace font
    doc.setFont('courier', 'normal')
    doc.setFontSize(8)
    
    const gridLines = formatWordSearchGrid(wordSearchData.grid).split('\n')
    gridLines.forEach((line, index) => {
      if (line.trim() && yPosition < 280) { // Check if we have space on the page
        doc.text(line, 20, yPosition)
        yPosition += 4
      }
    })

    // Word list
    yPosition += 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('PALAVRAS PARA ENCONTRAR:', 20, yPosition)
    yPosition += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    
    // Split words into two columns
    const wordsPerColumn = Math.ceil(wordSearchData.wordList.length / 2)
    wordSearchData.wordList.forEach((word, index) => {
      const xPosition = index < wordsPerColumn ? 20 : 120
      const yOffset = index < wordsPerColumn ? index : index - wordsPerColumn
      
      if (yPosition + (yOffset * 6) < 280) {
        doc.text(`${index + 1}. ${word.toUpperCase()}`, xPosition, yPosition + (yOffset * 6))
      }
    })

    // Save the PDF
    doc.save(`caca-palavras-${formData.tema.toLowerCase().replace(/\s+/g, '-')}.pdf`)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Criar prompt personalizado baseado nos dados do formulário
      const cabecalhoText = Object.entries(formData)
        .filter(([key, value]) => 
          ['escola', 'nome', 'professor', 'disciplina', 'serie', 'ano', 'sala', 'turno'].includes(key) && value
        )
        .map(([key, _]) => {
          const labels = {
            escola: 'Escola',
            nome: 'Nome',
            professor: 'Professor(a)',
            disciplina: 'Disciplina',
            serie: 'Série',
            ano: 'Ano',
            sala: 'Sala',
            turno: 'Turno'
          }
          return `${labels[key as keyof typeof labels]}: _________________`
        })
        .join('\n')

      const disciplinaNames = {
        portugues: 'Português',
        matematica: 'Matemática',
        ciencias: 'Ciências',
        historia: 'História',
        geografia: 'Geografia',
        ingles: 'Inglês'
      }

      const dificuldadeNames = {
        facil: 'fácil',
        medio: 'médio',
        dificil: 'difícil'
      }

      const tipoAtividadePrompts = {
        questionario: `A atividade deve ser um questionário adequado para alunos do ${formData.serieValue}º ano do ensino fundamental e incluir:
1. Instruções claras para os alunos EM PORTUGUÊS BRASILEIRO
2. ${formData.numItens} questões variadas e interessantes sobre o tema
3. Espaço adequado para as respostas entre as perguntas (deixe 2-3 linhas em branco após cada questão)
4. Para questões de múltipla escolha, forneça alternativas com caixas de seleção: 
   [ ] a) opção  \
   [ ] b) opção  \
   [ ] c) opção  \
   etc.
5. Para questões abertas, adicione múltiplas linhas pontilhadas ou espaços para respostas: 
   Resposta: _____________________________________________  \
   .______________________________________________________  \
   .______________________________________________________  \

6. Linguagem apropriada para a faixa etária EM PORTUGUÊS BRASILEIRO
7. Varie os tipos de questões: múltipla escolha, verdadeiro/falso, completar, dissertativas

IMPORTANTE: Todo o conteúdo deve ser escrito em PORTUGUÊS BRASILEIRO. Para quebras de linha no markdown, use dois espaços no final de cada linha ou linha em branco entre parágrafos. Entre cada questão, deixe pelo menos uma linha em branco para espaçamento adequado.

Formate o conteúdo usando Markdown para melhor apresentação. Use cabeçalhos (##), listas numeradas (1., 2., etc), negrito (**texto**) e outros elementos de formatação para organizar o conteúdo. Deixe espaçamento adequado entre as questões para facilitar a escrita das respostas.`,
        cacapalavras: `A atividade deve ser um caça-palavras adequado para alunos do ${formData.serieValue}º ano do ensino fundamental e incluir:
1. Instruções claras para os alunos EM PORTUGUÊS BRASILEIRO
2. Uma grade quadrada OBRIGATORIAMENTE NxN, onde N é EXATAMENTE o número de letras da maior palavra a ser encontrada
3. TODAS as linhas da grade devem ter EXATAMENTE a mesma quantidade de letras (N letras por linha)
4. TODAS as colunas da grade devem ter EXATAMENTE a mesma quantidade de letras (N letras por coluna)
5. Lista de ${formData.numItens} palavras para encontrar, todas relacionadas ao tema "${formData.tema}" EM PORTUGUÊS BRASILEIRO
6. As palavras podem estar na horizontal, vertical ou diagonal (incluindo diagonais inversas)
7. Preencha os espaços vazios da grade com letras aleatórias para dificultar a busca
8. Nível de complexidade ${dificuldadeNames[formData.dificuldade as keyof typeof dificuldadeNames]} para a faixa etária
9. Coloque as palavras estrategicamente na grade, garantindo que todas caibam dentro das dimensões NxN

REGRAS OBRIGATÓRIAS PARA A GRADE:
- Se a maior palavra tiver 8 letras, crie uma grade 8x8 (8 linhas com 8 letras cada)
- Se a maior palavra tiver 10 letras, crie uma grade 10x10 (10 linhas com 10 letras cada)
- Use letras maiúsculas e espaçamento adequado entre as letras
- NUNCA faça linhas com tamanhos diferentes
- A grade deve ser perfeitamente quadrada (mesmo número de linhas e colunas)

IMPORTANTE: Todo o conteúdo deve ser escrito em PORTUGUÊS BRASILEIRO. Use blocos de código com fonte monospace para a grade.

Formate o conteúdo usando Markdown para melhor apresentação. Use cabeçalhos (##), listas numeradas (1., 2., etc), negrito (**texto**) e outros elementos de formatação para organizar o conteúdo. Para o caça-palavras, use blocos de código com fonte monospace (\`\`\`).`
      }

      const prompt = `Você é um professor experiente do ensino fundamental. Crie uma atividade educativa com as seguintes especificações:

- Disciplina: ${disciplinaNames[formData.disciplinaValue as keyof typeof disciplinaNames]}
- Série/Ano: ${formData.serieValue}º ano
- Tema: ${formData.tema}
- Nível de dificuldade: ${dificuldadeNames[formData.dificuldade as keyof typeof dificuldadeNames]}
- Tipo de atividade: ${formData.tipoAtividade === 'questionario' ? 'Questionário' : 'Caça-palavras'}

${cabecalhoText ? `Inclua este cabeçalho no início da atividade:\n${cabecalhoText}\n` : ''}

${tipoAtividadePrompts[formData.tipoAtividade as keyof typeof tipoAtividadePrompts]}

Formate a atividade como um documento em markdown.`

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 2000
          }
        }),
      })

      const data = await response.json()
      setGeneratedContent(data.response)
    } catch (error) {
      console.error("[v0] Error generating activity:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClear = () => {
    setFormData({
      escola: false,
      nome: false,
      professor: false,
      disciplina: false,
      serie: false,
      ano: false,
      sala: false,
      turno: false,
      disciplinaValue: "portugues",
      serieValue: "5",
      tema: "",
      dificuldade: "facil",
      numItens: "10",
      tipoAtividade: "questionario",
    })
    setGeneratedContent("")
    setWordSearchData(null)
  }

  const generateWordSearch = async () => {
    if (!formData.tema) return
    
    setIsGeneratingWordSearch(true)
    try {
      const wordSearchPrompt = `
        Gere um array de ${formData.numItens} palavras sobre ${formData.tema} em português brasileiro neste formato: ["exemplo1", "exemplo2", "exemplo3"].
        Cada item do array deve conter apenas uma palavra relacionada ao tema.
        As palavras devem ser adequadas para alunos do ${formData.serieValue}º ano.
        Retorne apenas o array JSON na sua resposta, sem texto adicional.
      `

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: wordSearchPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 500
          }
        }),
      })

      const data = await response.json()
      
      try {
        // Parse the JSON response to get the words array
        const words = JSON.parse(data.response.trim())
        
        if (Array.isArray(words)) {
          // Calculate grid size based on longest word
          const maxWordLength = Math.max(...words.map(word => word.length))
          const gridSize = Math.max(maxWordLength, 10) // Minimum 10x10 grid
          
          // Generate the word search grid
          const { grid, wordList } = generateWordSearchGrid(words, gridSize)
          setWordSearchData({ grid, wordList })
        }
      } catch (parseError) {
        console.error("Error parsing words from response:", parseError)
        // Fallback to default words if parsing fails
        const fallbackWords = ["ESCOLA", "ESTUDO", "LIVRO", "APRENDER", formData.tema.toUpperCase()]
        const maxWordLength = Math.max(...fallbackWords.map(word => word.length))
        const gridSize = Math.max(maxWordLength, 10)
        const { grid, wordList } = generateWordSearchGrid(fallbackWords, gridSize)
        setWordSearchData({ grid, wordList })
      }
    } catch (error) {
      console.error("Error generating word search:", error)
    } finally {
      setIsGeneratingWordSearch(false)
    }
  }

function generateWordSearchGrid(words: string[], size = 15): { grid: string[][]; wordList: string[] } {
  const grid: string[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(""))
  const placedWords: string[] = []

  // Directions: horizontal, vertical, diagonal (down-right)
  const directions = [
    { dx: 0, dy: 1 }, // horizontal
    { dx: 1, dy: 0 }, // vertical
    { dx: 1, dy: 1 }, // diagonal
  ]

  // Try to place each word
  for (const word of words) {
    const cleanWord = word.replace(/\s+/g, "").toUpperCase()
    let placed = false
    let attempts = 0

    while (!placed && attempts < 100) {
      const direction = directions[Math.floor(Math.random() * directions.length)]
      const startX = Math.floor(Math.random() * size)
      const startY = Math.floor(Math.random() * size)

      // Check if word fits
      const endX = startX + direction.dx * (cleanWord.length - 1)
      const endY = startY + direction.dy * (cleanWord.length - 1)

      if (endX >= 0 && endX < size && endY >= 0 && endY < size) {
        // Check if spaces are empty or match
        let canPlace = true
        for (let i = 0; i < cleanWord.length; i++) {
          const x = startX + direction.dx * i
          const y = startY + direction.dy * i
          if (grid[x][y] !== "" && grid[x][y] !== cleanWord[i]) {
            canPlace = false
            break
          }
        }

        if (canPlace) {
          // Place the word
          for (let i = 0; i < cleanWord.length; i++) {
            const x = startX + direction.dx * i
            const y = startY + direction.dy * i
            grid[x][y] = cleanWord[i]
          }
          placedWords.push(word)
          placed = true
        }
      }
      attempts++
    }
  }

  // Fill empty spaces with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] === "") {
        grid[i][j] = letters[Math.floor(Math.random() * letters.length)]
      }
    }
  }

  return { grid, wordList: placedWords }
}

function formatWordSearchGrid(grid: string[][]): string {
  let result = ""

  // Add column numbers
  result += "    "
  for (let i = 0; i < grid[0].length; i++) {
    result += `${(i + 1).toString().padStart(2, " ")} `
  }
  result += "\n"

  // Add rows with row numbers
  for (let i = 0; i < grid.length; i++) {
    result += `${(i + 1).toString().padStart(2, " ")}  `
    result += grid[i].join("  ")
    result += "\n"
  }

  return result
}


  // Generate formatted grid text from word search data
  const gridText = wordSearchData ? formatWordSearchGrid(wordSearchData.grid) : ""

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Wand2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">EDUMAGIC — Criador de Atividades?</h1>
              <p className="text-sm text-muted-foreground">
                Plataforma para gerar e personalizar atividades imprimíveis para sala de aula.
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Professor</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuração</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b border-border bg-card px-6 py-3">
        <div className="mx-auto flex max-w-7xl gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Criar nova atividade</Button>
          <Button variant="ghost">Minhas atividades</Button>
          <Button variant="ghost">Ajuda rápida</Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
          {/* Form Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Formulário inicial</h2>

              {/* Document Header Checkboxes */}
              <div className="mb-6">
                <Label className="mb-3 block text-sm font-medium">Cabeçalho do documento</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { id: "escola", label: "Escola" },
                    { id: "nome", label: "Nome" },
                    { id: "professor", label: "Professor" },
                    { id: "disciplina", label: "Disciplina" },
                    { id: "serie", label: "Série" },
                    { id: "ano", label: "Ano" },
                    { id: "sala", label: "Sala" },
                    { id: "turno", label: "Turno" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={item.id}
                        checked={formData[item.id as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [item.id]: checked })}
                      />
                      <Label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discipline and Grade */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="disciplina" className="mb-2 block text-sm font-medium">
                    Disciplina
                  </Label>
                  <Select
                    value={formData.disciplinaValue}
                    onValueChange={(value) => setFormData({ ...formData, disciplinaValue: value })}
                  >
                    <SelectTrigger id="disciplina">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portugues">Português</SelectItem>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="ciencias">Ciências</SelectItem>
                      <SelectItem value="historia">História</SelectItem>
                      <SelectItem value="geografia">Geografia</SelectItem>
                      <SelectItem value="ingles">Inglês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="serie" className="mb-2 block text-sm font-medium">
                    Série/Ano
                  </Label>
                  <Select
                    value={formData.serieValue}
                    onValueChange={(value) => setFormData({ ...formData, serieValue: value })}
                  >
                    <SelectTrigger id="serie">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}º ano
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Theme */}
              <div className="mb-6">
                <Label htmlFor="tema" className="mb-2 block text-sm font-medium">
                  Tema
                </Label>
                <Input
                  id="tema"
                  placeholder="Ex.: Sistema Solar"
                  value={formData.tema}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                />
              </div>

              {/* Activity Type */}
              <div className="mb-6">
                <Label htmlFor="tipoAtividade" className="mb-2 block text-sm font-medium">
                  Tipo de atividade
                </Label>
                <Select
                  value={formData.tipoAtividade}
                  onValueChange={(value) => setFormData({ ...formData, tipoAtividade: value })}
                >
                  <SelectTrigger id="tipoAtividade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="questionario">Questionário</SelectItem>
                    <SelectItem value="cacapalavras">Caça-palavras</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Difficulty and Number of Items */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="dificuldade" className="mb-2 block text-sm font-medium">
                    Nível de dificuldade
                  </Label>
                  <Select
                    value={formData.dificuldade}
                    onValueChange={(value) => setFormData({ ...formData, dificuldade: value })}
                  >
                    <SelectTrigger id="dificuldade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numItens" className="mb-2 block text-sm font-medium">
                    Nº itens
                  </Label>
                  <Input
                    id="numItens"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.numItens}
                    onChange={(e) => setFormData({ ...formData, numItens: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClear}>
                  Limpar
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.tema}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Atividade"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-foreground">Pré-visualização da Atividade</h2>

              <div className="mb-4 min-h-[400px] rounded-lg border border-border bg-card p-4 overflow-auto">
                {isGenerating ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : generatedContent ? (
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br>') }} />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Preencha o formulário e clique em "Gerar Atividade" para ver a pré-visualização
                  </div>
                )}
              </div>


              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!generatedContent}
              >
                Imprimir
              </Button>

              {/* Word Search Section */}
              <div className="mt-6">
                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={generateWordSearch}
                    disabled={isGeneratingWordSearch || !formData.tema}
                    className="flex-1"
                  >
                    {isGeneratingWordSearch ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Gerando Caça-palavras...
                      </>
                    ) : (
                      "Gerar Caça-palavras"
                    )}
                  </Button>
                </div>

                {wordSearchData && (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-4">Caça-palavras Gerado:</h3>
                    
                    {/* Form Information Header */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Disciplina:</strong> {(() => {
                            const disciplinaNames = {
                              portugues: 'Português',
                              matematica: 'Matemática',
                              ciencias: 'Ciências',
                              historia: 'História',
                              geografia: 'Geografia',
                              ingles: 'Inglês'
                            }
                            return disciplinaNames[formData.disciplinaValue as keyof typeof disciplinaNames]
                          })()}
                        </div>
                        <div><strong>Série/Ano:</strong> {formData.serieValue}º ano</div>
                        <div><strong>Tema:</strong> {formData.tema}</div>
                        <div><strong>Dificuldade:</strong> {(() => {
                            const dificuldadeNames = {
                              facil: 'Fácil',
                              medio: 'Médio',
                              dificil: 'Difícil'
                            }
                            return dificuldadeNames[formData.dificuldade as keyof typeof dificuldadeNames]
                          })()}</div>
                        <div><strong>Nº de palavras:</strong> {formData.numItens}</div>
                      </div>

                      {/* Selected Header Fields */}
                      {(() => {
                        const selectedHeaders = Object.entries(formData)
                          .filter(([key, value]) => 
                            ['escola', 'nome', 'professor', 'disciplina', 'serie', 'ano', 'sala', 'turno'].includes(key) && value
                          )
                        
                        if (selectedHeaders.length > 0) {
                          return (
                            <div className="mt-3 pt-3 border-t border-blue-300">
                              <div className="text-sm text-gray-600 mb-2"><strong>Campos selecionados para cabeçalho:</strong></div>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedHeaders.map(([key, _]) => {
                                  const labels = {
                                    escola: 'Escola',
                                    nome: 'Nome',
                                    professor: 'Professor(a)',
                                    disciplina: 'Disciplina',
                                    serie: 'Série',
                                    ano: 'Ano',
                                    sala: 'Sala',
                                    turno: 'Turno'
                                  }
                                  return (
                                    <div key={key} className="text-xs">
                                      {labels[key as keyof typeof labels]}: _________________
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm">
                        <code>{gridText}</code>
                      </pre>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 mb-2">
                      <h4 className="text-md font-medium">Palavras para encontrar:</h4>
                      <Button
                        onClick={generateWordSearchPDF}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                      >
                        📄 Baixar PDF
                      </Button>
                    </div>
                    
                    <ul className="grid grid-cols-2 gap-1">
                      {wordSearchData.wordList.map((word: string, index: number) => (
                        <li key={index} className="text-sm">• {word}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card px-6 py-4 text-center">
        <p className="text-sm text-muted-foreground">© 2025 EduMagic - Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
