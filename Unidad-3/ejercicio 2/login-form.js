class LoginForm extends HTMLElement {
    constructor() {
        super();
    
        this.root = this;
    }


    connectedCallback() {
        console.log('<login-form> fue conectado al DOM.');
        this.render();
    }

    disconnectedCallback() {
        console.log('<login-form> fue desconectado del DOM. Limpiando...'); 
        // limpiar el contenido al ser desconectado
        this.root.innerHTML = ''; 
    }

    attributeChangedCallback(name, oldValue, newValue) {}
    adoptedCallback() {}

    render() {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('w3-card-4');
        cardDiv.style.maxWidth = '400px';
        cardDiv.style.margin = '50px auto'; 
        this.root.appendChild(cardDiv);

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('w3-container', 'w3-light-grey');
        
        const h2 = document.createElement('h2');
        h2.innerText = 'Login';
        headerDiv.appendChild(h2);
        
        cardDiv.appendChild(headerDiv);

        const form = document.createElement('form');
        form.classList.add('w3-container');
        form.setAttribute('action', '/action_page.php');
        cardDiv.appendChild(form);

        const sectionDiv = document.createElement('div');
        sectionDiv.classList.add('w3-section');
        form.appendChild(sectionDiv);

        const labelUsername = document.createElement('label');
        labelUsername.appendChild(document.createElement('b')).innerText = 'Username';
        sectionDiv.appendChild(labelUsername);

        const inputUsername = document.createElement('input');
        inputUsername.classList.add('w3-input', 'w3-border', 'w3-margin-bottom');
        inputUsername.setAttribute('type', 'text');
        inputUsername.setAttribute('placeholder', 'Enter Username');
        inputUsername.setAttribute('name', 'usrname');
        inputUsername.setAttribute('required', '');
        sectionDiv.appendChild(inputUsername);

        const labelPassword = document.createElement('label');
        labelPassword.appendChild(document.createElement('b')).innerText = 'Password';
        sectionDiv.appendChild(labelPassword);

        const inputPassword = document.createElement('input');
        inputPassword.classList.add('w3-input', 'w3-border');
        inputPassword.setAttribute('type', 'password');
        inputPassword.setAttribute('placeholder', 'Enter Password');
        inputPassword.setAttribute('name', 'psw');
        inputPassword.setAttribute('required', '');
        sectionDiv.appendChild(inputPassword);

        const loginButton = document.createElement('button');
        loginButton.classList.add('w3-button', 'w3-block', 'w3-green', 'w3-section');
        loginButton.setAttribute('type', 'submit');
        loginButton.innerText = 'Login';
        sectionDiv.appendChild(loginButton);

        const inputCheckbox = document.createElement('input');
        inputCheckbox.classList.add('w3-check', 'w3-margin-top');
        inputCheckbox.setAttribute('type', 'checkbox');
        inputCheckbox.setAttribute('checked', 'checked');
        sectionDiv.appendChild(inputCheckbox);
        sectionDiv.appendChild(document.createTextNode(' Remember me')); 

        const footerDiv = document.createElement('div');
        footerDiv.classList.add('w3-container', 'w3-border-top', 'w3-padding-16', 'w3-light-grey');
        cardDiv.appendChild(footerDiv);

        const cancelButton = document.createElement('button');
        cancelButton.setAttribute('type', 'button');
        cancelButton.classList.add('w3-button', 'w3-red');
        cancelButton.innerText = 'Cancel';
        footerDiv.appendChild(cancelButton);

        const spanForgot = document.createElement('span');
        spanForgot.classList.add('w3-right', 'w3-padding', 'w3-hide-small');
        spanForgot.innerText = 'Forgot ';
        
        const linkForgot = document.createElement('a');
        linkForgot.setAttribute('href', '#');
        linkForgot.innerText = 'password?';
        
        spanForgot.appendChild(linkForgot);
        footerDiv.appendChild(spanForgot);
    }
}

customElements.define('login-form', LoginForm);