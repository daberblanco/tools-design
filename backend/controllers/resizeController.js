// controllers/resizeController.js

const jimp = require('jimp');

exports.resizeImages = async (images, width, height, maintainAspectRatio, doNotEnlarge, resizePercentage) => {
    try {
        const resizedImages = await Promise.all(images.map(async (file) => { // Recorrer todas las imágenes
            let image = await jimp.read(file.buffer); // Leer la imagen con Jimp

            // Redimensionar por porcentaje si se proporciona un porcentaje de redimensionamiento
            if (resizePercentage) {
                width = image.getWidth() * (resizePercentage / 100); // Calcular el nuevo ancho
                height = image.getHeight() * (resizePercentage / 100); // Calcular la nueva altura
            }

            // Calcular nuevas dimensiones si se desea mantener la relación de aspecto
            if (maintainAspectRatio) { // Si se mantiene la relación de aspecto
                if (doNotEnlarge && (width >= image.getWidth() || height >= image.getHeight())) { // No ampliar si la imagen es más pequeña que las dimensiones especificadas
                    // No ampliar si la imagen es más pequeña que las dimensiones especificadas
                    width = image.getWidth(); // Mantener el ancho original
                    height = image.getHeight(); // Mantener la altura original
                } else {
                    // Redimensionar manteniendo la relación de aspecto
                    const aspectRatio = image.getWidth() / image.getHeight(); // Calcular la relación de aspecto
                    if (width / aspectRatio < height) { // Determinar si el ancho o la altura es el factor limitante
                        height = width / aspectRatio; // Redimensionar la altura
                    } else {
                        width = height * aspectRatio; // Redimensionar el ancho
                    }
                }
            }

            const buffer = await image.resize(width, height).getBufferAsync(file.mimetype); // Utiliza el tipo MIME original de la imagen
            return { name: file.originalname, buffer: buffer }; // Devuelve el nombre original y el buffer de la imagen redimensionada
        }));

        console.log('Imágenes redimensionadas:', resizedImages);

        return resizedImages;
    } catch (error) {
        console.error('Error al redimensionar las imágenes:', error);
        throw new Error('Error al redimensionar las imágenes');
    }
};
