"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wand2,
  User,
  Loader2,
  ChevronUp,
  ChevronDown,
  Divide,
  LogOut,
} from "lucide-react";
// Import React Markdown for rendering markdown content
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import WordSearchGrid from "./word-search";
import WordSearch from "./word-search";
import ActivitySelector from "./activity-selector";
import { useUser } from "@/contexts/UserContext";

const words = [
  "SOL",
  "MARTE",
  "TERRA",
  "JUPITER",
  "VIA LACTEA",
  "LUA",
  "GALAXIA",
];
export function ActivityCreator() {
  const { user, logout, apiCall } = useUser();

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
  });

  const [selectedActivities, setSelectedActivities] = useState<number[]>([]);



  const [wordSearchData, setWordSearchData] = useState<{
    grid: string[][];
    wordList: string[];
  } | null>(null);
  const [isGeneratingWordSearch, setIsGeneratingWordSearch] = useState(false);
  const [isDocumentHeaderOpen, setIsDocumentHeaderOpen] = useState(false);


  const disableGenerateButton = useMemo(() => selectedActivities.every((activity) => !activity) && !!formData.tema, [selectedActivities]) 

  const generateWordSearchPDF = async () => {
    if (!wordSearchData) return;

    const disciplinaNames = {
      portugues: "Português",
      matematica: "Matemática",
      ciencias: "Ciências",
      historia: "História",
      geografia: "Geografia",
      ingles: "Inglês",
    };

    const dificuldadeNames = {
      facil: "Fácil",
      medio: "Médio",
      dificil: "Difícil",
    };

    // Create new PDF document
    const doc = new jsPDF();
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`CAÇA-PALAVRAS - ${formData.tema.toUpperCase()}`, 20, yPosition);
    yPosition += 15;

    // Form information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Disciplina: ${
        disciplinaNames[
          formData.disciplinaValue as keyof typeof disciplinaNames
        ]
      }`,
      20,
      yPosition
    );
    yPosition += 6;
    doc.text(`Série/Ano: ${formData.serieValue}º ano`, 20, yPosition);
    yPosition += 6;
    doc.text(`Tema: ${formData.tema}`, 20, yPosition);
    yPosition += 6;
    doc.text(
      `Dificuldade: ${
        dificuldadeNames[formData.dificuldade as keyof typeof dificuldadeNames]
      }`,
      20,
      yPosition
    );
    yPosition += 10;

    // Add selected header fields
    const cabecalhoFields = Object.entries(formData).filter(
      ([key, value]) =>
        [
          "escola",
          "nome",
          "professor",
          "disciplina",
          "serie",
          "ano",
          "sala",
          "turno",
        ].includes(key) && value
    );

    if (cabecalhoFields.length > 0) {
      cabecalhoFields.forEach(([key, _]) => {
        const labels = {
          escola: "Escola",
          nome: "Nome",
          professor: "Professor(a)",
          disciplina: "Disciplina",
          serie: "Série",
          ano: "Ano",
          sala: "Sala",
          turno: "Turno",
        };
        doc.text(
          `${labels[key as keyof typeof labels]}: _________________`,
          20,
          yPosition
        );
        yPosition += 6;
      });
      yPosition += 5;
    }

    // Instructions
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUÇÕES:", 20, yPosition);
    yPosition += 6;
    doc.setFont("helvetica", "normal");
    doc.text(
      "Encontre as palavras escondidas na grade abaixo. As palavras podem estar",
      20,
      yPosition
    );
    yPosition += 6;
    doc.text("na horizontal, vertical ou diagonal.", 20, yPosition);
    yPosition += 15;

    // Grid title
    doc.setFont("helvetica", "bold");
    doc.text("CAÇA-PALAVRAS:", 20, yPosition);
    yPosition += 10;

    // Capture the WordSearchGrid component as image
    try {
      const gridElement = document.getElementById("word-search-grid-for-pdf");
      if (gridElement) {
        const canvas = await html2canvas(gridElement, {
          backgroundColor: "#f9fafb",
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 160;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if image fits on current page
        if (yPosition + imgHeight > 280) {
          doc.addPage();
          yPosition = 20;
        }

        doc.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }
    } catch (error) {
      console.error("Erro ao capturar o grid:", error);
      // Fallback para o método anterior
      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      const gridLines = formatWordSearchGrid(wordSearchData.grid).split("\n");
      gridLines.forEach((line, index) => {
        if (line.trim() && yPosition < 280) {
          doc.text(line, 20, yPosition);
          yPosition += 4;
        }
      });
      yPosition += 10;
    }

  

    // Save the PDF
    doc.save(
      `caca-palavras-${formData.tema.toLowerCase().replace(/\s+/g, "-")}.pdf`
    );
  };

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
    });

    setWordSearchData(null);
  };

  const generateWordSearch = async () => {
    if (!formData.tema) return;

    setIsGeneratingWordSearch(true);
    try {
      const wordSearchPrompt = `
        Gere um array de ${formData.numItens} palavras sobre ${formData.tema} em português brasileiro neste formato: ["exemplo1", "exemplo2", "exemplo3"].
        Cada item do array deve conter apenas uma palavra relacionada ao tema.
        As palavras devem ser adequadas para alunos do ${formData.serieValue}º ano.
        Retorne apenas o array JSON na sua resposta, sem texto adicional.
      `;

      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "phi3:3.8b",
          prompt: wordSearchPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            max_tokens: 500,
          },
        }),
      });

      const data = await response.json();

      try {
        // Parse the JSON response to get the words array
        const words = JSON.parse(
          data?.response?.replaceAll("\n", "")?.match(/\[.*?\]/)[0]
        );
        if (Array.isArray(words)) {
          // Calculate grid size based on longest word
          const maxWordLength = Math.max(...words.map((word) => word.length));
          const gridSize = Math.max(maxWordLength, 10); // Minimum 10x10 grid

          // Generate the word search grid
          const { grid, wordList } = generateWordSearchGrid(words, gridSize);
          setWordSearchData({ grid, wordList });
        }
      } catch (parseError) {
        console.log("response data", data);
        console.log("words", words);
        console.error("Error parsing words from response:", parseError);
        // Fallback to default words if parsing fails
        const fallbackWords = [
          "ESCOLA",
          "ESTUDO",
          "LIVRO",
          "APRENDER",
          formData.tema.toUpperCase(),
        ];
        const maxWordLength = Math.max(
          ...fallbackWords.map((word) => word.length)
        );
        const gridSize = Math.max(maxWordLength, 10);
        const { grid, wordList } = generateWordSearchGrid(
          fallbackWords,
          gridSize
        );
        setWordSearchData({ grid, wordList });
      }
    } catch (error) {
      console.error("Error generating word search:", error);
    } finally {
      setIsGeneratingWordSearch(false);
    }
  };

  function generateWordSearchGrid(
    words: string[],
    size = 15
  ): { grid: string[][]; wordList: string[] } {
    const grid: string[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(""));
    const placedWords: string[] = [];

    // Directions: horizontal, vertical, diagonal (down-right)
    const directions = [
      { dx: 0, dy: 1 }, // horizontal
      { dx: 1, dy: 0 }, // vertical
      { dx: 1, dy: 1 }, // diagonal
    ];

    // Try to place each word
    for (const word of words) {
      const cleanWord = word.replace(/\s+/g, "").toUpperCase();
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 100) {
        const direction =
          directions[Math.floor(Math.random() * directions.length)];
        const startX = Math.floor(Math.random() * size);
        const startY = Math.floor(Math.random() * size);

        // Check if word fits
        const endX = startX + direction.dx * (cleanWord.length - 1);
        const endY = startY + direction.dy * (cleanWord.length - 1);

        if (endX >= 0 && endX < size && endY >= 0 && endY < size) {
          // Check if spaces are empty or match
          let canPlace = true;
          for (let i = 0; i < cleanWord.length; i++) {
            const x = startX + direction.dx * i;
            const y = startY + direction.dy * i;
            if (grid[x][y] !== "" && grid[x][y] !== cleanWord[i]) {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            // Place the word
            for (let i = 0; i < cleanWord.length; i++) {
              const x = startX + direction.dx * i;
              const y = startY + direction.dy * i;
              grid[x][y] = cleanWord[i];
            }
            placedWords.push(word);
            placed = true;
          }
        }
        attempts++;
      }
    }

    // Fill empty spaces with random letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === "") {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }

    return { grid, wordList: placedWords };
  }

  function formatWordSearchGrid(grid: string[][]): string {
    let result = "";

    // Add column numbers
    result += "    ";
    for (let i = 0; i < grid[0].length; i++) {
      result += `${(i + 1).toString().padStart(2, " ")} `;
    }
    result += "\n";

    // Add rows with row numbers
    for (let i = 0; i < grid.length; i++) {
      result += `${(i + 1).toString().padStart(2, " ")}  `;
      result += grid[i].join("  ");
      result += "\n";
    }

    return result;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <DropdownMenuItem>Perfil</DropdownMenuItem>
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Criar nova atividade
          </Button>
          <Button variant="ghost">Minhas atividades</Button>
          <Button variant="ghost">Ajuda rápida</Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex ">
          {/* Form Section */}
          <Card>
            <CardContent className="p-6 rounded-md border-gray-500">
              <h2 className="mb-6 text-xl font-semibold text-foreground ">
                Formulário inicial
              </h2>

              {/* Document Header Checkboxes */}
              <div className="mb-6 border-1 border-gray-400 rounded-2xl p-2">
                <div
                  className="flex justify-between p-1 hover:bg-gray-100 rounded-2xl transition hover:cursor-pointer   "
                  onClick={() => setIsDocumentHeaderOpen(!isDocumentHeaderOpen)}
                >
                  <Label className="mb-3 block text-sm font-medium">
                    Cabeçalho do documento
                  </Label>
                  <button className="    p-4 text-left font-medium text-gray-800  ">
                    {isDocumentHeaderOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isDocumentHeaderOpen
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
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
                          checked={
                            formData[
                              item.id as keyof typeof formData
                            ] as boolean
                          }
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, [item.id]: checked })
                          }
                        />
                        <Label htmlFor={item.id} className="text-sm">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label
                      htmlFor="disciplina"
                      className="mb-2 block text-sm font-medium"
                    >
                      Disciplina
                    </Label>
                    <Select
                      value={formData.disciplinaValue}
                      onValueChange={(value) =>
                        setFormData({ ...formData, disciplinaValue: value })
                      }
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
                    <Label
                      htmlFor="serie"
                      className="mb-2 block text-sm font-medium"
                    >
                      Série/Ano
                    </Label>
                    <Select
                      value={formData.serieValue}
                      onValueChange={(value) =>
                        setFormData({ ...formData, serieValue: value })
                      }
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
              </div>

              {/* Theme */}
              <div className="mb-6">
                <Label
                  htmlFor="tema"
                  className="mb-2 block text-sm font-medium"
                >
                  Tema
                </Label>
                <Input
                  id="tema"
                  placeholder="Ex.: Sistema Solar"
                  value={formData.tema}
                  onChange={(e) =>
                    setFormData({ ...formData, tema: e.target.value })
                  }
                />
              </div>

              <div>
                <ActivitySelector
                  setActivities={setSelectedActivities}
                  
                  activities={[
                    {
                      name: "Caça palavras",
                      subtitle: "Encontre as palavras escondidas",
                      disabled: false,
                    },
                    {
                      name: "Questionário de múltipla escolha",
                      subtitle: "Escolha a resposta correta",
                      disabled: true,
                    },
                    {
                      name: "Questionário dissertativo",
                      subtitle: "Responda com suas próprias palavras",
                      disabled: true,
                    },
                    {
                      name: "Completar lacunas",
                      subtitle: "Preencha as lacunas",
                      disabled: true,
                    },
                    {
                      name: "Ligue as colunas",
                      subtitle: "Associe as colunas",
                      disabled: true,
                    },
                    {
                      name: "Verdadeiro ou falso",
                      subtitle: "Classifique como verdadeiro ou falso",
                      disabled: true,
                    },
                    {
                      name: "Continue o conto",
                      subtitle: "Dê continuidade à história",
                      disabled: true,
                    },
                  ]}
                />

                <div className="flex m-2 p-2 gap-2  ">

                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 "
                  onClick={generateWordSearch}
                  disabled={isGeneratingWordSearch  || !disableGenerateButton}
                >
                  {isGeneratingWordSearch ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Atividade"
                  )}
                </Button>
                  <Button variant="outline" onClick={handleClear}>
                    Limpar
                  </Button>
                </div>
              </div>
                {/* Action Buttons */}
                <div className="flex gap-3">
                </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardContent className="p-6 min-w-[400px]">
              {/* Word Search Section */}
              <div className="mt-6">
                {wordSearchData && (
                  <div className="prose prose-sm max-w-none">
                    {/* Form Information Header */}
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Disciplina:</strong>{" "}
                          {(() => {
                            const disciplinaNames = {
                              portugues: "Português",
                              matematica: "Matemática",
                              ciencias: "Ciências",
                              historia: "História",
                              geografia: "Geografia",
                              ingles: "Inglês",
                            };
                            return disciplinaNames[
                              formData.disciplinaValue as keyof typeof disciplinaNames
                            ];
                          })()}
                        </div>
                        <div>
                          <strong>Série/Ano:</strong> {formData.serieValue}º ano
                        </div>
                        <div>
                          <strong>Tema:</strong> {formData.tema}
                        </div>

                        <div>
                          <strong>Nº de palavras:</strong> {formData.numItens}
                        </div>
                      </div>

                      {/* Selected Header Fields */}
                      {(() => {
                        const selectedHeaders = Object.entries(formData).filter(
                          ([key, value]) =>
                            [
                              "escola",
                              "nome",
                              "professor",
                              "disciplina",
                              "serie",
                              "ano",
                              "sala",
                              "turno",
                            ].includes(key) && value
                        );

                        if (selectedHeaders.length > 0) {
                          return (
                            <div className="mt-3 pt-3 border-t border-blue-300">
                              <div className="text-sm text-gray-600 mb-2">
                                <strong>
                                  Campos selecionados para cabeçalho:
                                </strong>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedHeaders.map(([key, _]) => {
                                  const labels = {
                                    escola: "Escola",
                                    nome: "Nome",
                                    professor: "Professor(a)",
                                    disciplina: "Disciplina",
                                    serie: "Série",
                                    ano: "Ano",
                                    sala: "Sala",
                                    turno: "Turno",
                                  };
                                  return (
                                    <div key={key} className="text-xs">
                                      {labels[key as keyof typeof labels]}:
                                      _________________
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div id="word-search-grid-for-pdf">
                        <WordSearchGrid grid={wordSearchData.grid} />
                        <div>
                          <h4 className="text-md font-medium">
                            Palavras para encontrar:
                          </h4>

                          <ul className="grid grid-cols-2 gap-1">
                            {wordSearchData.wordList.map(
                              (word: string, index: number) => (
                                <li key={index} className="text-sm">
                                  • {word}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-4 mb-2">
                      <Button
                        onClick={() => generateWordSearchPDF()}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                      >
                        📄 Baixar PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-border bg-card px-6 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          © 2025 EduMagic - Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
