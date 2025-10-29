 
export default function WordSearch({ grid }: { grid: string[][] }) {
  return (
    <div>
      {/* Word Search Grid */}
      <div className=" border-[1px] border-gray-400  rounded-2xl p-4">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex       ">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="   w-8 h-8 flex items-center justify-center m-0"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
