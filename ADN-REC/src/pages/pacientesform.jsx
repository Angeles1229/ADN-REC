import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom"; // Para redirigir después de guardar
import "../styles/formpaciente.css"; 

function PacienteForm({ initialData, onSubmit }) {
  const navigate = useNavigate(); // Para redirigir después de guardar

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    edad: Yup.number()
      .typeError("La edad debe ser un número")
      .required("La edad es obligatoria")
      .positive("La edad debe ser un número positivo")
      .integer("La edad debe ser un número entero"),
    genero: Yup.string().required("El género es obligatorio"),
  });

  return (
    <div className="modal-overlay">
      <div className="modal">
      <Formik
        initialValues={initialData}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          const laboratoristaId = localStorage.getItem("laboratorista_id");
          if (!laboratoristaId) {
            alert("Error: No se encontró el laboratorista ID. Inicia sesión nuevamente.");
            setSubmitting(false);
            return;
          }

          const pacienteData = { ...values, laboratorista_id: laboratoristaId };
          console.log("📩 Datos enviados al backend:", pacienteData); // ✅ Depuración

          try {
            const response = await fetch("http://localhost:4000/api/pacientes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pacienteData),
            });

            const data = await response.json();

            if (response.ok) {
              alert("Paciente agregado con éxito.");
              resetForm();
              navigate("/pacientes");
            } else {
              alert(`Error: ${data.message || "No se pudo agregar el paciente."}`);
            }
          } catch (error) {
            console.error("❌ Error en la solicitud:", error);
            alert("Error de conexión con el servidor.");
          }

          setSubmitting(false);
        }}
      >

          {({ isSubmitting }) => (
            <Form className="form-container">
              <h2>Agregar Paciente</h2>
              <div className="form-field">
                <Field name="nombre" placeholder="Nombre" className="input-field" />
                <ErrorMessage name="nombre" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <Field name="apellido" placeholder="Apellido" className="input-field" />
                <ErrorMessage name="apellido" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <Field name="edad" type="number" placeholder="Edad" className="input-field" />
                <ErrorMessage name="edad" component="div" className="error-message" />
              </div>
              <div className="form-field">
                <Field name="genero" as="select" className="input-field">
                  <option value="">Seleccionar género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </Field>
                <ErrorMessage name="genero" component="div" className="error-message" />
              </div>
              <div className="form-buttons">
                <button type="submit" disabled={isSubmitting} className="submit-button">
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default PacienteForm;
