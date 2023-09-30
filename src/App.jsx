import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { LandingPage } from "./pages/LandingPage";
import { Details } from "./pages/Details";

function App() {
  return (
    <>
      <Header title="Cinepolis" />
      <Routes>
        <Route path="/" exact Component={LandingPage} />
        <Route path="/movies/:id" exact Component={Details} element={Details} />
      </Routes>
    </>
  );
}

export default App;
