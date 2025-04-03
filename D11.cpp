#include <iostream>
#include <vector>
#include <limits>

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

// -------- FUNCIONES AUXILIARES DE VALIDACIÓN --------
void limpiarBuffer() {
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

int leerEntero(string mensaje) {
    int valor;
    while (true) {
        cout << mensaje;
        if (cin >> valor) break;
        cout << "Error: Ingrese un número válido.\n";
        limpiarBuffer();
    }
    return valor;
}

double leerDouble(string mensaje) {
    double valor;
    while (true) {
        cout << mensaje;
        if (cin >> valor && valor >= 0) break;
        cout << "Error: Ingrese un número válido y no negativo.\n";
        limpiarBuffer();
    }
    return valor;
}

string leerString(string mensaje) {
    string texto;
    cout << mensaje;
    cin.ignore();
    getline(cin, texto);
    while (texto.empty()) {
        cout << "Error: No puede estar vacío. Intente nuevamente: ";
        getline(cin, texto);
    }
    return texto;
}

// -------- FUNCIONES PRINCIPALES --------
bool existeArticulo(int id) {
    for (const auto& articulo : articulos) {
        if (articulo.id == id) return true;
    }
    return false;
}

void listarArticulos() {
    cout << "\n--- Lista de Articulos ---\n";
    for (const auto& articulo : articulos) {
        cout << "ID: " << articulo.id << " | Nombre: " << articulo.nombre
             << " | Precio: $" << articulo.precio << " | Stock: " << articulo.stock << endl;
    }
}

void nuevoArticulo() {
    int id;
    do {
        id = leerEntero("\nIngrese ID: ");
        if (existeArticulo(id)) cout << "Error: El ID ya existe. Ingrese otro.\n";
    } while (existeArticulo(id));

    string nombre = leerString("Ingrese Nombre: ");
    double precio = leerDouble("Ingrese Precio: ");
    int stock = leerEntero("Ingrese Stock: ");

    articulos.push_back({id, nombre, precio, stock});
    cout << "Articulo agregado exitosamente.\n";
}

void editarArticulo() {
    int id = leerEntero("\nIngrese ID del articulo a editar: ");
    for (auto& articulo : articulos) {
        if (articulo.id == id) {
            articulo.nombre = leerString("Nuevo Nombre: ");
            articulo.precio = leerDouble("Nuevo Precio: ");
            articulo.stock = leerEntero("Nuevo Stock: ");
            cout << "Articulo editado correctamente.\n";
            return;
        }
    }
    cout << "Articulo no encontrado.\n";
}

void eliminarArticulo() {
    int id = leerEntero("\nIngrese ID del articulo a eliminar: ");
    for (size_t i = 0; i < articulos.size(); i++) {
        if (articulos[i].id == id) {
            articulos.erase(articulos.begin() + i);
            cout << "Articulo eliminado.\n";
            return;
        }
    }
    cout << "Articulo no encontrado.\n";
}

void comprarArticulo() {
    int id = leerEntero("\nIngrese ID del articulo a comprar: ");
    for (auto& articulo : articulos) {
        if (articulo.id == id) {
            int cantidad = leerEntero("Ingrese cantidad a comprar: ");
            if (cantidad > 0) {
                articulo.stock += cantidad;
                cout << "Compra realizada. Stock actualizado.\n";
            } else {
                cout << "Cantidad no válida.\n";
            }
            return;
        }
    }
    cout << "Articulo no encontrado.\n";
}

void venderArticulo() {
    int id = leerEntero("\nIngrese ID del articulo a vender: ");
    for (auto& articulo : articulos) {
        if (articulo.id == id) {
            int cantidad = leerEntero("Ingrese cantidad a vender: ");
            if (cantidad > 0 && cantidad <= articulo.stock) {
                articulo.stock -= cantidad;
                cout << "Venta realizada. Stock actualizado.\n";
            } else {
                cout << "Cantidad no válida o insuficiente stock.\n";
            }
            return;
        }
    }
    cout << "Articulo no encontrado.\n";
}

// -------- MENÚS --------
void menuGestionArticulos() {
    int opcion;
    do {
        cout << "\n--- GESTION DE ARTICULOS ---\n";
        cout << "1. Listar articulos\n2. Agregar articulo\n3. Editar articulo\n4. Eliminar articulo\n5. Volver\n";
        opcion = leerEntero("Seleccione una opcion: ");

        switch (opcion) {
            case 1: listarArticulos(); break;
            case 2: nuevoArticulo(); break;
            case 3: editarArticulo(); break;
            case 4: eliminarArticulo(); break;
        }
    } while (opcion != 5);
}

void menuStock() {
    int opcion;
    do {
        cout << "\n--- OPERACIONES DE STOCK ---\n";
        cout << "1. Comprar articulo\n2. Vender articulo\n3. Volver\n";
        opcion = leerEntero("Seleccione una opcion: ");

        switch (opcion) {
            case 1: comprarArticulo(); break;
            case 2: venderArticulo(); break;
        }
    } while (opcion != 3);
}

int main() {
    int opcion;
    do {
        cout << "\n--- MENU PRINCIPAL ---\n";
        cout << "1. Gestion de articulos\n2. Operaciones de stock\n3. Salir\n";
        opcion = leerEntero("Seleccione una opcion: ");

        switch (opcion) {
            case 1: menuGestionArticulos(); break;
            case 2: menuStock(); break;
        }
    } while (opcion != 3);

    cout << "Saliendo del programa.\n";
    return 0;
}
