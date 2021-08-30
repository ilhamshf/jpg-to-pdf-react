import React, { ChangeEventHandler } from "react";

import * as Helpers from "./helpers";
import { CustomImage } from "./custom-image";
import "./App.css";

function App() {
  const [uploadedImages, setUploadedImages] = React.useState<CustomImage[]>([]);

  const handleImageUpload = React.useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      const fileList = event.target.files;
      const fileArray = fileList ? Array.from(fileList) : [];
      const fileToImagePromises = fileArray.map(Helpers.fileToImageURL);

      Promise.all(fileToImagePromises).then(setUploadedImages);
    },
    [setUploadedImages]
  );

  const cleanUpUploadedImages = React.useCallback(() => {
    setUploadedImages([]);
    uploadedImages.forEach((image) => {
      URL.revokeObjectURL(image.src);
    });
  }, [setUploadedImages, uploadedImages]);

  const generatePdfFromImages = React.useCallback(() => {
    Helpers.generatePdfFromImages(uploadedImages);
    cleanUpUploadedImages();
  }, [uploadedImages, cleanUpUploadedImages]);

  return (
    <>
      <h1>Convert Gambar ke PDF</h1>
      <h3>klo ada error wa aku kak hehe</h3>

      <div className="images-container">
        {uploadedImages.length > 0 ? (
          uploadedImages.map((image) => (
            <img key={image.src} src={image.src} alt={image.src} className="uploaded-image" />
          ))
        ) : (
          <p>Upload gambar dulu kak baru buat pdf...</p>
        )}
      </div>

      <div className="buttons-container">
        <label htmlFor="file-input">
          <span className="button">Upload Gambar</span>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            multiple
          />
        </label>

        <button
          onClick={generatePdfFromImages}
          className="button"
          disabled={uploadedImages.length === 0}
        >
          Buat PDF
        </button>
      </div>
    </>
  );
}

export default App;
