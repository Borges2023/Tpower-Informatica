import axios from "axios";
import React, { useState } from "react";
import Image from "./Image";

const PhotoUploader = ({ photos, setPhotos }) => {
  const [photoLink, setPhotoLink] = useState("");

  const removePhoto = (filename) => {
    setPhotos((prevPhotos) => [
      ...prevPhotos.filter((photo) => photo !== filename),
    ]);
  };

  const promotePhoto = (filename) => {
    setPhotos((prevPhotos) => [
      filename,
      ...prevPhotos.filter((photo) => photo !== filename),
    ]);
  };

  const uploadPhoto = async (e) => {
    const { files } = e.target;
    const formData = new FormData();
    const filesArray = [...files];

    filesArray.forEach((file) => formData.append("files", file));

    if (filesArray.length > 0) {
      try {
        const { data } = await axios.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setPhotos((prevArray) => [...prevArray, ...data]);
      } catch (error) {
        alert(`Erro ao fazer o upload: ${JSON.stringify(error)}`);
      }
    }
  };

  const sendPhoto = async (e) => {
    e.preventDefault();

    try {
      if (photoLink) {
        const { data } = await axios.post("/upload-by-link", {
          link: photoLink,
        });

        setPhotos((prevArray) => [...prevArray, data]);
      }

      setPhotoLink("");
    } catch (error) {
      alert(`Erro ao enviar a imagem ${JSON.stringify(error)}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="photos" className="ml-2 text-2xl font-bold">
        Fotos
      </label>

      <div className="flex w-full gap-2">
        <input
          value={photoLink}
          onChange={(e) => setPhotoLink(e.target.value)}
          type="text"
          id="photos"
          placeholder="Digite o endereço do seu anúncio"
          className="grow"
        />
        <button
          onClick={sendPhoto}
          className="rounded-full bg-gray-100 hover:bg-gray-200"
        >
          Enviar foto
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {photos.map((currPhoto, index) => (
          <div className="relative" key={index}>
            <Image
              src={currPhoto}
              alt="Foto da acomodação"
              className="aspect-square rounded-3xl object-cover"
            />

            <div
              onClick={() => promotePhoto(currPhoto)}
              className="hover:bg-primary-400 absolute right-3 bottom-3 aspect-square -translate-x-[110%] cursor-pointer rounded-full bg-white p-2 opacity-75 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </div>

            <div
              onClick={() => removePhoto(currPhoto)}
              className="hover:bg-primary-400 absolute right-3 bottom-3 aspect-square cursor-pointer rounded-full bg-white p-2 opacity-75 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          </div>
        ))}

        <label
          htmlFor="file"
          className="flex aspect-square cursor-pointer items-center justify-center gap-4 rounded-3xl border border-gray-300 px-4 py-2 font-bold transition"
        >
          <input
            type="file"
            id="file"
            className="hidden"
            multiple
            onChange={uploadPhoto}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Fazer upload
        </label>
      </div>
    </div>
  );
};

export default PhotoUploader;
