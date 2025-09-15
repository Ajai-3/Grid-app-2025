import React from "react";
import { Upload, Maximize2, Minimize2, Download, Grid, Type, Minus, Image, Palette } from "lucide-react";

export default function Toolbar({
  fileInputRef,
  onFileChange,
  rowsMM,
  setRowsMM,
  colsMM,
  setColsMM,
  strokeWidth,
  setStrokeWidth,
  showDiagonal,
  setShowDiagonal,
  diagonalStyle,
  setDiagonalStyle,
  realSizeMode,
  toggleRealSize,
  downloadImage,
  gridColor,
  setGridColor,
  showGrid,
  setShowGrid,
  blackAndWhite,
  setBlackAndWhite,
}) {
  return (
    <div className="flex flex-col gap-4 items-start bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700 w-72">
      {/* Upload Section */}
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
          accept="image/*"
        />
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors font-medium"
          onClick={() => fileInputRef.current.click()}
        >
          <Upload size={18} /> Upload Image
        </button>
      </div>

      {/* Grid Settings Section */}
      <div className="w-full space-y-4">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Grid size={16} /> Grid Settings
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Rows (mm)</label>
            <input
              type="number"
              value={rowsMM}
              min={1}
              className="w-full p-2 rounded border bg-gray-800 text-white border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => setRowsMM(Number(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400">Columns (mm)</label>
            <input
              type="number"
              value={colsMM}
              min={1}
              className="w-full p-2 rounded border bg-gray-800 text-white border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => setColsMM(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <label className="text-xs text-gray-400">Stroke Width</label>
          <input
            type="range"
            min={0.5}
            max={6}
            step={0.5}
            value={strokeWidth}
            className="w-full bg-gray-700 rounded-lg"
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-400 flex items-center gap-2">
              <Palette size={14} /> Grid Color
            </label>
            <input
              type="color"
              value={gridColor}
              onChange={(e) => setGridColor(e.target.value)}
              className="w-6 h-6 rounded border border-gray-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Display Options Section */}
      <div className="w-full space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Image size={16} /> Display Options
        </h3>

        <div className="space-y-2">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-gray-400">Show Grid</span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs text-gray-400">Black & White</span>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={blackAndWhite}
                onChange={(e) => setBlackAndWhite(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
          </label>

          {showGrid && (
            <>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-gray-400">Diagonals</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDiagonal}
                    onChange={(e) => setShowDiagonal(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
              </label>

              {showDiagonal && (
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Diagonal Style</label>
                  <select
                    value={diagonalStyle}
                    onChange={(e) => setDiagonalStyle(e.target.value)}
                    className="w-full p-2 rounded border bg-gray-800 text-white border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs"
                  >
                    <option value="both">Both Directions</option>
                    <option value="tl-br">Top-Left to Bottom-Right</option>
                    <option value="tr-bl">Top-Right to Bottom-Left</option>
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Real Size Control */}
      <div className="w-full space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <Maximize2 size={16} /> View Control
        </h3>

        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          onClick={toggleRealSize}
          style={{
            backgroundColor: realSizeMode ? '#ef4444' : '#10b981',
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = realSizeMode ? '#dc2626' : '#059669';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = realSizeMode ? '#ef4444' : '#10b981';
          }}
        >
          {realSizeMode ? (
            <>
              <Minimize2 size={16} /> Exit Real Size
            </>
          ) : (
            <>
              <Maximize2 size={16} /> Real Size View
            </>
          )}
        </button>
      </div>

      {/* Download Button */}
      <div className="w-full">
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-amber-600 rounded-lg hover:bg-amber-500 transition-colors font-medium"
          onClick={downloadImage}
        >
          <Download size={18} /> Download Image
        </button>
      </div>
    </div>
  );
}