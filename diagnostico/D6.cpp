#include <iostream>
#include <vector>

using namespace std;

struct Articulo {
    int id;
    string nombre;
    double precio;
    int stock;
};

vector<Articulo> articulos = {
    {1, "Lavandina x 1L", 875.25, 3000},
    {4, "Detergente x 500mL", 1102.45, 2010},
    {22, "Jabon en polvo x 250g", 650.22, 407}
};

void listarArticulos() {
    for (const auto& articulo : articulos) {
        cout << "ID: " << articulo.id << " | Nombre: " << articulo.nombre
             << " | Precio: " << articulo.precio << " | Stock: " << articulo.stock << endl;
    }
}

void nuevoArticulo() {
    Articulo nuevo;
    cout << "Ingrese ID: "; cin >> nuevo.id;
    cout << "Ingrese Nombre: "; cin.ignore(); getline(cin, nuevo.nombre);
    cout << "Ingrese Precio: "; cin >> nuevo.precio;
    cout << "Ingrese Stock: "; cin >> nuevo.stock;
    articulos.push_back(nuevo);
}

void editarArticulo() {
    int id;
    cout << "Ingrese ID del articulo a editar: "; cin >> id;
    for (auto& articulo : articulos) {
        if (articulo.id == id) {
            cout << "Nuevo Nombre: "; cin.ignore(); getline(cin, articulo.nombre);
            cout << "Nuevo Precio: "; cin >> articulo.precio;
            cout << "Nuevo Stock: "; cin >> articulo.stock;
            return;
        }
    }
    cout << "Articulo no encontrado." << endl;
}

void eliminarArticulo() {
    int id;
    cout << "Ingrese ID del articulo a eliminar: "; cin >> id;
    for (size_t i = 0; i < articulos.size(); i++) {
        if (articulos[i].id == id) {
            articulos.erase(articulos.begin() + i);
            cout << "Articulo eliminado." << endl;
            return;
        }
    }
    cout << "Articulo no encontrado." << endl;
}

int main() {
    int opcion;
    do {
        cout << "\n1. Listar articulos\n2. Nuevo articulo\n3. Editar articulo\n4. Eliminar articulo\n5. Salir\n";
        cout << "Seleccione una opcion: "; cin >> opcion;
        switch (opcion) {
            case 1: listarArticulos(); break;
            case 2: nuevoArticulo(); break;
            case 3: editarArticulo(); break;
            case 4: eliminarArticulo(); break;
        }
    } while (opcion != 5);
    return 0;
}

