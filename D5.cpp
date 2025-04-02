#include <iostream>
#include <vector>

using namespace std;

struct Articulo {
    int id;
    string nombre;
    double precio;
    int stock;
};

void listarArticulos(const vector<Articulo>& articulos) {
    cout << "Lista de artículos disponibles:\n";
    for (const auto& articulo : articulos) {
        cout << "ID: " << articulo.id << ", Nombre: " << articulo.nombre 
             << ", Precio: $" << articulo.precio << ", Stock: " << articulo.stock << " unidades.\n";
    }
}

int main() {
    vector<Articulo> articulos = {
        {1, "Lavandina x 1L", 875.25, 3000},
        {4, "Detergente x 500mL", 1102.45, 2010},
        {22, "Jabón en polvo x 250g", 650.22, 407}
    };
    
    listarArticulos(articulos);
    return 0;
}
