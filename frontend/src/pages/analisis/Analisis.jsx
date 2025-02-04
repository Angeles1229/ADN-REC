import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { subirArchivoADN, getPacienteById } from "../../api/analisi";
import Grafico from "../grafico/Grafico";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import "../../styles/analisis.css";

function AnalisisADN() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteId = searchParams.get("paciente_id");
  const [paciente, setPaciente] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [dataADN, setDataADN] = useState([]);
  const [nucleotidos, setNucleotidos] = useState([]);
  const [tablaCSV, setTablaCSV] = useState([]);
  const pdfRef = useRef();
  const [pdfListo, setPdfListo] = useState(false);

  useEffect(() => {
    async function fetchPaciente() {
      if (!pacienteId) {
        console.error("❌ pacienteId no encontrado en la URL.");
        return;
      }
      try {
        const data = await getPacienteById(pacienteId);
        console.log("✅ Datos del paciente recibidos:", data);
        setPaciente(data);
      } catch (error) {
        console.error("❌ Error al obtener el paciente:", error);
      }
    }
    fetchPaciente();
  }, [pacienteId]);

  // 🔹 Este efecto se ejecutará cuando resultado cambie y actualizará pdfListo
  useEffect(() => {
    if (resultado && paciente) {
      console.log("✅ Datos listos, habilitando PDF.");
      setPdfListo(true);
    }
  }, [resultado, paciente]);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) {
      alert("Por favor, selecciona un archivo CSV.");
      return;
    }

    setCargando(true);
    try {
      const data = await subirArchivoADN(archivo, pacienteId);
      console.log("📢 Respuesta de la API:", data);
      setResultado(data);

      if (data.secuenciaADN) {
        setDataADN(data.secuenciaADN);
      }
      if (data.nucleotidos_detectados) {
        setNucleotidos(data.nucleotidos_detectados);
      }
      if (data.tablaCSV) {
        setTablaCSV(data.tablaCSV);
      }

      setTimeout(() => {
        console.log("✅ Forzando render para habilitar PDF...");
        setPdfListo(true);
      }, 500);
    } catch (error) {
      console.error("❌ Error al analizar el ADN:", error);
      setResultado({ mensaje: "Error al analizar el ADN. Intenta nuevamente." });
    } finally {
      setCargando(false);
    }
  };

  const handleDownloadPDF = async () => {
    console.log("📌 Intentando generar PDF...");

    if (!pdfRef.current) {
      console.error("❌ No se encontró el contenido a capturar para el PDF.");
      alert("No hay datos para generar el informe.");
      return;
    }

    if (!resultado || !paciente) {
      alert("Los datos del paciente o el análisis aún no están disponibles.");
      return;
    }

    setTimeout(() => {
      console.log("📸 Capturando contenido para PDF...");
      html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.text("Informe de Análisis de ADN", 10, 10);
        pdf.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, 10, 20);

        const fechaSubida = new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        pdf.text(`Fecha de subida: ${fechaSubida}`, 10, 30);
        pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);

        if (tablaCSV.length > 0) {
          pdf.addPage();
          pdf.text("Datos del Archivo CSV", 10, 10);

          const headers = [Object.keys(tablaCSV[0])];
          const data = tablaCSV.map(row => Object.values(row));

          autoTable(pdf, {
            startY: 20,
            head: headers,
            body: data,
            theme: "grid",
            styles: { fontSize: 10, cellWidth: "wrap" },
            headStyles: { fillColor: [22, 160, 133] }
          });
        }

        pdf.save(`Informe_ADN_${paciente.nombre}.pdf`);
        console.log("✅ PDF generado correctamente.");
      }).catch(error => {
        console.error("❌ Error al generar el PDF:", error);
      });
    }, 500);
  };

  return (
    <div className="bodye">
      <div className="analisis-container">
        <h1>Análisis de ADN</h1>
        {paciente ? (
          <h2 style={{ color: "blue" }}>
            Paciente: {paciente.nombre} {paciente.apellido}
          </h2>
        ) : (
          <p>Cargando información del paciente...</p>
        )}
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".csv" onChange={handleFileChange} required />
          <button type="submit" className="submit-button">
            {cargando ? "Analizando..." : "Subir y Analizar"}
          </button>
        </form>

        <div ref={pdfRef} className="analisis-reporte">
          {resultado && (
            <div className="analisis-resultado">
              <h3>Resultados del Análisis:</h3>
              <p><strong>Enfermedad Detectada:</strong></p>
              {resultado.enfermedad_detectada ? (
                <p style={{ color: "blue" }}>
                  {Array.isArray(resultado.enfermedad_detectada) ? resultado.enfermedad_detectada.join(", ") : resultado.enfermedad_detectada}
                </p>
              ) : (
                <p>No se detectaron enfermedades</p>
              )}

              {resultado.descripcion_enfermedad && (
                <p><strong>Descripción:</strong> {resultado.descripcion_enfermedad}</p>
              )}
            </div>
          )}

          {dataADN.length > 0 && <Grafico data={dataADN} />}
        </div>

        <button className="pdf-button" onClick={handleDownloadPDF} disabled={!pdfListo}>
          {pdfListo ? "Guardar Informe en PDF" : "Generando PDF..."}
        </button>

        <button onClick={() => navigate("/pacientes")} className="back-button">
          Regresar a Módulo Pacientes
        </button>
      </div>
    </div>
  );
}

export default AnalisisADN;
