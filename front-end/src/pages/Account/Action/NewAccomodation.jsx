import React, { useEffect, useState } from "react";
import Perks from "../../../components/Perks";
import PhotoUploader from "../../../components/PhotoUploader";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";

const NewAccomodation = ({ param }) => {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("");
  const [price, setPrice] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (param !== "new") {
      const axiosGet = async () => {
        try {
          const { data } = await axios.get("/places/" + param);

          setTitle(data.title);
          setAddress(data.address);
          setPhotos(data.photos);
          setDescription(data.description);
          setPerks(data.perks);
          setExtraInfo(data.extraInfo);
          setCheckIn(data.checkIn);
          setCheckOut(data.checkOut);
          setGuests(data.maxGuests);
          setPrice(data.price);
        } catch (error) {}
      };

      axiosGet();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      title &&
      address &&
      photos.length > 0 &&
      description &&
      perks.length > 0 &&
      checkIn &&
      checkOut &&
      guests &&
      price
    ) {
      try {
        const objRequest = {
          title,
          address,
          photos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          guests,
          price,
        };

        if (param !== "new") {
          const { data } = await axios.put("/places/" + param, objRequest);
          console.log(data);
        } else {
          const { data } = await axios.post("/places", objRequest);
          console.log(data);
        }
      } catch (error) {
        alert(`Erro ao salvar a acomodação: ${JSON.stringify(error)}`);
      } finally {
        setRedirect(true);
      }
    } else {
      alert("Preencha todos os campos antes de salvar uma acomodação");
    }
  };

  if (redirect) return <Navigate to="/account/accomodations" />;

  return (
    <form className="flex w-full flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="ml-2 text-2xl font-bold">
          Título
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          id="title"
          placeholder="Digite o título do seu anúncio"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address" className="ml-2 text-2xl font-bold">
          Endereço
        </label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          id="address"
          placeholder="Digite o endereço do seu anúncio"
        />
      </div>

      <PhotoUploader {...{ photos, setPhotos }} />

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="ml-2 text-2xl font-bold">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          id="description"
          placeholder="Coloque aqui a descrição do seu anúncio"
          className="h-54"
        />
      </div>

      <Perks {...{ perks, setPerks }} />

      <div className="flex flex-col gap-2">
        <label htmlFor="extra" className="ml-2 text-2xl font-bold">
          Informações extras
        </label>
        <textarea
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
          id="extra"
          placeholder="Coloque aqui qualquer tipo de informação extra sobre seu anúncio"
          className="h-54"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="ml-2 text-2xl font-bold">Restrições e Preço</h2>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="price" className="ml-2 text-xl font-bold">
              Preço
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              id="price"
              placeholder="500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="checkin" className="ml-2 text-xl font-bold">
              Checkin
            </label>
            <input
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              type="text"
              id="checkin"
              placeholder="16:00"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="checkout" className="ml-2 text-xl font-bold">
              Checkout
            </label>
            <input
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              type="text"
              id="checkout"
              placeholder="12:00"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="guests" className="ml-2 text-xl font-bold">
              N° Convidados
            </label>
            <input
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              type="number"
              id="guests"
              placeholder="6"
            />
          </div>
        </div>
      </div>

      <button className="bg-primary-400 rounded-full text-white">
        Salvar informações
      </button>
    </form>
  );
};

export default NewAccomodation;
