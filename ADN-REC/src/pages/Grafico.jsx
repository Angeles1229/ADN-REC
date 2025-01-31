import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../styles/grafico.css";

function Grafico({ data }) {
  const svgRef = useRef();
  const containerRef = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    console.log("Datos recibidos en React:", data);

    if (data.length > 0) {
      const width = data.length * 25 + 150; // Reducido para menor tamaño
      const height = 400; // Reducido para hacer más compacto
      const radius = 10; // Tamaño más pequeño
      const helixSpacing = 50; // Menos separación en la hélice
      const curveHeight = 80; // Menos altura de curvatura
      const xSpacing = 25; // Menos separación entre pares de bases

      const colors = {
        A: "#FF5733",
        T: "#337BFF",
        C: "#33FF57",
        G: "#FFC733",
        mutacion: "#D433FF",
      };

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const g = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 10}, ${height / 2})`);

      data.forEach((d, i) => {
        const x = i * xSpacing;
        const y1 = Math.sin(i * 0.3) * curveHeight - helixSpacing;
        const y2 = Math.sin(i * 0.3) * curveHeight + helixSpacing;

        const nucleotido = d["nucleotido"] ? d["nucleotido"].trim().toUpperCase() : undefined;
        const isMutated =
          d["mutacion"] !== null &&
          d["mutacion"] !== undefined &&
          String(d["mutacion"]).trim() !== "" &&
          String(d["mutacion"]).toUpperCase() !== "NAN";

        const baseColor = colors[nucleotido] || "#999";
        const mutationColor = colors.mutacion;

        console.log(`Nucleótido: ${nucleotido}, Color: ${baseColor}, Mutado: ${isMutated}`);

        // Dibujar las bases nitrogenadas
        g.append("circle")
          .attr("cx", x)
          .attr("cy", y1)
          .attr("r", radius)
          .attr("fill", baseColor);

        g.append("circle")
          .attr("cx", x)
          .attr("cy", y2)
          .attr("r", radius)
          .attr("fill", baseColor);

        if (isMutated) {
          g.append("circle")
            .attr("cx", x)
            .attr("cy", y1)
            .attr("r", radius * 0.8)
            .attr("fill", mutationColor)
            .attr("stroke", "#000")
            .attr("stroke-width", "1.5px");

          g.append("circle")
            .attr("cx", x)
            .attr("cy", y2)
            .attr("r", radius * 0.8)
            .attr("fill", mutationColor)
            .attr("stroke", "#000")
            .attr("stroke-width", "1.5px");
        }

        // Conexión entre pares de bases (corrección de línea blanca)
        g.append("path")
          .attr("d", `M ${x},${y1} Q ${x + radius},${(y1 + y2) / 2} ${x},${y2}`)
          .attr("stroke", "#888") // Cambiado a gris en vez de blanco
          .attr("fill", "none")
          .attr("stroke-width", 2); // Reducido para menor visibilidad
      });
    }
  }, [data]);

  const handleScroll = (event) => {
    const newScroll = event.target.value;
    setScrollPosition(newScroll);
    containerRef.current.scrollLeft = newScroll;
  };

  return (
    <div className="bodyg">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>ADN Analizado</h1>
        <div
          ref={containerRef}
          className="chart-container"
          style={{
            width: "100%",
            overflowX: "auto",
            whiteSpace: "nowrap",
            border: "1px solid #ddd",
            paddingBottom: "10px",
          }}
        >
          <svg ref={svgRef}></svg>
        </div>

        <div className="legend">
          <h3>Leyenda</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ backgroundColor: "#FF5733", width: "18px", height: "18px" }}></div> <span>Adenina (A)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ backgroundColor: "#337BFF", width: "18px", height: "18px" }}></div> <span>Timina (T)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ backgroundColor: "#33FF57", width: "18px", height: "18px" }}></div> <span>Citosina (C)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ backgroundColor: "#FFC733", width: "18px", height: "18px" }}></div> <span>Guanina (G)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ backgroundColor: "#D433FF", width: "18px", height: "18px", border: "1.5px solid black" }}></div> <span>Mutación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grafico;
