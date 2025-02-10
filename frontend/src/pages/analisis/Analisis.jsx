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

  // Estado centralizado
  const [estado, setEstado] = useState({
    paciente: null,
    archivo: null,
    resultado: null,
    cargando: false,
    dataADN: [],
    nucleotidos: [],
    tablaCSV: [],
    pdfListo: false,
  });

  const pdfRef = useRef();

  // Función para manejar errores
  const manejarErrores = (error, mensaje) => {
    console.error(`❌ ${mensaje}:`, error);
  };

  useEffect(() => {
    async function fetchPaciente() {
      if (!pacienteId) {
        manejarErrores("Paciente ID no encontrado", "Error en URL");
        return;
      }
      try {
        const data = await getPacienteById(pacienteId);
        setEstado((prev) => ({ ...prev, paciente: data }));
      } catch (error) {
        manejarErrores(error, "Error al obtener el paciente");
        setEstado((prev) => ({ ...prev, paciente: null }));
      }
    }
    fetchPaciente();
  }, [pacienteId]);

  // Habilitar PDF cuando los datos están listos
  useEffect(() => {
    if (estado.resultado && estado.paciente) {
      setEstado((prev) => ({ ...prev, pdfListo: true }));
    }
  }, [estado.resultado, estado.paciente]);

  const handleFileChange = (e) => {
    setEstado((prev) => ({ ...prev, archivo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!estado.archivo) {
      alert("Por favor, selecciona un archivo CSV.");
      return;
    }

    setEstado((prev) => ({ ...prev, cargando: true }));

    try {
      const data = await subirArchivoADN(estado.archivo, pacienteId);
      setEstado((prev) => ({
        ...prev,
        resultado: data,
        dataADN: data.secuenciaADN || [],
        nucleotidos: data.nucleotidos_detectados || [],
        tablaCSV: data.tablaCSV || [],
      }));
    } catch (error) {
      manejarErrores(error, "Error al analizar el ADN");
      setEstado((prev) => ({
        ...prev,
        resultado: { mensaje: "Error al analizar el ADN. Intenta nuevamente." },
      }));
    } finally {
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  };

  const generarContenidoPDF = (pdf) => {
    const { paciente, tablaCSV } = estado;

    pdf.text("Informe de Análisis de ADN", 10, 10);
    pdf.text(`Paciente: ${paciente.nombre} ${paciente.apellido}`, 10, 20);

    const fechaSubida = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    pdf.text(`Fecha de subida: ${fechaSubida}`, 10, 30);

    if (tablaCSV.length > 0) {
      pdf.addPage();
      pdf.text("Datos del Archivo CSV", 10, 10);
      const headers = [Object.keys(tablaCSV[0])];
      const data = tablaCSV.map((row) => Object.values(row));

      autoTable(pdf, {
        startY: 20,
        head: headers,
        body: data,
        theme: "grid",
        styles: { fontSize: 10, cellWidth: "wrap" },
        headStyles: { fillColor: [22, 160, 133] },
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) {
      alert("No hay datos para generar el informe.");
      return;
    }

    if (!estado.resultado || !estado.paciente) {
      alert("Los datos del paciente o el análisis aún no están disponibles.");
      return;
    }

    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      generarContenidoPDF(pdf);
      pdf.addImage(imgData, "PNG", 10, 40, imgWidth, imgHeight);
      pdf.save(`Informe_ADN_${estado.paciente.nombre}.pdf`);
    } catch (error) {
      manejarErrores(error, "Error al generar el PDF");
    }
  };

  return (
    <div className="bodye">
      <div className="analisis-container">
        <h1>Análisis de ADN</h1>
        {estado.paciente ? (
          <h2 style={{ color: "blue" }}>
            Paciente: {estado.paciente.nombre} {estado.paciente.apellido}
          </h2>
        ) : (
          <p>Cargando información del paciente...</p>
        )}
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".csv" onChange={handleFileChange} required />
          <button type="submit" className="submit-button">
            {estado.cargando ? "Analizando..." : "Subir y Analizar"}
          </button>
        </form>

        <div ref={pdfRef} className="analisis-reporte">
          {estado.resultado && (
            <div className="analisis-resultado">
              <h3>Resultados del Análisis:</h3>
              <p><strong>Enfermedad Detectada:</strong></p>
              {estado.resultado.enfermedad_detectada ? (
                <p style={{ color: "blue" }}>
                  {Array.isArray(estado.resultado.enfermedad_detectada)
                    ? estado.resultado.enfermedad_detectada.join(", ")
                    : estado.resultado.enfermedad_detectada}
                </p>
              ) : (
                <p>No se detectaron enfermedades</p>
              )}

              {estado.resultado.descripcion_enfermedad && (
                <p><strong>Descripción:</strong> {estado.resultado.descripcion_enfermedad}</p>
              )}
            </div>
          )}

          {estado.dataADN.length > 0 && <Grafico data={estado.dataADN} />}
        </div>

        <button className="pdf-button" onClick={handleDownloadPDF} disabled={!estado.pdfListo}>
          {estado.pdfListo ? "Guardar Informe en PDF" : "Generando PDF..."}
        </button>

        <button onClick={() => navigate("/pacientes")} className="back-button">
          Regresar a Módulo Pacientes
        </button>
      </div>
    </div>
  );
}

export default AnalisisADN;
