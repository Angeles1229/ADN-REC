import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Paciente from "./pages/pacientes/paciente";
import PacienteForm from "./pages/pacientes/pacientesform";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AnalisisADN from "./pages/analisis/Analisis";
import Grafico from "./pages/grafico/Grafico";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext"; 
import EnfermedadesList from "./pages/EnfermedadesList";
import EnfermedadForm from "./pages/EnfermedadForm";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analisis" element={<AnalisisADN />} />
        <Route path="/grafico" element={<Grafico />} />
        <Route path="/" element={<EnfermedadesList />} />
        <Route path="/enfermedades" element={<EnfermedadesList />} />
        <Route path="/crear-enfermedad" element={<EnfermedadForm />} />
        <Route path="/editar-enfermedad/:id" element={<EnfermedadForm />} />
        
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
      <Footer />
    </AuthProvider>
  );
}

export default App;
