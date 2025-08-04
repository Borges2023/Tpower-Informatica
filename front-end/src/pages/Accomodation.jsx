import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingBox from "../components/BookingBox";
import numberOfDays from "../utils/numberOfDays";
import Image from "../components/Image";

const Accomodation = () => {
  const { id, booking } = useParams();
  const [place, setPlace] = useState(null);
  const [bookingDoc, setBookingDoc] = useState(null);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    const axiosGet = async () => {
      try {
        const { data } = await axios.get("/places/" + id);

        setPlace(data);
      } catch (error) {
        alert(`Erro ao encontrar o lugar: ${JSON.stringify(error)}`);
      }
    };

    axiosGet();
  }, [id]);

  useEffect(() => {
    if (booking) {
      const axiosGet = async () => {
        try {
          const { data } = await axios.get("/bookings/" + booking);

          setBookingDoc(data);
        } catch (error) {
          alert(`Erro ao encontrar a reserva: ${JSON.stringify(error)}`);
        }
      };

      axiosGet();
    }
  }, [booking]);

  useEffect(() => {
    overlay
      ? document.body.classList.add("overflow-hidden")
      : document.body.classList.remove("overflow-hidden");
  }, [overlay]);

  if (booking && !bookingDoc) return <></>;

  return place ? (
    <div className="flex w-full max-w-7xl flex-col gap-8 p-8">
      {booking ? (
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-gray-100 p-6">
          <p className="text-2xl">Você já tem uma reserva!</p>

          <div>
            <div className="flex gap-2">
              <p>
                <span className="font-semibold">Checkin:</span>{" "}
                {new Date(bookingDoc.checkIn).toLocaleDateString("pt-BR")}
              </p>
              <p>a</p>
              <p>
                <span className="font-semibold">Checkout:</span>{" "}
                {new Date(bookingDoc.checkOut).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <p>
              <span className="font-semibold">Preço total:</span> R${" "}
              {bookingDoc.price}
            </p>

            <p>
              <span className="font-semibold">Noites:</span>{" "}
              {numberOfDays(bookingDoc.checkIn, bookingDoc.checkOut)}
            </p>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-3xl font-semibold">{place.title}</p>

          <div className="flex items-center gap-1">
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
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>

            <p className="">{place.address}</p>
          </div>
        </div>

        <div className="relative grid aspect-[3/2] grid-cols-[2fr_1fr] grid-rows-2 gap-4 overflow-hidden rounded-2xl">
          {place.photos
            .filter((photo, index) => index < 3)
            .map((photo, index) => (
              <div
                key={photo}
                onClick={() => setOverlay(true)}
                className={
                  "cursor-pointer transition hover:opacity-75 " +
                  (index === 0
                    ? "row-span-2"
                    : index === 2
                      ? "column-start-2"
                      : "")
                }
              >
                <Image
                  src={photo}
                  alt="Foto da Acomodação"
                  className={
                    "w-full object-cover " +
                    (index === 0 ? "h-full" : "aspect-square")
                  }
                />
              </div>
            ))}

          <div
            onClick={() => setOverlay(true)}
            className="absolute right-2 bottom-2 flex cursor-pointer gap-2 rounded-lg border border-black bg-white p-2 transition hover:scale-105"
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
                d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <p>Mostrar mais fotos</p>
          </div>
        </div>
      </div>

      <div className={"grid gap-4 " + (booking ? "" : "grid-cols-2")}>
        <div className={"flex flex-col gap-6 px-6"}>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">Description</p>
            <p>{place.description}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">Horários e Restrições</p>

            <div>
              <p>Checkin: {place.checkIn}</p>
              <p>Checkout: {place.checkOut}</p>
              <p>Máximo de convidados: {place.maxGuests}</p>
            </div>
          </div>
        </div>

        {booking ? <></> : <BookingBox place={place} />}
      </div>

      {place.extraInfo ? (
        <div className="flex flex-col gap-6 rounded-2xl bg-gray-100 p-6">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold">Informações Extras</p>
            <p>{place.extraInfo}</p>
          </div>
        </div>
      ) : (
        <></>
      )}

      {overlay ? (
        <div className="fixed inset-0 overflow-auto bg-black p-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute top-3 right-3 size-8 cursor-pointer text-white transition hover:scale-105"
            onClick={() => setOverlay(false)}
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="grid grid-cols-2 gap-4 rounded-2xl">
            {place.photos.map((photo, index) => (
              <div
                key={photo}
                onClick={() => setOverlay(true)}
                className="overflow-hidden rounded-2xl"
              >
                <Image
                  src={photo}
                  alt="Foto da Acomodação"
                  className={"aspect-square w-full object-cover"}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
};

export default Accomodation;
