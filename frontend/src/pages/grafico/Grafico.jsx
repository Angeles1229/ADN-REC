import { useState, useRef } from "react";
import { motion } from "framer-motion";
import "../../styles/grafico.css";

function Grafico({ data }) {
  const containerRef = useRef();
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: "" });

  if (data.length === 0) return null;

  const width = Math.max(data.length * 25 + 150, window.innerWidth * 0.9);
  const height = 400;
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
    <div className="bodyg">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>ADN Analizado</h1>
        <div
          ref={containerRef}
          className="chart-container"
          style={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "10px" }}
        >
          <svg width={width} height={height}>
            <g transform={`translate(${width / 10}, ${height / 2})`}>
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
                      setTooltip({
                        visible: true,
                        x: event.pageX + 15,
                        y: event.pageY - 25,
                        text: `Nucleótido: ${d.nucleotido}<br>Posición: ${d.posicion}<br>Mutación: ${d.isMutated ? "Sí" : "No"}`,
                      });
                    }}
                    onMouseMove={(event) => {
                      setTooltip((prev) => ({ ...prev, x: event.pageX + 15, y: event.pageY - 25 }));
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
                      setTooltip({
                        visible: true,
                        x: event.pageX + 15,
                        y: event.pageY - 25,
                        text: `Nucleótido: ${d.nucleotido}<br>Posición: ${d.posicion}<br>Mutación: ${d.isMutated ? "Sí" : "No"}`,
                      });
                    }}
                    onMouseMove={(event) => {
                      setTooltip((prev) => ({ ...prev, x: event.pageX + 15, y: event.pageY - 25 }));
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

      {/* Tooltip dinámico */}
      {tooltip.visible && (
        <div
          className="tooltip-dna"
          style={{
            position: "absolute",
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "5px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            fontSize: "14px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.text }}
        />
      )}
    </div>
  );
}

export default Grafico;
