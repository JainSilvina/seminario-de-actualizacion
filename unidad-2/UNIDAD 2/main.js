
// import { APIModelAccess } from './APIModelAccess.js'; // Importa desde el mismo directorio
import { Application } from './Application.js';     // Importa desde el mismo directorio

// Para usar la versión con LocalStorage:
import { APIModelAccess } from './APIModelAccess_LocalStorage.js';

// Para usar la versión con SessionStorage:
// import { APIModelAccess } from './APIModelAccess_SessionStorage.js';

// -------------------------------------------------------------



function main() {
    let model = new APIModelAccess(); 
    let app = new Application(model); 

    app.run();
}

window.onload = main;



