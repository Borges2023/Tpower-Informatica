import React, { useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import Profile from "./Profile";
import { useUserContext } from "../../contexts/UserContext";
import Accomodations from "./Accomodations";
import Bookings from "./Bookings";

const Account = () => {
  const [redirect, setRedirect] = useState(false);

  let { subpage } = useParams();

  const { user, ready } = useUserContext();

  if (ready && !user && !redirect) return <Navigate to={"/login"} />;

  subpage = subpage ?? "profile";

  const handleButtonClass = (buttonName) => {
    let textClass =
      "hover:bg-primary-400 rounded-full px-4 py-2 font-medium transition hover:text-white";

    if (buttonName === subpage) textClass += " bg-primary-400 text-white";

    return textClass;
  };

  return (
    <>
      <div className="flex w-full max-w-7xl grow flex-col items-center gap-8 px-4 py-8">
        <div className="flex cursor-pointer items-center gap-2">
          <Link
            to={"/account/profile"}
            className={handleButtonClass("profile")}
          >
            Perfil
          </Link>
          <Link
            to={"/account/bookings"}
            className={handleButtonClass("bookings")}
          >
            Reservas
          </Link>
          <Link
            to={"/account/accomodations"}
            className={handleButtonClass("accomodations")}
          >
            Acomodações
          </Link>
        </div>

        {subpage === "profile" ? (
          <Profile {...{ redirect, setRedirect }} />
        ) : subpage === "accomodations" ? (
          <Accomodations />
        ) : (
          <Bookings />
        )}
      </div>
    </>
  );
};

export default Account;
