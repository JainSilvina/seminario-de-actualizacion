
class APIModelAccess { 
    constructor() {
        this._authData = new Map();
        this._maxLoginFailedAttempts = 3;

        // Datos de usuario iniciales con categorías
        let userData = [
            { username: 'admin', password: 'Admin#123', category: 'Administrador', failedLoginCounter: 0, isLocked: false },
            { username: 'cliente1', password: 'Client&456', category: 'Cliente', failedLoginCounter: 0, isLocked: false },
            { username: 'vendedor1', password: 'Seller$789', category: 'Vendedor', failedLoginCounter: 0, isLocked: false },
            { username: 'deposito1', password: 'Depot%012', category: 'Trabajador de depósito', failedLoginCounter: 0, isLocked: false }
        ];

        userData.forEach(user => {
            this._authData.set(user.username, { password: user.password, category: user.category, failedLoginCounter: user.failedLoginCounter, isLocked: user.isLocked });
        });

        // Estructura de datos para los artículos de limpieza (Map)
        this._inventory = new Map([
            [1, { nombre: 'Lavandina x 1L', precio: 875.25, stock: 3000 }],
            [4, { nombre: 'Detergente x 500mL', precio: 1102.45, stock: 2010 }],
            [22, { nombre: 'Jabon en polvo x 250g', precio: 650.22, stock: 407 }]
        ]);
        this._nextItemId = 23;

        // Objeto para definir los permisos de cada categoría
        this._userPermissions = {
            'Administrador': ['cambiar contraseña', 'gestionar artículos', 'comprar artículo', 'gestionar usuarios'],
            'Cliente': ['cambiar contraseña', 'comprar artículo'],
            'Vendedor': ['cambiar contraseña', 'comprar artículo'],
            'Trabajador de depósito': ['cambiar contraseña']
        };

        this._currentLoggedInUser = null;
    }

 

    isValidUserGetData(username) {
        return this._authData.get(username);
    }

    authenticateUser(username, password) {
        let api_return = {
            status: false,
            result: null,
            username: null,
            category: null
        };

        if ((username !== undefined && username !== null && username !== '') && (password !== undefined && password !== null && password !== '')) {
            let userdata = this.isValidUserGetData(username);

            if (userdata) { 
                if (!userdata.isLocked) {
                    if (userdata.password === password) {
                        api_return.status = true;
                        api_return.username = username;
                        api_return.category = userdata.category;
                        userdata.failedLoginCounter = 0;
                        this._currentLoggedInUser = { username: username, category: userdata.category };
                    } else {
                        api_return.status = false;
                        api_return.result = 'USER_PASSWORD_FAILED';
                        userdata.failedLoginCounter++;
                        if (userdata.failedLoginCounter >= this._maxLoginFailedAttempts) {
                            userdata.isLocked = true;
                            api_return.status = false;
                            api_return.result = 'BLOCKED_USER';
                        }
                    }
                } else {
                    api_return.status = false;
                    api_return.result = 'BLOCKED_USER';
                }
            } else { // Usuario no encontrado
                api_return.status = false;
                api_return.result = 'USER_NOT_FOUND';
            }
        }
        return api_return;
    }

    changePassword(username, newPassword) {
        let userdata = this.isValidUserGetData(username);
        if (userdata) {
            if (this.isValidPassword(newPassword)) {
                userdata.password = newPassword;
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    isValidPassword(password) {
        if (!password || password.length < 8 || password.length > 16) {
            return false;
        }
        const hasUppercase = /[A-Z]/.test(password);
        const specialSymbolCount = password.replace(/[\w\s_]/g, '').length;
        return hasUppercase && specialSymbolCount >= 2;
    }

    createAccount(username, password, category) {
        if (this._authData.has(username)) {
            return { status: false, result: 'USERNAME_EXISTS' };
        }
        if (!this.isValidPassword(password)) {
            return { status: false, result: 'INVALID_PASSWORD' };
        }
        if (!['Administrador', 'Cliente', 'Vendedor', 'Trabajador de depósito'].includes(category)) {
            return { status: false, result: 'INVALID_CATEGORY' };
        }

        this._authData.set(username, { password: password, category: category, failedLoginCounter: 0, isLocked: false });
        return { status: true, result: 'ACCOUNT_CREATED' };
    }

    getInventoryItems() {
        return Array.from(this._inventory.entries()).map(([id, item]) => ({ id, ...item }));
    }

    addNewItem(nombre, precio, stock) {
        if (!nombre || isNaN(precio) || isNaN(stock)) {
            return { status: false, result: 'INVALID_DATA' };
        }
        this._inventory.set(this._nextItemId++, { nombre, precio, stock });
        return { status: true, newId: this._nextItemId - 1 };
    }

    editExistingItem(id, nuevoNombre, nuevoPrecio, nuevoStock) {
        if (!this._inventory.has(id)) {
            return { status: false, result: 'ITEM_NOT_FOUND' };
        }
        const item = this._inventory.get(id);
        if (nuevoNombre !== null && nuevoNombre !== undefined) item.nombre = nuevoNombre;
        if (!isNaN(parseFloat(nuevoPrecio)) && nuevoPrecio !== null && nuevoPrecio !== undefined) item.precio = parseFloat(nuevoPrecio);
        if (!isNaN(parseInt(nuevoStock)) && nuevoStock !== null && nuevoStock !== undefined) item.stock = parseInt(nuevoStock);
        return { status: true };
    }

    deleteExistingItem(id) {
        if (!this._inventory.has(id)) {
            return { status: false, result: 'ITEM_NOT_FOUND' };
        }
        this._inventory.delete(id);
        return { status: true };
    }

    buyItem(id, quantity) {
        if (!this._inventory.has(id)) {
            return { status: false, result: 'ITEM_NOT_FOUND' };
        }
        const item = this._inventory.get(id);
        if (item.stock === 0) {
            return { status: false, result: 'NO_STOCK' };
        }
        if (isNaN(quantity) || quantity <= 0 || quantity > item.stock) {
            return { status: false, result: 'INVALID_QUANTITY' };
        }
        item.stock -= quantity;
        return { status: true, newStock: item.stock };
    }

    getMaxLoginAttempts() {
        return this._maxLoginFailedAttempts;
    }

    getUserPermissions(category) {
        return this._userPermissions[category] || [];
    }

    getCurrentLoggedInUser() {
        return this._currentLoggedInUser;
    }

    logoutUser() {
        this._currentLoggedInUser = null;
    }

    listUsers() {
        let userList = [];
        this._authData.forEach((data, username) => {
            userList.push({ username: username, category: data.category, isLocked: data.isLocked });
        });
        return userList;
    }

    deleteUser(username) {
        if (this._authData.has(username)) {
            this._authData.delete(username);
            return { status: true };
        }
        return { status: false, result: 'USER_NOT_FOUND' };
    }

    unlockUser(username) {
        let userdata = this.isValidUserGetData(username);
        if (userdata) {
            userdata.isLocked = false;
            userdata.failedLoginCounter = 0;
            return { status: true };
        }
        return { status: false, result: 'USER_NOT_FOUND' };
    }

    editUserCategory(username, newCategory) {
        let userdata = this.isValidUserGetData(username);
        if (userdata) {
            if (!['Administrador', 'Cliente', 'Vendedor', 'Trabajador de depósito'].includes(newCategory)) {
                return { status: false, result: 'INVALID_CATEGORY' };
            }
            userdata.category = newCategory;
            return { status: true };
        }
        return { status: false, result: 'USER_NOT_FOUND' };
    }
}

export { APIModelAccess }; 