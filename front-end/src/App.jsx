import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account/Account";
import axios from "axios";
import UserContextProvider from "./contexts/UserContext";
import Accomodation from "./pages/Accomodation";

axios.defaults.baseURL =
  import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";
axios.defaults.withCredentials = true;

console.log(import.meta.env.MODE);

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/:id?" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/:subpage?" element={<Account />} />
          <Route path="/account/:subpage/:action" element={<Account />} />
          <Route path="/account/:subpage/:action" element={<Account />} />
          <Route path="/place/:id/:booking?" element={<Accomodation />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
