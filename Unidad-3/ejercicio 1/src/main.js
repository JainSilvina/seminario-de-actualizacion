// Importamos la clase de nuestro Web Component de la calculadora
import { CustomCalculator } from './components/CustomCalculator.js';

customElements.define('x-calculator', CustomCalculator);

// Función que se ejecutará cuando el DOM esté completamente cargado
function initializeApp() {
    // Creamos una nueva instancia de nuestra calculadora
    const calculator = new CustomCalculator();

    // Añadimos la calculadora al cuerpo del documento
    document.body.appendChild(calculator);
}

// Escuchamos el evento 'DOMContentLoaded' para asegurarnos de que el HTML esté listo
document.addEventListener('DOMContentLoaded', initializeApp);

