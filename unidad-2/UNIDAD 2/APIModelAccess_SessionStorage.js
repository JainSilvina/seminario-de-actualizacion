class APIModelAccess {
    constructor() {
        // Puedes cambiar este valor para alternar entre LocalStorage y SessionStorage
        this._storageType = 'localStorage'; // O 'sessionStorage'

        this._authData = new Map();
        this._maxLoginFailedAttempts = 3;

        // Determinar qué objeto de almacenamiento usar
        const storage = this._storageType === 'localStorage' ? localStorage : sessionStorage;

        // Intentar cargar datos de usuario desde el almacenamiento seleccionado
        const storedAuthData = storage.getItem('authData');
        if (storedAuthData) {
            try {
                this._authData = new Map(JSON.parse(storedAuthData));
                console.log(`Datos de usuario cargados desde ${this._storageType}.`);
            } catch (e) {
                console.error(`Error al parsear datos de ${this._storageType}, inicializando con datos por defecto.`, e);
                this._initializeDefaultUserData();
            }
        } else {
            this._initializeDefaultUserData();
        }

        this._inventory = new Map([
            [1, { nombre: 'Lavandina x 1L', precio: 875.25, stock: 3000 }],
            [4, { nombre: 'Detergente x 500mL', precio: 1102.45, stock: 2010 }],
            [22, { nombre: 'Jabon en polvo x 250g', precio: 650.22, stock: 407 }]
        ]);
        this._nextItemId = 23;

        this._userPermissions = {
            'Administrador': ['cambiar contraseña', 'gestionar artículos', 'comprar artículo', 'gestionar usuarios'],
            'Cliente': ['cambiar contraseña', 'comprar artículo'],
            'Vendedor': ['cambiar contraseña', 'comprar artículo'],
            'Trabajador de depósito': ['cambiar contraseña']
        };

        this._currentLoggedInUser = null;
        this._saveAuthData();
    }

    _initializeDefaultUserData() {
        let userData = [
            { username: 'admin', password: 'Admin#123', category: 'Administrador', failedLoginCounter: 0, isLocked: false },
            { username: 'cliente1', password: 'Client&456', category: 'Cliente', failedLoginCounter: 0, isLocked: false },
            { username: 'vendedor1', password: 'Seller$789', category: 'Vendedor', failedLoginCounter: 0, isLocked: false },
            { username: 'deposito1', password: 'Depot%012', category: 'Trabajador de depósito', failedLoginCounter: 0, isLocked: false }
        ];

        userData.forEach(user => {
            this._authData.set(user.username, { password: user.password, category: user.category, failedLoginCounter: user.failedLoginCounter, isLocked: user.isLocked });
        });
    }

    _saveAuthData() {
        const storage = this._storageType === 'localStorage' ? localStorage : sessionStorage;
        storage.setItem('authData', JSON.stringify(Array.from(this._authData.entries())));
    }

   
    authenticateUser(username, password) {
        
        this._saveAuthData();
        return api_return;
    }

    changePassword(username, newPassword) {
        
        this._saveAuthData();
        return true;
    }

    createAccount(username, password, category) {
        
        this._saveAuthData();
        return { status: true };
    }

    deleteUser(username) {
        
        this._saveAuthData();
        return { status: true };
    }

    unlockUser(username) {
        
        this._saveAuthData();
        return { status: true };
    }

    editUserCategory(username, newCategory) {
        
        this._saveAuthData();
        return { status: true };
    }

    
    isValidUserGetData(username) {
        return this._authData.get(username);
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
    getInventoryItems() {
        return Array.from(this._inventory.values()).map((item, index) => ({ id: Array.from(this._inventory.keys())[index], ...item }));
    }
    addNewItem(nombre, precio, stock) {
        if (!nombre || isNaN(precio) || isNaN(stock) || precio <= 0 || stock < 0) {
            return { status: false, result: 'INVALID_INPUT' };
        }
        const newId = this._nextItemId++;
        this._inventory.set(newId, { nombre, precio, stock });
        return { status: true, newId };
    }
    editExistingItem(id, nuevoNombre, nuevoPrecioStr, nuevoStockStr) {
        const item = this._inventory.get(id);
        if (!item) {
            return { status: false, result: 'ITEM_NOT_FOUND' };
        }

        const nuevoPrecio = parseFloat(nuevoPrecioStr);
        const nuevoStock = parseInt(nuevoStockStr);

        if (nuevoNombre) item.nombre = nuevoNombre;
        if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) item.precio = nuevoPrecio;
        if (!isNaN(nuevoStock) && nuevoStock >= 0) item.stock = nuevoStock;

        return { status: true };
    }
    deleteItem(id) {
        if (this._inventory.delete(id)) {
            return { status: true };
        }
        return { status: false, result: 'ITEM_NOT_FOUND' };
    }
    buyItem(itemId, quantity) {
        const item = this._inventory.get(itemId);
        if (!item) {
            return { status: false, result: 'ITEM_NOT_FOUND' };
        }
        if (item.stock < quantity) {
            return { status: false, result: 'INSUFFICIENT_STOCK' };
        }
        item.stock -= quantity;
        return { status: true, newStock: item.stock };
    }
}

export { APIModelAccess };