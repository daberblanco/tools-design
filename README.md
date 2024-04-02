# Tools Design | Herramientas Multimedia
Compress, Resize and Convert files |
Comprime, Redimensiona y Convierte Imágenes en un Solo Lugar

Created by Daber Blanco M. 2024

Created using ReactJS with TailwindCSS for frontend view and NodeJS for backend server.


## Installation Frontend

Use the package manager [npm](https://www.npmjs.com/) to install the packages of the project.
```bash
npm install
```

## Start Frontend ReactJS
Start project for dev environment
```javascript
npm start
```
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.
```javascript
npm run build
```


## Installation Backend

Use the package manager [npm](https://www.npmjs.com/) to install the packages of the project.
```bash
npm install
```


## Start NodeJS Server
Start project for dev environment
```javascript
node app.js
```

## How Works

I used the [Jimp Package](https://www.npmjs.com/package/jimp) for resize images and convert to another format

### Resize

Image resizing adjusts the size of a picture. It works by estimating the colors of new pixels based on existing ones using techniques like interpolation. The resizing algorithm determines how this is done. It's important to maintain the aspect ratio to prevent distortion. Anti-aliasing helps smooth out jagged edges for a better-looking resized image.

![Resize Image](https://qph.cf2.quoracdn.net/main-qimg-2b5852248679e34d07fabfd15940409b)

### Conversion Files

Image format conversion involves the interpretation and reinterpretation of an image's pixel data from one format to another. Each image format has its own data structure and compression methods. During conversion, this data is decompressed, if necessary, and then re-encoded into the destination format, respecting the specific restrictions and characteristics of the new format. This process involves direct manipulation of the image's binary data, ensuring that the visual information is preserved as faithfully as possible in the new format.

### Compression Files

Compressing images Sharp package involves reducing the image size by adjusting the compression quality. When you specify a compression percentage, the Sharp package adjusts the image compression parameters, such as the quality level of the compression algorithm, the compression factor, and the amount of color information retained in the image. This may include reducing the amount of pixel data stored, lowering image resolution, and removing redundant details to achieve a smaller image file. However, it is important to note that higher compression can lead to a noticeable loss of visual quality, especially in images with detailed or high-resolution content.

![Compres Image](https://www.image-engineering.de/content/library/technotes/2011_09_19/algorithm.jpg)


#### From Costa Rica to the world :)