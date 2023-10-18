"use client";

import MapboxMap from "./components/map/reactMap";
import dotenv from "dotenv";
dotenv.config();
function App() {
  return (
    <>
      <MapboxMap />
    </>
  );
}

export default App;
