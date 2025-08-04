import { Link, useParams } from "react-router-dom";
import NewAccomodation from "./Action/NewAccomodation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../../components/Image";

const Accomodations = () => {
  const [places, setPlaces] = useState([]);
  const { action } = useParams();
  const editAccomodation = !!action;

  useEffect(() => {
    const axiosGet = async () => {
      const { data } = await axios.get("/places-user");

      // console.log(data);
      setPlaces(data);
    };

    axiosGet();
  }, [action]);

  return editAccomodation ? (
    <NewAccomodation param={action} />
  ) : (
    <>
      <Link
        to="/account/accomodations/new"
        className="button bg-primary-400 hover:bg-primary-500 flex flex-row items-center gap-2 rounded-full text-white"
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
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        Adicionar um lugar
      </Link>

      {places.map((accomodation, index) => (
        <Link
          to={`/account/accomodations/${accomodation._id}`}
          key={index}
          className="flex items-center gap-6 rounded-2xl bg-gray-100 p-6"
        >
          <Image
            className="aspect-square max-w-56 rounded-2xl object-cover"
            src={accomodation.photos[0]}
            alt="Imagem da acomodação"
          />

          <div className="flex flex-col gap-2">
            <p className="text-2xl">{accomodation.title}</p>
            <p>{accomodation.description}</p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Accomodations;
