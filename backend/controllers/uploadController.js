// controllers/uploadController.js

const compressionController = require("./compressionController");
const resizeController = require("./resizeController");
const formatConversionController = require("./formatConversionController");
const archiver = require("archiver");

exports.uploadImages = async (req, res) => {
  try {
    // Procesar las imágenes subidas
    const uploadedImages = req.files; // Imágenes subidas por Multer
    const { compressionLevel, format, resizeWidth, resizeHeight } = req.body; // Parámetros de la solicitud
    const action = req.body.action; // Acción a realizar en las imágenes

    let processedImages; // Imágenes procesadas

    if (action === "compression") { // Comprimir las imágenes
      processedImages = await compressionController.compressImages(
        uploadedImages,
        compressionLevel
      );
    } else if (action === "formatChange") { // Cambiar el formato de las imágenes
      processedImages = await formatConversionController.convertFormat(
        uploadedImages,
        format
      );
    } else if (action === "resize") { // Redimensionar las imágenes
      // Convertir los valores de ancho y alto a números enteros
      const parsedWidth = parseInt(resizeWidth, 10);
      const parsedHeight = parseInt(resizeHeight, 10);

      // Verificar si los valores son números válidos
      if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
        console.log("Ancho y alto recibidos:", resizeWidth, resizeHeight);
        throw new Error("Ancho y alto deben ser números válidos");
      }

      processedImages = await resizeController.resizeImages(
        uploadedImages,
        parsedWidth,
        parsedHeight
      );
    } else {
      throw new Error("Acción no válida"); 
    }
    if (processedImages.length === 1) {
      const image = processedImages[0];
      // Establecer el tipo de contenido según el formato de la imagen procesada
      res.type(`image/${format}`);

      // Opcional: Para forzar la descarga por parte del navegador, puedes descomentar la siguiente línea
      // res.setHeader('Content-Disposition', `attachment; filename="${image.name}"`);

      // Enviar el buffer de la imagen como respuesta
      res.send(image.buffer);
    } else {
      // Crear un archivo ZIP con las imágenes procesadas
      const zip = archiver("zip");
      processedImages.forEach((image) => {
        zip.append(image.buffer, { name: image.name });
      });

      res.attachment("processedImages.zip");
      zip.pipe(res);
      zip.finalize();
    }
  } catch (error) {
    console.error("Error al procesar las imágenes en el servidor:", error);
    res.status(500).send("Error al procesar las imágenes en el servidor");
  }
};
