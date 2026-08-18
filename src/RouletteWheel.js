import React, { useState } from "react";
import confetti from "canvas-confetti";
import "./styles.css";

export default function RouletteWheel({ prizes, onOpenConfig }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showModal, setShowModal] = useState(false); // Nuevo estado para retrasar el cartel

  const totalWeight = prizes.reduce((acc, prize) => acc + prize.weight, 0);

  const preparedPrizes = prizes.map((prize, index) => {
    const previousWeightSum = prizes
      .slice(0, index)
      .reduce((sum, p) => sum + p.weight, 0);
    const startPercent = (previousWeightSum / totalWeight) * 100;
    const endPercent = ((previousWeightSum + prize.weight) / totalWeight) * 100;
    const gradientStop = `${prize.color} ${startPercent}% ${endPercent}%`;
    const startAngle = (startPercent / 100) * 360;
    const endAngle = (endPercent / 100) * 360;
    const textAngle = startAngle + (endAngle - startAngle) / 2 - 90;

    // Guardamos los porcentajes para saber qué parte NO oscurecer al ganar
    return {
      ...prize,
      gradientStop,
      textAngle,
      startAngle,
      endAngle,
      startPercent,
      endPercent,
    };
  });

  const gradientStops = preparedPrizes.map((p) => p.gradientStop).join(", ");

  // --- SINTETIZADOR DEFINITIVO: Equilibrio perfecto ---
  let audioCtx;
  const playMechanicalTick = (progress = 0) => {
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const time = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";

      const startFreq = 600 - progress * 200;
      osc.frequency.setValueAtTime(startFreq, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.02);

      const currentVolume = 0.15 + progress * 0.25;

      gain.gain.setValueAtTime(currentVolume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(time);
      osc.stop(time + 0.03);
    } catch (e) {}
  };

  // --- NUEVO: Sintetizador de Celebración (Campanitas Mágicas) ---
  const playDrumRoll = () => {
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const time = audioCtx.currentTime;
      const duration = 1.5;

      // Oscilador 1: Tono profundo que va subiendo (crea la tensión principal)
      const osc1 = audioCtx.createOscillator();
      osc1.type = "sine"; // Onda súper suave y limpia para audífonos
      osc1.frequency.setValueAtTime(100, time); // Empieza grave
      osc1.frequency.exponentialRampToValueAtTime(700, time + duration); // Sube a agudo

      // Oscilador 2: Tono secundario (una quinta arriba) que engorda el sonido creando "misterio"
      const osc2 = audioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(150, time);
      osc2.frequency.exponentialRampToValueAtTime(1050, time + duration);

      // Control de volumen para el Oscilador 1
      const gain1 = audioCtx.createGain();
      gain1.gain.setValueAtTime(0.01, time); // Entra como un susurro
      gain1.gain.exponentialRampToValueAtTime(0.35, time + duration - 0.05); // Sube al clímax
      gain1.gain.linearRampToValueAtTime(0.001, time + duration);

      // Control de volumen para el Oscilador 2 (un poco más bajo para que solo acompañe)
      const gain2 = audioCtx.createGain();
      gain2.gain.setValueAtTime(0.01, time);
      gain2.gain.exponentialRampToValueAtTime(0.2, time + duration - 0.05);
      gain2.gain.linearRampToValueAtTime(0.001, time + duration);

      // Conectamos los cables virtuales
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);

      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      // ¡Encendemos la carga de energía!
      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration);
      osc2.stop(time + duration);
    } catch (e) {}
  };

  // --- NUEVO: Victoria "¡Ta-Daa!" (Punto Dulce Festivo) ---
  const playWinSound = () => {
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const time = audioCtx.currentTime;

      const playChord = (frequencies, startTime, dur, vol) => {
        frequencies.forEach((freq) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = "triangle"; // Mantenemos la onda suave

          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(startTime);
          osc.stop(startTime + dur);
        });
      };

      // VOLUMEN FESTIVO: Subimos a 0.07 para el arranque y 0.09 para el acorde final
      playChord([392.0, 493.88, 587.33], time, 0.2, 0.07);
      playChord([523.25, 659.25, 783.99, 1046.5], time + 0.25, 1.5, 0.09);
    } catch (e) {}
  };

  // --- FASE 3: SONIDO DE DERROTA (Trompeta triste) ---
  const playLoseSound = () => {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();

      const time = audioCtx.currentTime;

      // Función auxiliar para tocar una nota rasposa (sawtooth)
      const playSadNote = (freq, startTime, dur, isLast = false) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Usamos onda de sierra porque suena más como un zumbido/trompeta
        osc.type = "sawtooth";

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.frequency.setValueAtTime(freq, startTime);

        // Si es la última nota, deslizamos el tono hacia abajo (efecto de caída)
        if (isLast) {
          osc.frequency.exponentialRampToValueAtTime(
            freq * 0.5,
            startTime + dur
          );
        }

        gain.gain.setValueAtTime(0, startTime);
        // Volumen inicial
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
        // Desvanecimiento de la nota
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

        osc.start(startTime);
        osc.stop(startTime + dur);
      };

      // Secuencia de 4 notas descendentes
      playSadNote(311.13, time, 0.4); // Eb4
      playSadNote(293.66, time + 0.4, 0.4); // D4
      playSadNote(277.18, time + 0.8, 0.4); // Db4
      playSadNote(261.63, time + 1.2, 1.5, true); // C4 (Esta nota cae y dura más)
    } catch (e) {
      console.log("Error de audio:", e);
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);
    setShowModal(false);

    let isTickRunning = true;
    const startTime = Date.now();
    const duration = 8000;

    const playDynamicTick = () => {
      if (!isTickRunning) return;
      let elapsed = Date.now() - startTime;
      if (elapsed >= duration) return;

      let progress = elapsed / duration;

      playMechanicalTick(progress);

      // RITMO MEJORADO: Empezamos en 45ms (para que se distingan los golpes) y frena hasta 600ms
      let nextDelay = 45 + Math.pow(progress, 2.5) * 600;

      setTimeout(playDynamicTick, nextDelay);
    };

    playMechanicalTick(0);
    playDynamicTick();

    const randomExtraDegrees = Math.floor(Math.random() * 360);
    const newRotation = rotation + 3600 + randomExtraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      isTickRunning = false;

      const actualRotation = newRotation % 360;
      const pointingAngle = (360 - actualRotation) % 360;

      const winningPrize = preparedPrizes.find(
        (p) => pointingAngle >= p.startAngle && pointingAngle < p.endAngle
      );

      setWinner(winningPrize);

      // --- ¡LA RUEDA SE DETIENE Y COMIENZA EL REDOBLE! ---
      playDrumRoll();

      // Esperamos los 1.5 segundos de tensión (mientras suena el redoble)
      setTimeout(() => {
        setShowModal(true);

        // ¡EXPLOTA LA VICTORIA! (¡Ta-Daa!)
        // FASE 4: Evaluamos si es castigo o premio para el sonido
        if (winningPrize.isLoser) {
          playLoseSound();
        } else {
          playWinSound();

          // El confeti va AQUÍ ADENTRO, así no celebramos los castigos
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: [
              "#ff4757",
              "#feca57",
              "#1dd1a1",
              "#48dbfb",
              "#a55eea",
              "#ffffff",
            ],
            zIndex: 1000,
          });
        }
      }, 1500); // <- RECUPERAMOS EL CIERRE DEL PRIMER SETTIMEOUT
    }, duration); // <- RECUPERAMOS EL CIERRE DEL GIRO DE LA RULETA
  }; // <- CIERRE DE LA FUNCIÓN SPINWHEEL

  // Lógica de reacciones de la mascota
  let mascotEmoji = "😃";
  let mascotClass = "idle";
  if (isSpinning) {
    mascotEmoji = "😲"; // Cara de sorpresa o tensión mientras gira
    mascotClass = "spinning";
  } else if (winner) {
    // FASE 4: Si hay ganador, revisamos si es un castigo
    if (winner.isLoser) {
      mascotEmoji = "🤢"; // Cara de mareo o derrota
      mascotClass = "mascot-loser"; // Este es el CSS que vuelve todo azul y tembloroso
    } else {
      mascotEmoji = "🥳"; // Cara de fiesta si es premio
      mascotClass = "winner";
    }
  }

  return (
    <div className="roulette-container">
      <div className="roulette-header">
        <button className="icon-btn" onClick={onOpenConfig}>
          <span>⚙️</span>
        </button>
      </div>

      {/* LUCES DE ESCENARIO DE FONDO */}
      <div className="spotlight left"></div>
      <div className="spotlight right"></div>

      {/* NUEVA ESTRUCTURA DIVIDIDA */}
      <div className="game-area">
        {/* LADO IZQUIERDO: LA RULETA */}
        <div className="wheel-section">
          <div className="wheel-wrapper">
            <div className="casino-ring"></div>
            <div className="pointer"></div>

            <div
              className="wheel"
              style={{
                background: `conic-gradient(${gradientStops})`,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {/* MAGIA: Overlay negro que deja transparente solo al ganador */}
              {winner && !isSpinning && (
                <div
                  className="wheel-highlight-overlay"
                  style={{
                    background: `conic-gradient(rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.65) ${winner.startPercent}%, transparent ${winner.startPercent}%, transparent ${winner.endPercent}%, rgba(0,0,0,0.65) ${winner.endPercent}%, rgba(0,0,0,0.65) 100%)`,
                  }}
                ></div>
              )}

              {preparedPrizes.map((prize) => {
                const dynamicFontSize =
                  prizes.length > 14
                    ? "14px"
                    : prizes.length > 8
                    ? "18px"
                    : "24px";
                return (
                  <React.Fragment key={prize.id}>
                    <div
                      className="slice-border"
                      style={{ transform: `rotate(${prize.endAngle - 90}deg)` }}
                    />
                    <div
                      className="prize-label"
                      style={{ transform: `rotate(${prize.textAngle}deg)` }}
                    >
                      <span
                        className="prize-text"
                        style={{ fontSize: dynamicFontSize }}
                      >
                        {prize.name}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <button
              className="spin-btn"
              onClick={spinWheel}
              disabled={isSpinning}
            >
              START
            </button>
          </div>

          {/* SOMBRA / REFLEJO EN EL PISO */}
          <div className="floor-shadow"></div>
        </div>

        {/* LADO DERECHO: LA MASCOTA */}
        <div className="mascot-section">
          <div className={`mascot ${mascotClass}`}>{mascotEmoji}</div>
        </div>
      </div>

      {/* MODAL DEL GANADOR */}
      {showModal && winner && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {winner.isLoser
                ? "💀 ¡Qué mala suerte! 💀"
                : "🎉 ¡Felicidades ganaste! 🎉"}
            </h2>
            <div className="winner-name" style={{ color: winner.color }}>
              {winner.name}
            </div>
            <button
              className="close-modal-btn"
              onClick={() => {
                setWinner(null);
                setShowModal(false);
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
