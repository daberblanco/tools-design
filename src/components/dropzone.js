import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { X } from "lucide-react";

const Dropzone = () => {
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState(50); // Default compression level
  const [selectedFormat, setSelectedFormat] = useState("jpg"); // Default format
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [doNotEnlarge, setDoNotEnlarge] = useState(false);
  const [resizeUnits, setResizeUnits] = useState("pixels"); // Default units for resizing

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ naturalWidth: img.width, naturalHeight: img.height });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFiles = async (files) => {
    if (files.length > 20) {
      alert("Solo se permiten un máximo de 20 imágenes por intento.");
      return;
    }

    const newImages = [];

    for (const file of files) {
      const dimensions = await getImageDimensions(file);

      const imageObject = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        file: file,
        naturalWidth: dimensions.naturalWidth,
        naturalHeight: dimensions.naturalHeight,
      };

      newImages.push(imageObject);
    }

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleActionSelect = (action) => {
    setSelectedAction(action);
  };

  const handleCompressionLevelChange = (e) => {
    setCompressionLevel(e.target.value);
  };

  const handleFormatChange = (e) => {
    setSelectedFormat(e.target.value);
  };

  const handleResizeWidthChange = (e) => {
    setResizeWidth(e.target.value);
    if (maintainAspectRatio) {
      // Calcular el alto manteniendo la relación de aspecto
      const aspectRatio = images[0].naturalWidth / images[0].naturalHeight;
      setResizeHeight(Math.round(e.target.value / aspectRatio));
    }
  };

  const handleResizeHeightChange = (e) => {
    setResizeHeight(e.target.value);
    if (maintainAspectRatio) {
      // Calcular el ancho manteniendo la relación de aspecto
      const aspectRatio = images[0].naturalWidth / images[0].naturalHeight;
      setResizeWidth(Math.round(e.target.value * aspectRatio));
    }
  };

  const handleMaintainAspectRatioChange = (e) => {
    setMaintainAspectRatio(e.target.checked);
    if (e.target.checked) {
      // Calcular el alto manteniendo la relación de aspecto
      const aspectRatio = images[0].naturalWidth / images[0].naturalHeight;
      setResizeHeight(Math.round(resizeWidth / aspectRatio));
    }
  };

  const handleDoNotEnlargeChange = (e) => {
    setDoNotEnlarge(e.target.checked);
  };

  const applyAction = async () => {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image.file);
      });

      // Attach additional data based on the selected action
      formData.append("action", selectedAction);
      if (selectedAction === "compression") {
        formData.append("compressionLevel", compressionLevel);
      } else if (selectedAction === "formatChange") {
        formData.append("format", selectedFormat);
      } else if (selectedAction === "resize") {
        formData.append("resizeWidth", String(resizeWidth)); // Convertir a cadena antes de agregar al FormData
        formData.append("resizeHeight", String(resizeHeight)); // Convertir a cadena antes de agregar al FormData

        formData.append("maintainAspectRatio", maintainAspectRatio);
        formData.append("doNotEnlarge", doNotEnlarge);
      }

      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al procesar las imágenes");
      }

      // Default file name should be original file name + processed
      let fileName = "processed";
      let isZip = false;

      if (images.length > 1) {
        fileName += ".zip";
        isZip = true;
      } else {
        // Get file name from response if header is present
        const contentDispositionHeader = response.headers.get(
          "Content-Disposition"
        );
        if (contentDispositionHeader) {
          const fileNameMatch =
            contentDispositionHeader.match(/filename="(.+)"/);
          if (fileNameMatch && fileNameMatch.length > 1) {
            fileName = fileNameMatch[1];
          }
        }
      }

      if (isZip) {
        // Download ZIP file
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName; // Use obtained file name
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Download image directly
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName; // Use obtained file name
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error("Error al procesar las imágenes:", error);
      alert("Error al procesar las imágenes");
    }
  };

  // Poner los formatos de imagen en el texto para usuarios finales, ejemplo: cambiar el image/jpeg a JPEG
  const formatType = (type) => {
    switch (type) {
      case "image/jpeg":
        return "JPEG";
      case "image/png":
        return "PNG";
      case "image/webp":
        return "WEBP";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-10 space-y-8">
      <h2 className="text-2xl font-bold text-gray-600 mb-4 italic">
        Zona de carga de imágenes (Máx. 20 imágenes)
      </h2>
      <div
        className={`w-full max-w-2xl h-64 border border-dashed border-gray-400 flex flex-col items-center justify-center p-8 rounded-lg relative ${
          dragging ? "bg-gray-200" : "bg-gray-100"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <Transition
          show={!dragging}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <p className="text-gray-600 mb-4 text-center">
            Haz clic o arrastra y suelta tus imágenes aquí
          </p>
        </Transition>
        <Transition
          show={dragging}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <p className="text-gray-600 mb-4 text-center">
            Suelta aquí para cargar las imágenes
          </p>
        </Transition>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
      </div>
      {images.length > 0 && (
        <div className="mt-8 max-w-4xl">
          <h2 className="text-xl font-bold text-gray-600 mb-4">
            Imágenes cargadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-md relative transform transition duration-300 hover:scale-105"
              >
                <button
                  className="absolute top-2 right-2 bg-red-600 rounded-full p-1 hover:bg-red-700 focus:outline-none focus:bg-red-700 transition duration-300"
                  onClick={() => removeImage(image.id)}
                >
                  <X size={16} className="text-white" />
                </button>
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-40 object-cover"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.target;
                    setImages((prevImages) =>
                      prevImages.map((img) =>
                        img.id === image.id
                          ? { ...img, naturalWidth, naturalHeight }
                          : img
                      )
                    );
                  }}
                />

                <div className="p-4">
                  <p className="text-sm font-medium text-gray-800">
                    {image.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Tamaño: {Math.round(image.size / 1024)} KB
                  </p>
                  <p className="text-sm text-gray-600">
                    Dimensiones:{" "}
                    {image.naturalWidth && image.naturalHeight
                      ? `${image.naturalWidth} x ${image.naturalHeight}`
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Formato: {formatType(image.type)}
                  </p>
                  {/* Mostrar información adicional según la acción seleccionada */}
                  {selectedAction && (
                    <div className="text-sm font-semibold text-blue-600">
                      {selectedAction === "compression" && (
                        <p>
                          Nuevo Tamaño:{" "}
                          {Math.round(
                            (image.size * compressionLevel) / 100 / 1024
                          )}{" "}
                          KB
                        </p>
                      )}
                      {selectedAction === "formatChange" && (
                        <p>
                          Formato Cambiado a: {selectedFormat.toUpperCase()}
                        </p>
                      )}
                      {selectedAction === "resize" && (
                        <p>
                          Nuevas Dimensiones: {resizeWidth} x {resizeHeight}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {images.length > 0 && (
        <div className="mt-8 max-w-4xl">
          <h2 className="text-xl font-bold text-gray-600 mb-4">
            Seleccionar Acción
          </h2>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300`}
              onClick={() => handleActionSelect("compression")}
            >
              Comprimir
            </button>
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300`}
              onClick={() => handleActionSelect("formatChange")}
            >
              Cambiar Formato
            </button>
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300`}
              onClick={() => handleActionSelect("resize")}
            >
              Redimensionar Imagen
            </button>
          </div>
          {selectedAction === "compression" && (
            <div className="mt-4">
              <label
                htmlFor="compressionLevel"
                className="block text-sm font-medium text-gray-700"
              >
                Nivel de Compresión
              </label>
              <input
                id="compressionLevel"
                type="range"
                min="0"
                max="100"
                value={compressionLevel}
                onChange={handleCompressionLevelChange}
                className="mt-2 appearance-none w-full bg-gray-200 h-1 rounded-lg outline-none"
              />
              <p className="text-sm text-gray-600">
                Nivel de Compresión: {compressionLevel}%
              </p>
            </div>
          )}
          {selectedAction === "formatChange" && (
            <div className="mt-4">
              <label
                htmlFor="format"
                className="block text-sm font-medium text-gray-700"
              >
                Seleccionar Formato
              </label>
              <select
                id="format"
                onChange={handleFormatChange}
                defaultValue="jpg"
                className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
          )}
          {selectedAction === "resize" && (
            <div className="mt-4">
              <div className="flex items-center">
                <label
                  htmlFor="resizeUnits"
                  className="block text-sm font-medium text-gray-700 mr-4"
                >
                  Unidades:
                </label>
                <div className="flex items-center mr-4">
                  <input
                    id="pixels"
                    type="radio"
                    value="pixels"
                    checked={resizeUnits === "pixels"}
                    onChange={() => setResizeUnits("pixels")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label
                    htmlFor="pixels"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Pixeles
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="percentage"
                    type="radio"
                    value="percentage"
                    checked={resizeUnits === "percentage"}
                    onChange={() => setResizeUnits("percentage")}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label
                    htmlFor="percentage"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Porcentaje
                  </label>
                </div>
              </div>
              {resizeUnits === "pixels" && (
                <>
                  <div className="mt-4">
                    <label
                      htmlFor="resizeWidth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ancho
                    </label>
                    <input
                      id="resizeWidth"
                      type="text"
                      value={resizeWidth}
                      onChange={handleResizeWidthChange}
                      className="mt-2 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    <label
                      htmlFor="resizeHeight"
                      className="block text-sm font-medium text-gray-700 mt-2"
                    >
                      Alto
                    </label>
                    <input
                      id="resizeHeight"
                      type="text"
                      value={resizeHeight}
                      onChange={handleResizeHeightChange}
                      className="mt-2 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
              {resizeUnits === "percentage" && (
                <div className="mt-4">
                  <label
                    htmlFor="resizePercentage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reducción de tamaño:
                  </label>
                  <div className="flex items-center mt-2 justify-between">
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
                      onClick={() => handleResizeWidthChange(25)}
                    >
                      25% MENOR
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300"
                      onClick={() => handleResizeWidthChange(50)}
                    >
                      50% MENOR
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      onClick={() => handleResizeWidthChange(75)}
                    >
                      75% MENOR
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <input
                  id="maintainAspectRatio"
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={handleMaintainAspectRatioChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label
                  htmlFor="maintainAspectRatio"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Mantener relación de aspecto
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="doNotEnlarge"
                  type="checkbox"
                  checked={doNotEnlarge}
                  onChange={handleDoNotEnlargeChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label
                  htmlFor="doNotEnlarge"
                  className="ml-2 block text-sm text-gray-700"
                >
                  No ampliar si es más pequeño
                </label>
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600 mr-2 transition duration-300`}
              onClick={applyAction}
            >
              Aplicar Acción
            </button>
            <button
              className={`px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300`}
              onClick={() => setImages([])}
            >
              Eliminar Todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
