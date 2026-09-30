import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// só o alfabeto latino (cobre ç, ã, ê...) e só os pesos usados: fontes estáticas funcionam em qualquer navegador
import "@fontsource/host-grotesk/latin-400.css";
import "@fontsource/host-grotesk/latin-500.css";
import "@fontsource/host-grotesk/latin-600.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
