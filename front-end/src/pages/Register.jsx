import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      await axios.post("/register", { name, email, password });
      setRedirect(true);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Não foi possível conectar ao servidor. Verifique se o backend está em execução.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (redirect) return <Navigate to="/login" />;

  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Faça seu cadastro</h1>

      <form className="flex w-full max-w-96 flex-col gap-2" onSubmit={handleSubmit}>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          type="text"
          placeholder="Digite seu nome"
        />
        <input
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Digite seu e-mail"
        />
        <input
          required
          minLength="6"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Digite sua senha"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary-400 rounded-full text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      {errorMessage && <p className="text-center text-red-600">{errorMessage}</p>}

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
