class LoginApplicationView {
    constructor(apiInstanceObject) {
        this._model = apiInstanceObject; 
    }

    show() {
        let username = window.prompt("Ingrese su nombre de usuario:");
        let password = window.prompt("Ingrese contraseña:");

        // Llama al método de autenticación del modelo
        let api_return = this._model.authenticateUser(username, password);

        // La lógica de alertado sobre el resultado se mantiene aquí, como parte de la UI
        // Pero los alerts específicos para bloqueo o contraseña incorrecta se han movido a Application.js
        if (api_return.status) {
          
        } else if (api_return.status === false) {
            switch (api_return.result) {
                case 'BLOCKED_USER':
                    // El alert de bloqueo se maneja en Application.js para el flujo de reintentos
                    break;
                case 'USER_PASSWORD_FAILED':
                    // El alert de contraseña incorrecta se maneja en Application.js para el flujo de reintentos
                    break;
                case 'USER_NOT_FOUND':
                    // El alert de usuario no encontrado se maneja en Application.js
                    break;
                default:
                    alert('Error desconocido');
                    break;
            }
        }

        return api_return;
    }
}

export { LoginApplicationView };