
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
    string usuario, contrasena;
    string usuario_registrado = "";
    string contrasena_registrada = "";
    int intentos = 0;

    while (true) {
        cout << "\nMenú Principal:\n1. Iniciar sesión\n2. Crear cuenta de usuario\n3. Salir\nSeleccione una opción: ";
        int opcion;
        cin >> opcion;
        
        if (opcion == 1) {
            if (usuario_registrado.empty()) {
                cout << "No hay usuarios registrados. Cree una cuenta primero.\n";
                continue;
            }
            
            intentos = 0;
            while (intentos < 3) {
                cout << "Usuario: ";
                cin >> usuario;
                cout << "Contraseña: ";
                cin >> contrasena;
                
                if (usuario == usuario_registrado && contrasena == contrasena_registrada) {
                    cout << "\n¡Bienvenido/a " << usuario << "!\n";
                    break;
                } else {
                    cout << "Usuario y/o contraseña incorrecta.\n";
                    intentos++;
                }
            }
            if (intentos == 3) {
                cout << "Usuario bloqueado. Contacte al administrador.\n";
            }
        } else if (opcion == 2) {
            cout << "Ingrese un nombre de usuario: ";
            cin >> usuario_registrado;
            
            while (true) {
                cout << "Ingrese una contraseña segura: ";
                cin >> contrasena_registrada;
                
                if (validar_contrasena(contrasena_registrada)) {
                    cout << "Cuenta creada con éxito.\n";
                    break;
                } else {
                    cout << "Contraseña inválida. Debe tener entre 8-16 caracteres, al menos una mayúscula y dos caracteres especiales.\n";
                }
            }
        } else if (opcion == 3) {
            cout << "Saliendo del sistema...\n";
            break;
        } else {
            cout << "Opción no válida.\n";
        }
    }
    return 0;
}
