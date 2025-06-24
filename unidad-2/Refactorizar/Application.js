import { LoginApplicationView } from './LoginApplicationView.js'; // Importa desde el mismo directorio

class Application { 
    constructor(apiInstanceObject) {
        this._model = apiInstanceObject; // Referencia al modelo (instancia de APIModelAccess)
        this._loginView = new LoginApplicationView(this._model); // Instancia de la vista de login
        this._currentUser = null; // Almacena el usuario actualmente logueado
    }

    run() { // Este método `run` maneja todo el flujo de prompts y alerts
        this.showMainMenu();
    }

    showMainMenu() {
        let option;
        do {
            option = prompt("Menú principal:\n1 = Iniciar sesión\n2 = Crear cuenta de usuario\nX = Salir\nIngrese una opción:");

            if (option === '1') {
                this.loginFlow();
            } else if (option === '2') {
                alert("La creación de cuentas de usuario solo está disponible para Administradores después de iniciar sesión.");
            } else if (option.toUpperCase() === 'X') {
                alert("Saliendo del programa.");
                return;
            } else if (option !== null) {
                alert("Opción inválida. Por favor, ingrese 1, 2 o X.");
            }
        } while (option !== null && option.toUpperCase() !== 'X');
    }

    loginFlow() {
        let attempts = 0;
        let loginResult;

        do {
            loginResult = this._loginView.show(); // Llama a la vista de login para obtener credenciales y autenticar

            if (loginResult && loginResult.status) {
                this._currentUser = { username: loginResult.username, category: loginResult.category };
                alert(`¡Bienvenido/a ${this._currentUser.username} (${this._currentUser.category})!`);
                const menuResult = this.showUserMenu(this._currentUser.username, this._currentUser.category);
                if (menuResult === 'LOGOUT') {
                    this._currentUser = null;
                    return;
                }
            } else if (loginResult && loginResult.result === 'USER_PASSWORD_FAILED') {
                attempts++;
                if (attempts >= this._model.getMaxLoginAttempts()) {
                    alert('Demasiados intentos fallidos. Usuario bloqueado.');
                    return;
                }
            } else if (loginResult && loginResult.result === 'BLOCKED_USER') {
                alert('Usuario bloqueado. Contacte al administrador');
                return;
            } else if (loginResult && loginResult.result === 'USER_NOT_FOUND') {
                alert('Usuario no encontrado.');
            }
        } while (loginResult === null || (loginResult && (loginResult.result === 'USER_PASSWORD_FAILED' || loginResult.result === 'USER_NOT_FOUND')));
        return null;
    }

    showUserMenu(username, category) {
        let option;
        do {
            let menuOptions = `¡Bienvenido/a ${username} (${category})!\nMenú de acciones:\n`;
            let allowedActions = this._model.getUserPermissions(category);
            let optionCounter = 1;
            const actionMap = {};

            allowedActions.forEach(action => {
                if (action === 'cambiar contraseña') {
                    menuOptions += `${optionCounter}. Cambiar contraseña\n`;
                    actionMap[optionCounter] = 'cambiar contraseña';
                    optionCounter++;
                } else if (action === 'gestionar artículos') {
                    menuOptions += `${optionCounter}. Gestionar artículos\n`;
                    actionMap[optionCounter] = 'gestionar artículos';
                    optionCounter++;
                } else if (action === 'comprar artículo') {
                    menuOptions += `${optionCounter}. Comprar artículo\n`;
                    actionMap[optionCounter] = 'comprar artículo';
                    optionCounter++;
                } else if (action === 'gestionar usuarios') {
                    menuOptions += `${optionCounter}. Gestionar usuarios\n`;
                    actionMap[optionCounter] = 'gestionar usuarios';
                    optionCounter++;
                }
            });
            menuOptions += `X. Salir\nIngrese una opción:`;

            option = prompt(menuOptions);

            if (option !== null) {
                const selectedAction = actionMap[parseInt(option)];
                if (selectedAction === 'cambiar contraseña') {
                    this.handleChangePassword(username);
                } else if (selectedAction === 'gestionar artículos') {
                    this.handleManageInventory();
                } else if (selectedAction === 'comprar artículo') {
                    this.handleBuyItem();
                } else if (selectedAction === 'gestionar usuarios') {
                    this.handleManageUsers();
                } else if (option.toUpperCase() === 'X') {
                    alert("Saliendo del menú.");
                    this._model.logoutUser();
                    return 'LOGOUT';
                } else {
                    alert("Opción inválida.");
                }
            }
        } while (option !== null && option.toUpperCase() !== 'X');
        return null;
    }

    handleChangePassword(username) {
        let newPassword;
        do {
            newPassword = prompt("Ingrese su nueva contraseña (8-16 alfanuméricos, 1 mayúscula, 2 símbolos):");
            if (newPassword === null) {
                return;
            }
            if (!this._model.isValidPassword(newPassword)) {
                alert("La contraseña no cumple con los requisitos de seguridad.");
            }
        } while (!this._model.isValidPassword(newPassword));

        const success = this._model.changePassword(username, newPassword);
        if (success) {
            alert("Contraseña cambiada exitosamente.");
        } else {
            alert("Error al intentar cambiar la contraseña.");
        }
    }

    handleManageInventory() {
        let option;
        do {
            option = prompt("Gestión de artículos:\n1 = Listar artículos\n2 = Nuevo artículo\n3 = Editar artículo\n4 = Eliminar artículo\nX = Volver al menú principal\nIngrese una opción:");

            switch (option) {
                case '1':
                    this.handleListItems();
                    break;
                case '2':
                    this.handleNewItem();
                    break;
                case '3':
                    this.handleEditItem();
                    break;
                case '4':
                    this.handleDeleteItem();
                    break;
                case 'X':
                case 'x':
                    alert("Volviendo al menú principal.");
                    return;
                case null:
                    return;
                default:
                    alert("Opción inválida. Por favor, ingrese 1, 2, 3, 4 o X.");
            }
        } while (true);
    }

    handleListItems() {
        const items = this._model.getInventoryItems();
        let itemList = "Listado de artículos:\n";
        if (items.length === 0) {
            itemList += "No hay artículos en el inventario.";
        } else {
            items.forEach(item => {
                itemList += `ID: ${item.id}, Nombre: ${item.nombre}, Precio: ${item.precio}, Stock: ${item.stock}\n`;
            });
        }
        alert(itemList);
    }

    handleNewItem() {
        const nombre = prompt("Ingrese el nombre del nuevo artículo:");
        if (!nombre) return;
        const precioStr = prompt("Ingrese el precio del nuevo artículo:");
        const precio = parseFloat(precioStr);
        const stockStr = prompt("Ingrese el stock del nuevo artículo:");
        const stock = parseInt(stockStr);

        const result = this._model.addNewItem(nombre, precio, stock);
        if (result.status) {
            alert(`Artículo '${nombre}' agregado con ID: ${result.newId}`);
        } else {
            alert("Error al agregar artículo: " + result.result);
        }
    }

    handleEditItem() {
        const idStr = prompt("Ingrese el ID del artículo que desea editar:");
        const id = parseInt(idStr);
        if (isNaN(id)) {
            alert("ID inválido.");
            return;
        }

        const items = this._model.getInventoryItems();
        const itemToEdit = items.find(item => item.id === id);

        if (itemToEdit) {
            const nuevoNombre = prompt(`Nuevo nombre (actual: ${itemToEdit.nombre}):`, itemToEdit.nombre);
            const nuevoPrecioStr = prompt(`Nuevo precio (actual: ${itemToEdit.precio}):`, itemToEdit.precio);
            const nuevoStockStr = prompt(`Nuevo stock (actual: ${itemToEdit.stock}):`, itemToEdit.stock);

            const result = this._model.editExistingItem(id, nuevoNombre, nuevoPrecioStr, nuevoStockStr);
            if (result.status) {
                alert(`Artículo con ID ${id} editado.`);
            } else {
                alert("Error al editar artículo: " + result.result);
            }
        } else {
            alert(`No se encontró ningún artículo con el ID ${id}.`);
        }
    }

    handleDeleteItem() {
        const idStr = prompt("Ingrese el ID del artículo que desea eliminar:");
        const id = parseInt(idStr);
        if (isNaN(id)) {
            alert("ID inválido.");
            return;
        }

        if (confirm(`¿Seguro que desea eliminar el artículo con ID ${id}?`)) {
            const result = this._model.deleteExistingItem(id);
            if (result.status) {
                alert(`Artículo con ID ${id} eliminado.`);
            } else {
                alert("Error al eliminar artículo: " + result.result);
            }
        }
    }

    handleBuyItem() {
        const idStr = prompt("Ingrese el ID del artículo que desea comprar:");
        const id = parseInt(idStr);
        if (isNaN(id)) {
            alert("ID inválido.");
            return;
        }

        const items = this._model.getInventoryItems();
        const itemToBuy = items.find(item => item.id === id);

        if (itemToBuy) {
            if (itemToBuy.stock > 0) {
                const quantityStr = prompt(`Ingrese la cantidad de '${itemToBuy.nombre}' que desea comprar (Stock disponible: ${itemToBuy.stock}):`);
                const quantity = parseInt(quantityStr);

                const result = this._model.buyItem(id, quantity);
                if (result.status) {
                    alert(`Compra realizada. Stock actual de '${itemToBuy.nombre}': ${result.newStock}`);
                } else {
                    alert("Error en la compra: " + result.result);
                }
            } else {
                alert(`El artículo '${itemToBuy.nombre}' no tiene stock disponible.`);
            }
        } else {
            alert(`No se encontró ningún artículo con el ID ${id}.`);
        }
    }

    handleManageUsers() {
        let option;
        do {
            option = prompt("Gestión de usuarios:\n1 = Crear nuevo usuario\n2 = Listar usuarios\n3 = Eliminar usuario\n4 = Desbloquear usuario\n5 = Editar categoría de usuario\nX = Volver al menú principal\nIngrese una opción:");
            switch (option) {
                case '1':
                    this.handleCreateNewUser();
                    break;
                case '2':
                    this.handleListUsers();
                    break;
                case '3':
                    this.handleDeleteUser();
                    break;
                case '4':
                    this.handleUnlockUser();
                    break;
                case '5':
                    this.handleEditUserCategory();
                    break;
                case 'X':
                case 'x':
                    alert("Volviendo al menú principal.");
                    return;
                case null:
                    return;
                default:
                    alert("Opción inválida. Por favor, ingrese 1, 2, 3, 4, 5 o X.");
            }
        } while (true);
    }

    handleCreateNewUser() {
        let newUsername;
        let newPassword;
        let newCategory;

        do {
            newUsername = prompt("Ingrese el nombre de usuario para la nueva cuenta:");
            if (!newUsername) {
                alert("El nombre de usuario no puede estar vacío.");
                continue;
            }
            newPassword = prompt("Ingrese la contraseña para la nueva cuenta (8-16 alfanuméricos, 1 mayúscula, 2 símbolos):");
            if (!newPassword) {
                alert("La contraseña no puede estar vacía.");
                continue;
            }
            newCategory = prompt("Ingrese la categoría del usuario (Administrador, Cliente, Vendedor, Trabajador de depósito):");
            if (!newCategory) {
                alert("La categoría no puede estar vacía.");
                continue;
            }
            break;
        } while (true);

        const result = this._model.createAccount(newUsername, newPassword, newCategory);
        if (result.status) {
            alert(`Cuenta '${newUsername}' (${newCategory}) creada exitosamente.`);
        } else {
            let errorMessage = "Error al crear cuenta: ";
            switch (result.result) {
                case 'USERNAME_EXISTS':
                    errorMessage += "El nombre de usuario ya existe.";
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage += "La contraseña no cumple con los requisitos de seguridad.";
                    break;
                case 'INVALID_CATEGORY':
                    errorMessage += "Categoría inválida. Debe ser Administrador, Cliente, Vendedor o Trabajador de depósito.";
                    break;
                default:
                    errorMessage += "Error desconocido.";
            }
            alert(errorMessage);
        }
    }

    handleListUsers() {
        const users = this._model.listUsers();
        let userList = "Listado de usuarios:\n";
        if (users.length === 0) {
            userList += "No hay usuarios registrados.";
        } else {
            users.forEach(user => {
                userList += `Usuario: ${user.username}, Categoría: ${user.category}, Bloqueado: ${user.isLocked ? 'Sí' : 'No'}\n`;
            });
        }
        alert(userList);
    }

    handleDeleteUser() {
        const usernameToDelete = prompt("Ingrese el nombre de usuario a eliminar:");
        if (!usernameToDelete) return;

        if (confirm(`¿Seguro que desea eliminar el usuario '${usernameToDelete}'?`)) {
            const result = this._model.deleteUser(usernameToDelete);
            if (result.status) {
                alert(`Usuario '${usernameToDelete}' eliminado exitosamente.`);
            } else {
                alert("Error al eliminar usuario: " + result.result);
            }
        }
    }

    handleUnlockUser() {
        const usernameToUnlock = prompt("Ingrese el nombre de usuario a desbloquear:");
        if (!usernameToUnlock) return;

        const result = this._model.unlockUser(usernameToUnlock);
        if (result.status) {
            alert(`Usuario '${usernameToUnlock}' desbloqueado exitosamente.`);
        } else {
            alert("Error al desbloquear usuario: " + result.result);
        }
    }

    handleEditUserCategory() {
        const usernameToEdit = prompt("Ingrese el nombre de usuario cuya categoría desea editar:");
        if (!usernameToEdit) return;

        const newCategory = prompt("Ingrese la nueva categoría (Administrador, Cliente, Vendedor, Trabajador de depósito):");
        if (!newCategory) return;

        const result = this._model.editUserCategory(usernameToEdit, newCategory);
        if (result.status) {
            alert(`Categoría del usuario '${usernameToEdit}' cambiada a '${newCategory}' exitosamente.`);
        } else {
            alert("Error al editar categoría: " + result.result);
        }
    }
}

export { Application }; // Exporta con el nombre de la clase