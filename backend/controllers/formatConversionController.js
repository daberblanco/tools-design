// controllers/formatConversionController.js

const jimp = require('jimp');

exports.convertFormat = async (images, format) => {
  try {
    const convertedImages = await Promise.all(images.map(async (file) => { // Recorrer todas las imágenes
      const image = await jimp.read(file.buffer); // Leer la imagen con Jimp
      let mime; // Variable para almacenar el tipo MIME de la imagen convertida
      switch (format.toLowerCase()) { // Convertir el formato a minúsculas para comparar
        case 'jpg':
        case 'jpeg':
          mime = jimp.MIME_JPEG;
          break;
        case 'png':
          mime = jimp.MIME_PNG;
          break;
        // Añade más casos según sea necesario.
        default:
          mime = jimp.MIME_JPEG; // Un valor predeterminado, considera lanzar un error si el formato no es soportado.
      }

      const buffer = await image.getBufferAsync(mime); // Obtener el buffer de la imagen en el nuevo formato
      const newName = file.originalname.replace(/\.[^/.]+$/, `.${format}`); // Cambiar la extensión del nombre del archivo
      return { name: newName, buffer: buffer }; // Devolver el nombre y el buffer de la imagen convertida
    }));

    console.log('Imágenes convertidas:', convertedImages);

    return convertedImages;
  } catch (error) {
    console.error('Error al convertir el formato de las imágenes:', error);
    throw new Error('Error al convertir el formato de las imágenes');
  }
};
