import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../../components/Image";
import numberOfDays from "../../utils/numberOfDays.js";

const Bookings = () => {
  const [bookingList, setBookingList] = useState([]);
  const [placesList, setPlacesList] = useState([]);

  useEffect(() => {
    const getAxios = async () => {
      try {
        const { data } = await axios.get("/bookings");
        setBookingList(data);
      } catch (error) {
        alert(`Erro ao buscar a lista de reservas: ${JSON.stringify(error)}`);
      }
    };

    getAxios();
  }, []);

  return bookingList.map((booking, index) => {
    const { place, _id, checkIn, checkOut, price } = booking;

    return (
      <Link
        to={`/place/${place._id}/${_id}`}
        key={index}
        className="flex w-full items-center gap-6 rounded-2xl bg-gray-100 p-6"
      >
        <Image
          className="aspect-square max-w-40 rounded-2xl object-cover"
          src={place.photos[0]}
          alt="Imagem da acomodação"
        />

        <div className="flex flex-col gap-2">
          <p className="text-2xl">{place.title}</p>

          <div>
            <div className="flex gap-2">
              <p>
                <span className="font-semibold">Checkin:</span>{" "}
                {new Date(checkIn).toLocaleDateString("pt-BR")}
              </p>
              <p>a</p>
              <p>
                <span className="font-semibold">Checkout:</span>{" "}
                {new Date(checkOut).toLocaleDateString("pt-BR")}
              </p>
            </div>

            <p>
              <span className="font-semibold">Preço total:</span> R$ {price}
            </p>

            <p>
              <span className="font-semibold">Noites:</span>{" "}
              {numberOfDays(checkIn, checkOut)}
            </p>
          </div>
        </div>
      </Link>
    );
  });
};

export default Bookings;
