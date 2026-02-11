import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import CityPage from "./pages/CityPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Hero />
            <Categories />
          </>
        }
      />

      <Route path="/city/:name" element={<CityPage />} />
    </Routes>
  );
}

export default App;
