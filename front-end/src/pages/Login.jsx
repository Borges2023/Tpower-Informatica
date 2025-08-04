import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();

  const { setUser } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(`Rolou um submit com essas infos: ${email}, ${password}`);

    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });

      setUser(data);

      // alert("Login realizado com sucesso!");

      setRedirect(true);
    } catch (error) {
      alert(`Erro ao efetuar o login: ${error.response.data}`);
    }
  };

  if (redirect) {
    return id ? <Navigate to={"/place/" + id} /> : <Navigate to="/" />;
  }

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Faça seu login</h1>

      <form
        className="flex w-full max-w-96 flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Digite seu e-mail"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Digite sua senha"
        />

        <button
          type="submit"
          className="bg-primary-400 rounded-full text-white"
        >
          Login
        </button>
      </form>

      <p>
        Ainda não tem uma conta?{" "}
        <Link to="/register" className="underline">
          Registre-se aqui!
        </Link>
      </p>
    </div>
  );
};

export default Login;
