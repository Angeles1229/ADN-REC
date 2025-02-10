import { useState, useRef } from "react";
import { motion } from "framer-motion";
import "../../styles/grafico.css";

function Grafico({ data }) {
  const containerRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  if (data.length === 0) return null;

  const width = Math.max(data.length * 25 + 150, window.innerWidth * 0.9);
  const height = 350; // Reduciendo la altura total del gráfico
  const radius = 12;
  const helixSpacing = 50;
  const curveHeight = 80;
  const xSpacing = 30;

  const colors = {
    A: "#FF5733",
    T: "#337BFF",
    C: "#33FF57",
    G: "#FFC733",
    mutacion: "#D433FF",
  };

  const nucleotidos = data.map((d, i) => {
    const x = i * xSpacing;
    const y1 = Math.sin(i * 0.3) * curveHeight - helixSpacing;
    const y2 = Math.sin(i * 0.3) * curveHeight + helixSpacing;

    const nucleotido = d.nucleotido ? d.nucleotido.trim().toUpperCase() : "";
    const isMutated = d.mutacion === true;
    const baseColor = colors[nucleotido] || "#999";
    const mutationColor = colors.mutacion;

    return { x, y1, y2, color: isMutated ? mutationColor : baseColor, nucleotido, isMutated, posicion: d.posicion };
  });

  return (
    <div className="bodyg" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      {/* Contenedor del gráfico con posición relativa para contener la leyenda */}
      <div style={{ position: "relative", textAlign: "center", marginTop: "-30px" }}> {/* Subir todo */}
        <h1 style={{ color: "#33FF57", marginBottom: "5px" }}>ADN Analizado</h1>

        <div
          ref={containerRef}
          className="chart-container"
          style={{
            width: "100%",
            overflowX: "auto",
            whiteSpace: "nowrap",
            paddingBottom: "10px",
            position: "relative",
            display: "flex",
          }}
        >
          {/* Leyenda en la parte superior izquierda dentro del gráfico */}
          <div
            className="leyenda"
            style={{
              position: "absolute",
              top: "5px", // Se subió más
              left: "10px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: "10px",
              borderRadius: "5px",
              color: "#fff",
              fontSize: "14px",
            }}
          >
            <h3 style={{ margin: "0 0 5px 0", fontSize: "14px", textAlign: "left" }}>Leyenda</h3>
            {Object.entries(colors).map(([key, color]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: color,
                    marginRight: "8px",
                    borderRadius: "3px",
                  }}
                ></div>
                <span>
                  {key === "A" ? "Adenina (A)" : key === "T" ? "Timina (T)" : key === "C" ? "Citosina (C)" : key === "G" ? "Guanina (G)" : "Mutación"}
                </span>
              </div>
            ))}
          </div>

          {/* SVG con el gráfico */}
          <svg width={width} height={height}>
            <g transform={`translate(${width / 10}, ${height / 2 - 20})`}> {/* Se subió todo el gráfico */}
              {nucleotidos.map((d, i) => (
                <g key={i}>
                  {/* Animación de círculos con framer-motion */}
                  <motion.circle
                    cx={d.x}
                    cy={d.y1}
                    r={radius}
                    fill={d.color}
                    opacity={0.8}
                    animate={{ cy: [d.y1 - 10, d.y1 + 10] }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }}
                    onMouseEnter={(event) => {
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip({
                        visible: true,
                        x: event.clientX - rect.left + 10,
                        y: event.clientY - rect.top - 10,
                        text: `Nucleótido: ${d.nucleotido}<br>Posición: ${d.posicion}<br>Mutación: ${d.isMutated ? "Sí" : "No"}`,
                      });
                    }}
                    onMouseMove={(event) => {
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip((prev) => ({
                        ...prev,
                        x: event.clientX - rect.left + 10,
                        y: event.clientY - rect.top - 10,
                      }));
                    }}
                    onMouseLeave={() => {
                      setTooltip({ visible: false, x: 0, y: 0, text: "" });
                    }}
                  />
                  <motion.circle
                    cx={d.x}
                    cy={d.y2}
                    r={radius}
                    fill={d.color}
                    opacity={0.8}
                    animate={{ cy: [d.y2 - 10, d.y2 + 10] }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5, ease: "easeInOut" }}
                    onMouseEnter={(event) => {
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip({
                        visible: true,
                        x: event.clientX - rect.left + 10,
                        y: event.clientY - rect.top - 10,
                        text: `Nucleótido: ${d.nucleotido}<br>Posición: ${d.posicion}<br>Mutación: ${d.isMutated ? "Sí" : "No"}`,
                      });
                    }}
                    onMouseMove={(event) => {
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip((prev) => ({
                        ...prev,
                        x: event.clientX - rect.left + 10,
                        y: event.clientY - rect.top - 10,
                      }));
                    }}
                    onMouseLeave={() => {
                      setTooltip({ visible: false, x: 0, y: 0, text: "" });
                    }}
                  />

                  {/* Línea curva entre los círculos */}
                  <path
                    d={`M ${d.x},${d.y1} Q ${d.x + radius},${(d.y1 + d.y2) / 2} ${d.x},${d.y2}`}
                    stroke="#666"
                    fill="none"
                    strokeWidth={2}
                    strokeOpacity={0.8}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Grafico;
