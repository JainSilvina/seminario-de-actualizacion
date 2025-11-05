class WCModalDialog extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        
        this.shadowRoot.innerHTML = `
            <style>
                .modal {
                    display: none; /* Oculto por defecto */
                    position: fixed; 
                    z-index: 1000; 
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto; 
                    background-color: rgba(0,0,0,0.4); 
                    backdrop-filter: blur(2px); 
                    padding-top: 50px; 
                }

                .modal-content {
                    background-color: #fefefe;
                    margin: 10% auto; 
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%; 
                    max-width: 600px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
                    animation-name: animatetop;
                    animation-duration: 0.4s
                }

                @keyframes animatetop {
                    from {top: -300px; opacity: 0} 
                    to {top: 0; opacity: 1}
                }

                .modal-footer {
                    padding-top: 15px;
                    text-align: right;
                    border-top: 1px solid #eee;
                    margin-top: 15px;
                }
                
                button {
                    padding: 10px 15px;
                    margin-left: 10px;
                    cursor: pointer;
                    border: none;
                    border-radius: 4px;
                }
                .accept { background-color: #007bff; color: white; }
                .cancel { background-color: #6c757d; color: white; }

            </style>

            <div class="modal" id="modal-wrapper">
                <div class="modal-content">
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button class="cancel" data-action="cancel">Cancelar</button>
                        <button class="accept" data-action="accept">Aceptar</button>
                    </div>
                </div>
            </div>
        `;

        this.$wrapper = this.shadowRoot.getElementById('modal-wrapper');
        
        this.shadowRoot.querySelector('.cancel').addEventListener('click', () => this._handleAction('cancel'));
        this.shadowRoot.querySelector('.accept').addEventListener('click', () => this._handleAction('accept'));
        this.$wrapper.addEventListener('click', this._handleExternalClick.bind(this)); 
    }

    connectedCallback() {
        document.addEventListener('keydown', this._handleKeydown.bind(this));
    }

    disconnectedCallback() {
        document.removeEventListener('keydown', this._handleKeydown.bind(this));
    }

    _handleAction(action) {
        this.hide();
        this.dispatchEvent(new CustomEvent(`modal:${action}`, { bubbles: true, composed: true }));
    }


    _handleExternalClick(event) {
        if (event.target === this.$wrapper && this.isOpen) {
            this._handleAction('cancel');
        }
    }
    
    _handleKeydown(event) {
        if (event.key === 'Escape' && this.isOpen) {
            this._handleAction('cancel');
        }
    }

    show() {
        this.$wrapper.style.display = 'block';
        this.isOpen = true;
    }

    hide() {
        this.$wrapper.style.display = 'none';
        this.isOpen = false;
    }
}

customElements.define('wc-modal-dialog', WCModalDialog);