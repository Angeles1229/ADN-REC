import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { subirArchivoADN, getPacienteById } from "../../api/analisi";
import Grafico from "../grafico/Grafico";
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

  if (!pacienteId) {
    return (
      <div className="bodye">
        <div className="analisis-container">
          <h1>¡Debes seleccionar un paciente!</h1>
          <p>Por favor, selecciona un paciente para analizar su ADN.</p>
          <button onClick={() => navigate("/pacientes")} className="back-button">
            Volver a la lista de pacientes
          </button>
        </div>
      </div>
    );
  }

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
    } catch (error) {
      console.error("❌ Error al analizar el ADN:", error);
      setResultado({ mensaje: "Error al analizar el ADN. Intenta nuevamente." });
    } finally {
      setCargando(false);
    }
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
        {resultado && (
          <div className="analisis-resultado">
            <h3>Resultados del Análisis:</h3>
            {resultado.enfermedad_detectada ? (
              <p>{Array.isArray(resultado.enfermedad_detectada) ? resultado.enfermedad_detectada.join(", ") : resultado.enfermedad_detectada}</p>
            ) : (
              <p>No se detectaron enfermedades</p>
            )}
            

          </div>
        )}
        {dataADN.length > 0 && <Grafico data={dataADN} />}
        <button onClick={() => navigate("/pacientes")} className="back-button">
          Regresar a Módulo Pacientes
        </button>
      </div>
    </div>
  );
}

export default AnalisisADN;