import React from 'react';

interface TrueFalseProps {
  statements: string[];
}

const TrueFalse: React.FC<TrueFalseProps> = ({ statements }) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="space-y-4">
        {statements.map((statement, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border border-gray-400 rounded p-4 bg-white"
          >
            {/* Statement number */}
            <span className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            
            {/* Statement text */}
            <p className="flex-1 text-sm font-medium leading-relaxed">
              {statement}
            </p>
            
            {/* True/False options */}
            <div className="flex-shrink-0 flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 rounded"></span>
                <span className="text-sm font-medium">V</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-gray-400 rounded"></span>
                <span className="text-sm font-medium">F</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Marque (V) para verdadeiro ou (F) para falso em cada afirmação.</p>
      </div>
    </div>
  );
};

export default TrueFalse;
