import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { subirArchivoADN, getPacienteById } from "../../api/analisi";
import Grafico from "../grafico/Grafico";
import jsPDF from "jspdf";
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

  useEffect(() => {
    async function fetchPaciente() {
      if (!pacienteId) return;
      try {
        const data = await getPacienteById(pacienteId);
        setPaciente(data);
      } catch (error) {
        console.error("Error al obtener el paciente:", error);
      }
    }
    fetchPaciente();
  }, [pacienteId]);

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
    } catch (error) {
      console.error("❌ Error al analizar el ADN:", error);
      setResultado({ mensaje: "Error al analizar el ADN. Intenta nuevamente." });
    } finally {
      setCargando(false);
    }
  };

  const handleDownloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.text("Informe de Análisis de ADN", 10, 10);
      pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
      pdf.save(`Informe_ADN_${paciente?.nombre}.pdf`);
    });
  };

  return (
    <div className="bodye">
      <div className="analisis-container">
        <h1>Análisis de ADN</h1>
        {paciente ? (
          <h2>
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

          {tablaCSV.length > 0 && (
            <div className="tabla-container">
              <h3>Datos del Archivo CSV</h3>
              <table border="1" cellPadding="5">
                <thead>
                  <tr>
                    {Object.keys(tablaCSV[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tablaCSV.map((fila, index) => (
                    <tr key={index}>
                      {Object.values(fila).map((valor, idx) => (
                        <td key={idx}>{valor}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {dataADN.length > 0 && <Grafico data={dataADN} />}
        </div>

        <button className="pdf-button" onClick={handleDownloadPDF}>
          Guardar Informe en PDF
        </button>

        <button onClick={() => navigate("/pacientes")} className="back-button">
          Regresar a Módulo Pacientes
        </button>
      </div>
    </div>
  );
}

export default AnalisisADN;
