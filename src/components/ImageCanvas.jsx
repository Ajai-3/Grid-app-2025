import React from "react";

export default function ImageCanvas({
  imageSrc,
  imgRef,
  containerRef,
  zoom,
  offset,
  rowsMM,
  colsMM,
  gapMM,
  strokeWidth,
  showDiagonal,
  diagonalStyle,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  realSizeMode,
  cropRatio,
  dpi,
  naturalSize,
  gridColor,
  showGrid,
  blackAndWhite,
}) {
  const paperSizesMM = { A5: [148, 210], A4: [210, 297], A3: [297, 420] };
  const mmToPx = (mm) => (mm * dpi) / 25.4;

  // Displayed image size
  const displayedSize = realSizeMode
    ? {
        w: mmToPx(paperSizesMM[cropRatio][0]),
        h: mmToPx(paperSizesMM[cropRatio][1]),
      }
    : {
        w: naturalSize.w * zoom,
        h: naturalSize.h * zoom,
      };

  // Grid cell size in pixels
  const cellWidthPx =
    colsMM * (realSizeMode ? mmToPx(1) : displayedSize.w / (naturalSize.w / mmToPx(1))) +
    gapMM * (realSizeMode ? mmToPx(1) : displayedSize.w / (naturalSize.w / mmToPx(1)));
  const cellHeightPx =
    rowsMM * (realSizeMode ? mmToPx(1) : displayedSize.h / (naturalSize.h / mmToPx(1))) +
    gapMM * (realSizeMode ? mmToPx(1) : displayedSize.h / (naturalSize.h / mmToPx(1)));

  const numCols = Math.floor(displayedSize.w / cellWidthPx);
  const numRows = Math.floor(displayedSize.h / cellHeightPx);

  const renderGridSVG = () => {
    if (!showGrid || numCols <= 0 || numRows <= 0) return null;

    const vLines = [];
    const hLines = [];
    const diagonals = [];
    const labels = [];

    // Vertical lines + numbering (top + bottom)
    for (let c = 0; c <= numCols; c++) {
      const x = c * cellWidthPx;
      vLines.push(
        <line
          key={`vl-${c}`}
          x1={x}
          y1={0}
          x2={x}
          y2={displayedSize.h}
          strokeWidth={strokeWidth}
          stroke={gridColor}
        />
      );

      // top numbers
      labels.push(
        <text
          key={`vt-${c}`}
          x={x + 2}
          y={12}
          fontSize="10"
          fill={gridColor}
        >
          {c + 1}
        </text>
      );

      // bottom numbers
      labels.push(
        <text
          key={`vb-${c}`}
          x={x + 2}
          y={displayedSize.h - 2}
          fontSize="10"
          fill={gridColor}
        >
          {c + 1}
        </text>
      );
    }

    // Horizontal lines + numbering (left + right)
    for (let r = 0; r <= numRows; r++) {
      const y = r * cellHeightPx;
      hLines.push(
        <line
          key={`hl-${r}`}
          x1={0}
          y1={y}
          x2={displayedSize.w}
          y2={y}
          strokeWidth={strokeWidth}
          stroke={gridColor}
        />
      );

      // left numbers
      labels.push(
        <text
          key={`hl-${r}-l`}
          x={2}
          y={y + 10}
          fontSize="10"
          fill={gridColor}
        >
          {r + 1}
        </text>
      );

      // right numbers
      labels.push(
        <text
          key={`hl-${r}-r`}
          x={displayedSize.w - 20}
          y={y + 10}
          fontSize="10"
          fill={gridColor}
        >
          {r + 1}
        </text>
      );
    }

    if (showDiagonal) {
      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const x1 = c * cellWidthPx;
          const y1 = r * cellHeightPx;
          const x2 = x1 + cellWidthPx;
          const y2 = y1 + cellHeightPx;

          if (diagonalStyle === "both" || diagonalStyle === "tl-br") {
            diagonals.push(
              <line
                key={`d1-${r}-${c}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ff6b6b"
                strokeWidth={strokeWidth}
              />
            );
          }
          if (diagonalStyle === "both" || diagonalStyle === "tr-bl") {
            diagonals.push(
              <line
                key={`d2-${r}-${c}`}
                x1={x2}
                y1={y1}
                x2={x1}
                y2={y2}
                stroke="#ff6b6b"
                strokeWidth={strokeWidth}
              />
            );
          }
        }
      }
    }

    return (
      <svg
        width={displayedSize.w}
        height={displayedSize.h}
        className="pointer-events-none absolute top-0 left-0"
      >
        {vLines}
        {hLines}
        {diagonals}
        {labels}
      </svg>
    );
  };

  return (
    <div className="flex-1 relative">
      <div
        ref={containerRef}
        className="relative overflow-auto h-full"
        style={{ touchAction: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          style={{
            width: displayedSize.w,
            height: displayedSize.h,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            position: "relative",
          }}
          className="select-none"
        >
          {imageSrc ? (
            <img
              ref={imgRef}
              src={imageSrc}
              alt="uploaded"
              draggable={false}
              style={{
                width: displayedSize.w,
                height: displayedSize.h,
                objectFit: realSizeMode ? "fill" : "contain",
                filter: blackAndWhite ? "grayscale(100%)" : "none",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              No image uploaded
            </div>
          )}
          {imageSrc && renderGridSVG()}
        </div>
      </div>
    </div>
  );
}
