import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Image from "./Image";

const Item = ({ _id: id, description, price, photos, address }) => {
  if (!photos) return <></>;

  return (
    <Link to={"/place/" + id} className="flex flex-col gap-2">
      <Image
        src={photos[0]}
        alt="Imagem do lugar"
        className="aspect-square overflow-hidden rounded-2xl object-cover"
      />

      <div>
        <h2 className="truncate text-lg font-semibold">{address}</h2>
        <p className="truncate text-gray-600 hover:text-ellipsis">
          {description}
        </p>
      </div>

      <p>
        <span className="font-semibold">R$ {price}</span> por noite
      </p>
    </Link>
  );
};

export default Item;
