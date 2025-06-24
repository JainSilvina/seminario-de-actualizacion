import { APIModelAccess } from './APIModelAccess.js'; // Importa desde el mismo directorio
import { Application } from './Application.js';     // Importa desde el mismo directorio


function main() {
    let model = new APIModelAccess(); // Instancia el modelo (tu clase APIModelAccess)
    let app = new Application(model); // Instancia la aplicación/UI (tu clase Application), pasándole el modelo

    // El método `run()` de la clase Application refactorizada (que antes era ApplicationUI) maneja todo el flujo.
    app.run();
}

window.onload = main;