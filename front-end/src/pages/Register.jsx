import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(
    //   `Rolou um submit com essas infos: ${name}, ${email}, ${password}`,
    // );

    try {
      const respostaPost = await axios.post("/register", {
        name,
        email,
        password,
      });

      // alert("Usuário cadastrado com sucesso!");

      setRedirect(true);
    } catch (error) {
      alert(
        `Erro no cadastro do usuário ${error.response.data.errorResponse.errmsg}`,
      );
    }
  };

  if (redirect) return <Navigate to="/login" />;

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Faça seu cadastro</h1>

      <form
        className="flex w-full max-w-96 flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Digite seu nome"
        />
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

        <button className="bg-primary-400 rounded-full text-white">
          Cadastrar
        </button>
      </form>

      <p>
        Já tem uma conta?{" "}
        <Link to="/login" className="underline">
          Faça login aqui!
        </Link>
      </p>
    </div>
  );
};

export default Register;
