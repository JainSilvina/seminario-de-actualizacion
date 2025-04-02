
#include <iostream>
#include <cctype>

using namespace std;

bool validar_contrasena(const string& contrasena) {
    if (contrasena.length() < 8 || contrasena.length() > 16)
        return false;
    
    bool tiene_mayuscula = false;
    int contador_especiales = 0;
    
    for (char c : contrasena) {
        if (isupper(c)) tiene_mayuscula = true;
        if (!isalnum(c)) contador_especiales++;
    }
    
    return tiene_mayuscula && contador_especiales >= 2;
}

int main() {
    const string usuario_correcto = "cliente1";
    string contrasena = "Password@123";
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
                    string nueva_contrasena;
                    cout << "Ingrese nueva contrase\u00f1a: ";
                    cin >> nueva_contrasena;
                    
                    if (validar_contrasena(nueva_contrasena)) {
                        contrasena = nueva_contrasena;
                        cout << "Contrase\u00f1a actualizada con \u00e9xito.\n";
                    } else {
                        cout << "Contrase\u00f1a inv\u00e1lida. Debe tener entre 8-16 caracteres, al menos una may\u00fascula y dos caracteres especiales.\n";
                    }
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
