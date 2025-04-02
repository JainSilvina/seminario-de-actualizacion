#include <iostream>

using namespace std;

int main() {
    const string usuario_correcto = "cliente1";
    const string contrasena_correcta = "123";
    string usuario, contrasena;
    int intentos = 0;

    while (intentos < 3) {
        cout << "Usuario: ";
        cin >> usuario;
        cout << "Contraseña: ";
        cin >> contrasena;
        
        if (usuario == usuario_correcto && contrasena == contrasena_correcta) {
            cout << "\n\u00a1Bienvenido/a " << usuario << "!\n";
            return 0;
        }
        
        cout << "Usuario y/o contraseña incorrecta.\n";
        intentos++;
    }
    
    cout << "Usuario bloqueado. Contacte al administrador." << endl;
    return 0;
}
