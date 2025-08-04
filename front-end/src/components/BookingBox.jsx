import React, { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import numberOfDays from "../utils/numberOfDays";

const BookingBox = ({ place: { price, _id: id } }) => {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [guests, setGuests] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useUserContext();

  const handleClick = async () => {
    if (dateStart && dateEnd && guests && user) {
      try {
        const { data } = await axios.post("/booking", {
          checkIn: dateStart,
          checkOut: dateEnd,
          price: price * numberOfDays(dateStart, dateEnd),
          guests,
          user: user.id,
          place: id,
        });

        setRedirect(data._id);
      } catch (error) {
        alert(`Erro ao criar uma nova reserva: ${JSON.stringify(error)}`);
      }
    }
  };

  if (redirect) return <Navigate to={"/account/bookings/" + redirect} />;

  return (
    <div className="flex flex-col items-center gap-4 self-start justify-self-center rounded-3xl border border-gray-300 px-8 py-4">
      <p className="text-2xl font-semibold">Preço: R$ {price} por noite</p>

      <div className="flex">
        <div className="flex flex-col rounded-tl-2xl rounded-bl-2xl border border-gray-300 px-4 py-2">
          <label className="font-semibold" htmlFor="date-start">
            Checkin
          </label>
          <input
            className="cursor-pointer"
            type="date"
            id="date-start"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
        </div>

        <div className="flex flex-col rounded-tr-2xl rounded-br-2xl border border-l-0 border-gray-300 px-4 py-2">
          <label className="font-semibold" htmlFor="date-end">
            Checkout
          </label>
          <input
            className="cursor-pointer"
            type="date"
            id="date-end"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-2xl border border-gray-300 px-4 py-2">
        <label className="font-semibold" htmlFor="guests">
          N° de convidados
        </label>
        <input
          className="cursor-pointer"
          type="number"
          id="guests"
          placeholder="2"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        />
      </div>

      {user ? (
        <button
          onClick={handleClick}
          className="bg-primary-400 hover:bg-primary-500 w-full rounded-full text-white"
        >
          Reservar
        </button>
      ) : (
        <Link
          to={"/login/" + id}
          className="w-full cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-center font-bold transition hover:bg-gray-100"
        >
          Fazer login
        </Link>
      )}
    </div>
  );
};

export default BookingBox;
