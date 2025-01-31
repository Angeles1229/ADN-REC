import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Paciente from "./pages/paciente";
import PacienteForm from "./pages/pacientesform";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AnalisisADN from "./pages/Analisis";
import Grafico from "./pages/Grafico";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; // Importa el contexto
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analisis" element={<AnalisisADN />} />
        <Route path="/grafico" element={<Grafico />} />

        {/* Rutas protegidas */}
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <Paciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/form"
          element={
            <ProtectedRoute>
              <PacienteForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
