"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ imageSrc, cropRatio, setCropRatio, onConfirmCrop, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const aspectRatios = {
    A3: 297 / 420,
    A4: 210 / 297,
    A5: 148 / 210,
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Inline helper function (no separate file needed)
  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        resolve(canvas.toDataURL("image/png"));
      };
      image.onerror = reject;
    });
  };

  const handleConfirm = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirmCrop(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, onConfirmCrop]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded p-4 relative w-full max-w-5xl h-[80vh] flex flex-col">
        {/* Aspect ratio buttons */}
        <div className="flex gap-2 mb-2">
          {Object.keys(aspectRatios).map((r) => (
            <button
              key={r}
              onClick={() => setCropRatio(r)}
              className={`px-3 py-1 rounded ${
                cropRatio === r ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Cropper */}
        <div className="relative flex-1">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatios[cropRatio] || 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="mt-4 flex justify-between items-center">
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-1/2"
          />
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-500"
            >
              Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
