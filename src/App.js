import React, { useState, useEffect } from "react"; // IMPORTANTE: Agregamos useEffect
import "./styles.css";
import RouletteWheel from "./RouletteWheel";
import ConfigPanel from "./ConfigPanel";

const INITIAL_PRIZES = [
  { id: 1, name: "Lechuga", color: "#ff6b6b", weight: 1 },
  { id: 2, name: "Atúl", color: "#feca57", weight: 1 },
  { id: 3, name: "Pan", color: "#1dd1a1", weight: 1 },
  { id: 4, name: "Nombre del objeto", color: "#48dbfb", weight: 1 },
];

export default function App() {
  // --- MAGIA 1: Cargar la partida guardada al iniciar ---
  const [prizes, setPrizes] = useState(() => {
    // Buscamos si hay datos guardados en el "disco duro" del navegador
    const premiosGuardados = localStorage.getItem("ruleta_premios");

    // Si hay datos, los convertimos de texto a lista y los usamos
    if (premiosGuardados) {
      return JSON.parse(premiosGuardados);
    }
    // Si está vacío (primera vez), usamos la lista por defecto
    return INITIAL_PRIZES;
  });

  const [isConfiguring, setIsConfiguring] = useState(false);

  // --- MAGIA 2: Autoguardado cada vez que hay cambios ---
  useEffect(() => {
    // Cada vez que la variable 'prizes' cambia, la guardamos automáticamente
    // Transformamos la lista a texto (JSON.stringify) porque Local Storage solo acepta textos
    localStorage.setItem("ruleta_premios", JSON.stringify(prizes));
  }, [prizes]); // Este corchete dice: "Vigila únicamente la variable prizes"

  return (
    <div className="app-container">
      {isConfiguring ? (
        <ConfigPanel
          initialPrizes={prizes}
          onSave={(nuevosPremios) => {
            setPrizes(nuevosPremios); // Actualiza y el useEffect guarda solito
            setIsConfiguring(false);
          }}
          onClose={() => setIsConfiguring(false)}
        />
      ) : (
        <div className="game-view">
          <div className="titles-container">
            <h1 className="main-title">🌟 GRAN RULETA FAMILIAR 🌟</h1>
            <p className="sub-title">
              ¡Gira y gana increíbles premios, o una lata de atún!
            </p>
          </div>

          <RouletteWheel
            prizes={prizes}
            onOpenConfig={() => setIsConfiguring(true)}
          />
        </div>
      )}
    </div>
  );
}
