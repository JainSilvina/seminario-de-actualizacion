// Exportamos la clase para poder importarla en main.js
export class CustomCalculator extends HTMLElement {
    constructor() {
        super(); // Llama al constructor de HTMLElement

        // *** Elementos de la interfaz de la calculadora ***

        // Display de la calculadora (input de texto)
        this.display = document.createElement('input');
        this.display.type = 'text';
        this.display.readOnly = true; // El usuario no debería poder escribir directamente
        this.display.style.width = '100%'; // Estilo básico para el display
        this.display.style.fontSize = '2em';
        this.display.style.textAlign = 'right';
        this.display.style.marginBottom = '10px';
        this.display.value = ''; // Inicializamos vacío

        // Contenedor para los botones para organizar el layout
        this.buttonsContainer = document.createElement('div');
        this.buttonsContainer.style.display = 'grid';
        this.buttonsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)'; 
        this.buttonsContainer.style.gap = '5px'; 

        // Creamos los botones y se almacenan en un mapa 
        this.buttons = {};
        const buttonLabels = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+'
        ];

        buttonLabels.forEach(label => {
            const button = document.createElement('button');
            button.innerText = label;
            button.style.width = '100%';
            button.style.height = '60px';
            button.style.fontSize = '1.5em';
            this.buttons[label] = button; 
        });
    }

    // --- Manejadores de Eventos ---

    // Maneja el clic de todos los botones (números, punto y operadores)
    onButtonClick(event) {
        const value = event.target.innerText; 
        if (value === '=') {
            try {
               
                this.display.value = eval(this.display.value);
            } catch (e) {
                this.display.value = 'Error';
            }
        } else {
            this.display.value += value; // Añade el valor del botón al display
        }
    }

    // --- Ciclo de Vida del Web Component ---

    // Se ejecuta cuando el elemento es insertado en el DOM
    connectedCallback() {
        
        this.appendChild(this.display);

        // Adjuntamos cada botón al contenedor de botones y luego el contenedor al componente
        Object.values(this.buttons).forEach(button => {
            this.buttonsContainer.appendChild(button);
            
            button.onclick = this.onButtonClick.bind(this);
        });

        this.appendChild(this.buttonsContainer);

        // Estilo básico para el componente en sí (opcional)
        this.style.display = 'block';
        this.style.width = '300px';
        this.style.border = '1px solid #ccc';
        this.style.padding = '10px';
        this.style.borderRadius = '5px';
        this.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.2)';
        this.style.margin = '20px auto'; // Centrar
    }

    // Se ejecuta cuando el elemento es removido del documento
    disconnectedCallback() {
        
        Object.values(this.buttons).forEach(button => {
            button.onclick = null;
        });
    }

    // Estos métodos se mantienen vacíos según la consigna
    adoptedCallback() {}
    connectedMoveCallback() {} 

    static get observableAttributes() {
        return [];
    }

    attributeChangedCallback(attr, oldvalue, newvalue) {}
}