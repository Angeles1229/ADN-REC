import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "../../styles/grafico.css";

function Grafico({ data }) {
  const svgRef = useRef();
  const containerRef = useRef();
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    if (data.length > 0) {
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

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height);

      const g = svg.append("g").attr("transform", `translate(${width / 10}, ${height / 2})`);

      const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px 12px")
        .style("border-radius", "5px")
        .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.5)")
        .style("font-size", "14px")
        .style("opacity", 0);

      data.forEach((d, i) => {
        const x = i * xSpacing;
        const y1 = Math.sin(i * 0.3) * curveHeight - helixSpacing;
        const y2 = Math.sin(i * 0.3) * curveHeight + helixSpacing;

        const nucleotido = d["nucleotido"] ? d["nucleotido"].trim().toUpperCase() : "";
        const isMutated = d["mutacion"] === true;

        const baseColor = colors[nucleotido] || "#999";
        const mutationColor = colors.mutacion;

        const circles = [
          { cx: x, cy: y1 },
          { cx: x, cy: y2 }
        ];

        circles.forEach(({ cx, cy }) => {
          g.append("circle")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", radius)
            .attr("fill", isMutated ? mutationColor : baseColor)
            .attr("opacity", 0.8)
            .on("mouseover", function (event) {
              d3.select(this).transition().duration(200).attr("r", radius * 1.5);
              tooltip.style("opacity", 1)
                .html(`Nucleótido: ${nucleotido}<br>Posición: ${d.posicion}<br>Mutación: ${isMutated ? "Sí" : "No"}`)
                .style("left", event.pageX + 15 + "px")
                .style("top", event.pageY - 25 + "px");
            })
            .on("mousemove", function (event) {
              tooltip.style("left", event.pageX + 15 + "px")
                     .style("top", event.pageY - 25 + "px");
            })
            .on("mouseout", function () {
              d3.select(this).transition().duration(200).attr("r", radius);
              tooltip.style("opacity", 0);
            });
        });

        g.append("path")
          .attr("d", `M ${x},${y1} Q ${x + radius},${(y1 + y2) / 2} ${x},${y2}`)
          .attr("stroke", "#666")
          .attr("fill", "none")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 0.8);
      });
    }
  }, [data]);

  return (
    <div className="bodyg">
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>ADN Analizado</h1>

        <div
          ref={containerRef}
          className="chart-container"
          style={{ width: "100%", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "10px" }}
        >
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}

export default Grafico;