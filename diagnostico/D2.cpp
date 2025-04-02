
#include <iostream>

using namespace std;

int main() {
    const string usuario_correcto = "cliente1";
    string contrasena = "123";
    string usuario, contrasena_ingresada;
    int intentos = 0;

    while (intentos < 3) {
        cout << "Usuario: ";
        cin >> usuario;
        cout << "Contrase\u00f1a: ";
        cin >> contrasena_ingresada;
        
        if (usuario == usuario_correcto && contrasena_ingresada == contrasena) {
            cout << "\n\u00a1Bienvenido/a " << usuario << "!\n";
            
            while (true) {
                cout << "\nMen\u00fa de opciones:\n1. Cambiar contrase\u00f1a\n2. Salir\nSeleccione una opci\u00f3n: ";
                int opcion;
                cin >> opcion;
                
                if (opcion == 1) {
                    cout << "Ingrese nueva contrase\u00f1a: ";
                    cin >> contrasena;
                    cout << "Contrase\u00f1a actualizada con \u00e9xito.\n";
                } else if (opcion == 2) {
                    break;
                } else {
                    cout << "Opci\u00f3n no v\u00e1lida.\n";
                }
            }
            
            intentos = 0; // Reiniciar intentos al volver al inicio
        } else {
            cout << "Usuario y/o contrase\u00f1a incorrecta.\n";
            intentos++;
        }
    }
    
    cout << "Usuario bloqueado. Contacte al administrador." << endl;
    return 0;
}
