import { Link } from "react-router-dom";
import "../index.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} ADN-REC. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
