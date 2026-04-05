"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png)/)) {
      setError("Please upload JPG or PNG images only");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert base64 to blob
      const base64Data = originalImage.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image_file", blob, "image.jpg");

      // Call Remove.bg API directly from client
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": "n7rv2nuw49mPuEWuTu8drXp4",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to remove background");
      }

      const blobResult = await response.blob();
      const url = URL.createObjectURL(blobResult);
      setResultImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "removed-background.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">🖼️ Image Background Remover</h1>
          <p className="text-slate-400">Remove image background with one click</p>
        </header>

        {!originalImage ? (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-600 hover:border-slate-500"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl mb-4">Drag & drop your image here</p>
            <p className="text-slate-400 mb-6">or</p>
            <label className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg cursor-pointer transition-colors">
              Choose File
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleChange}
              />
            </label>
            <p className="text-slate-500 mt-4 text-sm">JPG, PNG • Max 10MB</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="text-center mb-4 text-slate-300">Original</h3>
                <img src={originalImage} alt="Original" className="w-full rounded-lg" />
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4">
                <h3 className="text-center mb-4 text-slate-300">Result</h3>
                {resultImage ? (
                  <img src={resultImage} alt="Result" className="w-full rounded-lg" />
                ) : (
                  <div className="w-full aspect-square bg-slate-600/50 rounded-lg flex items-center justify-center">
                    <span className="text-slate-500">Waiting...</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-4">
              {!resultImage ? (
                <button
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {isProcessing ? "Processing..." : "Remove Background"}
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  ⬇️ Download
                </button>
              )}
              <button
                onClick={handleReset}
                className="bg-slate-600 hover:bg-slate-500 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                🔄 New Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}