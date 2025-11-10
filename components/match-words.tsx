import React from 'react';

interface MatchWordsProps {
  matches: { word: string; matched_word: string }[];
}

const MatchWords: React.FC<MatchWordsProps> = ({ matches }) => {
  // Shuffle the right column for the activity
  const leftColumn = matches.map(m => m.word);
  const rightColumn = [...matches.map(m => m.matched_word)].sort(() => Math.random() - 0.5);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-3">
          {leftColumn.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border border-gray-400 rounded p-3 bg-white"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm font-medium">{word}</span>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {rightColumn.map((word, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border border-gray-400 rounded p-3 bg-white"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center text-xs">
                ( )
              </span>
              <span className="text-sm font-medium">{word}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Ligue os números da coluna da esquerda aos parênteses da coluna da direita.</p>
      </div>
    </div>
  );
};

export default MatchWords;
