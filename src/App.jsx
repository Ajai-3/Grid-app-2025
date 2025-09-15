import React, { useRef, useState, useEffect } from "react";
import Toolbar from "./components/Toolbar";
import ImageCanvas from "./components/ImageCanvas";
import CropperModal from "./components/CropperModal";

export default function App() {
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [originalImageSrc, setOriginalImageSrc] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [isCropping, setIsCropping] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const [rowsMM, setRowsMM] = useState(10);
  const [colsMM, setColsMM] = useState(10);
  const [gapMM, setGapMM] = useState(0);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [showDiagonal, setShowDiagonal] = useState(false);
  const [diagonalStyle, setDiagonalStyle] = useState("both");
  const [gridColor, setGridColor] = useState("#0b84ff");
  const [showGrid, setShowGrid] = useState(true);
  const [blackAndWhite, setBlackAndWhite] = useState(false);

  const [realSizeMode, setRealSizeMode] = useState(false);
  const [cropRatio, setCropRatio] = useState("A4");

  const dpi = 113;
  const paperSizesMM = { A5: [148, 210], A4: [210, 297], A3: [297, 420] };

  useEffect(() => {
    if (!imageSrc) return;
    const img = imgRef.current;
    if (!img) return;
    const onLoad = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [imageSrc]);

  useEffect(() => {
    if (!containerRef.current || naturalSize.w === 0) return;
    const contW = containerRef.current.clientWidth;
    const contH = containerRef.current.clientHeight;
    let targetW, targetH;
    if (realSizeMode) {
      const [pwMM, phMM] = paperSizesMM[cropRatio];
      targetW = pwMM * dpi / 25.4;
      targetH = phMM * dpi / 25.4;
    } else {
      targetW = naturalSize.w;
      targetH = naturalSize.h;
    }
    const scale = Math.min(contW / targetW, contH / targetH, 1);
    setZoom(scale);
    setOffset({ x: 0, y: 0 });
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  }, [realSizeMode, cropRatio, naturalSize.w, naturalSize.h]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOriginalImageSrc(URL.createObjectURL(file));
    setIsCropping(true);
  };

  const handleCropConfirm = (croppedDataURL) => {
    setImageSrc(croppedDataURL);
    setIsCropping(false);
  };

  const handleCloseCrop = () => {
    setIsCropping(false);
    if (originalImageSrc) URL.revokeObjectURL(originalImageSrc);
  };

  const toggleRealSize = () => setRealSizeMode((s) => !s);

  const handleMouseDown = (e) => {
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    setOffset({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    setIsPanning(true);
    panStartRef.current = { x: t.clientX - offset.x, y: t.clientY - offset.y };
  };

  const handleTouchMove = (e) => {
    if (!isPanning) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - panStartRef.current.x, y: t.clientY - panStartRef.current.y });
  };

  const handleTouchEnd = () => setIsPanning(false);

  const downloadImage = () => {
    if (!imageSrc) return;
    const [pwMM, phMM] = paperSizesMM[cropRatio];
    const w = (pwMM * dpi) / 25.4;
    const h = (phMM * dpi) / 25.4;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h);
      if (blackAndWhite) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const pxPerMM = dpi / 25.4;
      const numCols = Math.floor(pwMM / (colsMM + gapMM));
      const numRows = Math.floor(phMM / (rowsMM + gapMM));
      if (showGrid && numCols > 0 && numRows > 0) {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = strokeWidth;
        for (let c = 0; c <= numCols; c++) {
          const x = c * (colsMM + gapMM) * pxPerMM;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let r = 0; r <= numRows; r++) {
          const y = r * (rowsMM + gapMM) * pxPerMM;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        if (showDiagonal) {
          ctx.strokeStyle = "#ff6b6b";
          for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
              const x1 = c * (colsMM + gapMM) * pxPerMM;
              const y1 = r * (rowsMM + gapMM) * pxPerMM;
              const x2 = x1 + colsMM * pxPerMM;
              const y2 = y1 + rowsMM * pxPerMM;
              if (diagonalStyle === "both" || diagonalStyle === "tl-br") {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
              }
              if (diagonalStyle === "both" || diagonalStyle === "tr-bl") {
                ctx.beginPath();
                ctx.moveTo(x2, y1);
                ctx.lineTo(x1, y2);
                ctx.stroke();
              }
            }
          }
        }
      }
      const link = document.createElement("a");
      link.download = `gridded-${cropRatio}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex gap-10">
      <div className="w-64 flex-shrink-0">
        <Toolbar
          fileInputRef={fileInputRef}
          onFileChange={handleFile}
          zoom={zoom}
          setZoom={setZoom}
          rowsMM={rowsMM}
          setRowsMM={setRowsMM}
          colsMM={colsMM}
          setColsMM={setColsMM}
          gapMM={gapMM}
          setGapMM={setGapMM}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          showDiagonal={showDiagonal}
          setShowDiagonal={setShowDiagonal}
          diagonalStyle={diagonalStyle}
          setDiagonalStyle={setDiagonalStyle}
          realSizeMode={realSizeMode}
          toggleRealSize={toggleRealSize}
          downloadImage={downloadImage}
          gridColor={gridColor}
          setGridColor={setGridColor}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          blackAndWhite={blackAndWhite}
          setBlackAndWhite={setBlackAndWhite}
        />
      </div>
      <div className="flex w-full">
        <ImageCanvas
          imageSrc={imageSrc}
          imgRef={imgRef}
          containerRef={containerRef}
          zoom={zoom}
          offset={offset}
          rowsMM={rowsMM}
          colsMM={colsMM}
          gapMM={gapMM}
          strokeWidth={strokeWidth}
          showDiagonal={showDiagonal}
          diagonalStyle={diagonalStyle}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
          realSizeMode={realSizeMode}
          cropRatio={cropRatio}
          dpi={dpi}
          naturalSize={naturalSize}
          gridColor={gridColor}
          showGrid={showGrid}
          blackAndWhite={blackAndWhite}
        />
      </div>

      {isCropping && originalImageSrc && (
        <CropperModal
          imageSrc={originalImageSrc}
          cropRatio={cropRatio}
          setCropRatio={setCropRatio}
          onConfirmCrop={handleCropConfirm}
          onClose={handleCloseCrop}
        />
      )}
    </div>
  );
}