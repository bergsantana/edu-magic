export interface GeneratedActivity { 
    words?: string[];
    matches?: { word: string; matched_word: string }[];
    true_false?: string[];
}

export const promptGenerator = (topic: string, activities: string[])  => {
    const rules = {
        "words": "deve ser um array de 10 palavras que pertencem ao tema.",
        "matches": "deve ser um array de 5 objetos no formato { \"word\": \"exemplo1\", \"matched_word\": \"exemplo2\" }, onde ambas as palavras estão relacionadas ao tema.",
        "true_false": "deve conter 5 frases curtas e informativas sobre o tema. Cada frase deve ser verdadeira ou falsa, mas não indique se é verdadeira ou falsa."
    }


    const prompt =  `
        Gere um JSON com ${activities.length} campos relacionados ao tema \"${topic}\": 
            { 
                ${Object.keys(rules).map(key => `"${key}": []`).join(', ')}
            } 
        Regras: 
            ${Object.entries(rules).map(([key, value]) => `- "${key}": ${value}`).join('')}
        Exemplo de saída: 
            { 
                \"words\": [\"planeta\", \"estrela\", \"galáxia\", \"satélite\", \"órbita\"], 
                \"matches\": [ { \"word\": \"Terra\", \"matched_word\": \"planeta\" }, { \"word\": \"Sol\", \"matched_word\": \"estrela\" } ], 
                \"true_false\": [ \"A Terra é o maior planeta do sistema solar.\", \"O Sol é uma estrela.\" ] }}
        `
 
    return prompt;
}

export const parseGeneratedActivity = (text: string): GeneratedActivity => {
  try {
    const sanitizedText = text.replace(/\n/g, "").trim();

    //const noBackticks = sanitizedText.replace(/```/g, '').replaceAll('json', '').trim();

    const matched = sanitizedText.match(/\`\`\`.*?\`\`\`/);

    if (!matched || matched.length === 0) {
      throw new Error("No JSON code block found in the text");
    }

    const replaceBackticks = matched[0].replace(/```/g, "").replaceAll("json", "").trim();
    
    return JSON.parse(replaceBackticks);
  } catch (error: any) {
    throw new Error(
      "Failed to parse generated activity JSON: " + error.message
    );
  }
 
};