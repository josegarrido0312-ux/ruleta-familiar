import React, { useState } from "react";
import "./styles.css"; // Asegúrate de que apunte a tu archivo CSS

export default function ConfigPanel({
  prizes: propPrizes,
  initialPrizes,
  onSave,
  onClose,
}) {
  // Recibimos la data venga como initialPrizes o como prizes.
  // El "|| []" es un escudo para que jamás vuelva a explotar el .map() si viene vacío.
  const [prizes, setPrizes] = useState(initialPrizes || propPrizes || []);

  // Función para manejar cambios en los inputs
  const handleChange = (index, field, value) => {
    const updatedPrizes = [...prizes];
    updatedPrizes[index][field] = field === "weight" ? Number(value) : value;
    setPrizes(updatedPrizes);
  };

  // Función para agregar un nuevo premio con un color aleatorio vibrante
  const handleAddPrize = () => {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
    setPrizes([
      ...prizes,
      // NUEVO: Agregamos la propiedad isLoser: false por defecto
      {
        id: Date.now(),
        name: "Nuevo Premio",
        weight: 1,
        color: randomColor,
        isLoser: false,
      },
    ]);
  };

  // Función para eliminar
  const handleDelete = (idToRemove) => {
    // Evitamos que se queden sin premios (mínimo 2 para que sea ruleta)
    if (prizes.length <= 2) {
      alert("¡Debes tener al menos 2 premios en la ruleta!");
      return;
    }
    setPrizes(prizes.filter((prize) => prize.id !== idToRemove));
  };

  const handleRestoreDefaults = () => {
    // Los 4 premios originales con los que arrancó el proyecto
    setPrizes([
      { id: Date.now(), name: "Lechuga", color: "#ff6b6b", weight: 1 },
      { id: Date.now() + 1, name: "Atún", color: "#feca57", weight: 1 },
      { id: Date.now() + 2, name: "Pan", color: "#1dd1a1", weight: 1 },
      {
        id: Date.now() + 3,
        name: "Premio Especial",
        color: "#48dbfb",
        weight: 1,
      },
    ]);
  };

  // --- NUEVO: Función para Limpiar Todo ---
  const handleClearAll = () => {
    // Dejamos 2 premios genéricos obligatorios para no romper la ruleta
    setPrizes([
      { id: Date.now(), name: "Opción 1", color: "#a55eea", weight: 1 },
      { id: Date.now() + 1, name: "Opción 2", color: "#fc5c65", weight: 1 },
    ]);
  };

  return (
    <div className="config-overlay">
      <div className="config-panel">
        <div className="config-header">
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
          <h2>Configuración</h2>
          <div className="spacer"></div>
        </div>

        <div className="config-labels">
          <span>Relación</span>
        </div>

        <div className="prizes-list">
          {prizes.map((prize, index) => (
            <div key={prize.id} className="prize-row">
              {/* EL TRUCO DEL COLOR: Un wrapper que esconde el input real */}
              <div
                className="color-picker-wrapper"
                style={{ backgroundColor: prize.color }}
              >
                <input
                  type="color"
                  value={prize.color || "#ffffff"}
                  onChange={(e) => handleChange(index, "color", e.target.value)}
                />
              </div>

              <input
                type="text"
                className="prize-name-input"
                value={prize.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="Nombre del premio"
              />

              {/* NUEVO: Botón para cambiar entre Premio y Castigo */}
              <button
                className={`type-btn ${
                  prize.isLoser ? "is-loser" : "is-winner"
                }`}
                onClick={() => handleChange(index, "isLoser", !prize.isLoser)}
                title={prize.isLoser ? "Es un castigo" : "Es un premio"}
              >
                {prize.isLoser ? "💀" : "🎁"}
              </button>

              <input
                type="number"
                className="prize-weight-input"
                value={prize.weight}
                min="1"
                onChange={(e) => handleChange(index, "weight", e.target.value)}
              />

              <button
                className="delete-btn"
                onClick={() => handleDelete(prize.id)}
              >
                <span className="minus-icon">−</span>
              </button>
            </div>
          ))}
        </div>

        <div className="config-actions">
          {/* NUEVO: Fila de botones masivos */}
          <div className="mass-actions-row">
            <button className="secondary-btn" onClick={handleClearAll}>
              🧹 Limpiar Todo
            </button>
            <button className="secondary-btn" onClick={handleRestoreDefaults}>
              🔄 Restaurar
            </button>
          </div>

          <button className="add-btn" onClick={handleAddPrize}>
            + Agregar Premio
          </button>
          <button className="save-btn" onClick={() => onSave(prizes)}>
            HECHO
          </button>
        </div>
      </div>
    </div>
  );
}
