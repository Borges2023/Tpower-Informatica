import React, { useEffect, useState } from "react";
import Item from "../components/Item";
import axios from "axios";

const Home = () => {
  const [accomodations, setAccomodations] = useState([]);

  useEffect(() => {
    const getAxios = async () => {
      const { data } = await axios.get("/places");

      setAccomodations([...data, ...data]);
    };

    getAxios();
  }, []);

  return (
    <div className="grid w-full max-w-7xl grid-cols-[repeat(auto-fit,minmax(230px,1fr))] items-center gap-8 px-4 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {accomodations.map((accomodation, index) => (
        <Item {...accomodation} key={index} />
      ))}
    </div>
  );
};

export default Home;
