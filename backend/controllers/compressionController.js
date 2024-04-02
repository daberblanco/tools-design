// controllers/compressionController.js
const sharp = require('sharp');

exports.compressImages = async (images, quality) => {
  try {
    // Convertir la calidad de string a integer
    const qualityInt = parseInt(quality, 10); // Base 10
    if (isNaN(qualityInt) || qualityInt < 1 || qualityInt > 100) { // Comprobar si la calidad es un número válido
      throw new Error('La calidad debe ser un número entre 1 y 100.');
    }

    const compressedImages = await Promise.all(images.map(async (image) => { // Recorrer todas las imágenes
      let format = image.mimetype.split('/')[1]; // Obtiene el formato de la imagen basado en el mimetype
      let sharpInstance = sharp(image.buffer); // Crea una instancia de Sharp con el buffer de la imagen

      // Comprueba el formato y aplica la compresión correspondiente.
      switch(format) {
        case 'jpeg':
        case 'jpg':
          sharpInstance = sharpInstance.jpeg({ quality: qualityInt });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality: qualityInt });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: qualityInt });
          break;
        default:
          throw new Error(`Formato no soportado para la compresión: ${format}`); // Lanza un error si el formato no es soportado
      }

      const compressedImageBuffer = await sharpInstance.toBuffer(); // Convierte la imagen a un buffer comprimido
      return { name: image.originalname, buffer: compressedImageBuffer }; // Devuelve el nombre original y el buffer de la imagen comprimida
    }));

    console.log('Imágenes comprimidas:', compressedImages);

    return compressedImages;
  } catch (error) {
    console.error('Error al comprimir las imágenes:', error);
    throw new Error('Error al comprimir las imágenes');
  }
};
