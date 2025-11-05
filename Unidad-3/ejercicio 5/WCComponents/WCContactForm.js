class WCContactForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    padding: 10px;
                    font-family: Arial, sans-serif;
                }
                h3 {
                    border-bottom: 2px solid #ccc;
                    padding-bottom: 10px;
                    margin-top: 0;
                    color: #333;
                }
                label {
                    display: block;
                    margin-top: 15px;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                input[type=text], input[type=email], textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box; 
                    transition: border-color 0.3s;
                }
                input:focus, textarea:focus {
                    border-color: #007bff;
                    outline: none;
                }
                textarea {
                    resize: vertical;
                    min-height: 100px;
                }
            </style>

            <form id="contact-form">
                <h3>Formulario de Contacto</h3>
                <label for="name">Nombre</label>
                <input type="text" id="name" name="name" placeholder="Tu nombre..." required>

                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Tu correo electrónico..." required>
                
                <label for="message">Mensaje</label>
                <textarea id="message" name="message" placeholder="Escribe tu mensaje..." required></textarea>
                
                </form>
        `;
    }

    resetForm() {
        this.shadowRoot.querySelector('#contact-form').reset();
    }
}

customElements.define('wc-contact-form', WCContactForm);