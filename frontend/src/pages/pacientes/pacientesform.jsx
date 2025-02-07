import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert2
import "../../styles/formpaciente.css";

function PacienteForm({ initialData, onSubmit }) {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios")
      .required("El nombre es obligatorio"),
    apellido: Yup.string()
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/, "El apellido solo puede contener letras y espacios")
      .required("El apellido es obligatorio"),
    edad: Yup.number()
      .typeError("La edad debe ser un número")
      .required("La edad es obligatoria")
      .positive("La edad debe ser un número positivo")
      .integer("La edad debe ser un número entero")
      .min(1, "La edad mínima es 1")
      .max(120, "La edad máxima es 120"),
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
              Swal.fire({
                title: "Error",
                text: "No se encontró el ID del laboratorista. Inicia sesión nuevamente.",
                icon: "error",
                confirmButtonText: "Aceptar",
              });
              setSubmitting(false);
              return;
            }

            const pacienteData = { ...values, laboratorista_id: parseInt(laboratoristaId) };

            try {
              const response = await fetch("http://localhost:4000/api/pacientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pacienteData),
              });

              const data = await response.json();

              if (response.ok) {
                Swal.fire({
                  title: "Paciente agregado",
                  text: "El paciente ha sido registrado exitosamente.",
                  icon: "success",
                  confirmButtonText: "Aceptar"
                }).then(() => {
                  resetForm();
                  navigate("/pacientes");
                  setTimeout(() => {
                    window.location.reload();
                  }, 100);
                });

              } else {
                Swal.fire({
                  title: "Error",
                  text: data.message || "No se pudo agregar el paciente.",
                  icon: "error",
                  confirmButtonText: "Aceptar"
                });
              }
            } catch (error) {
              console.error("❌ Error en la solicitud:", error);
              Swal.fire({
                title: "Error",
                text: "Error de conexión con el servidor.",
                icon: "error",
                confirmButtonText: "Aceptar"
              });
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
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    navigate("/pacientes");
                    setTimeout(() => {
                      window.location.reload();
                    }, 100);
                  }}
                >
                  Cancelar
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
