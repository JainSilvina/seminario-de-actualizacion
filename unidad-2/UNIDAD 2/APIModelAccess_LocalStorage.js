class APIModelAccess {
    constructor() {
        this._authData = new Map();
        this._maxLoginFailedAttempts = 3;

        // Intentar cargar datos de usuario desde localStorage
        const storedAuthData = localStorage.getItem('authData');
        if (storedAuthData) {
            try {
                // Si hay datos en localStorage, los parseamos y convertimos de nuevo a un Map
                this._authData = new Map(JSON.parse(storedAuthData));
                console.log("Datos de usuario cargados desde LocalStorage.");
            } catch (e) {
                // Si hay un error al parsear (ej. datos corruptos), inicializamos con datos por defecto
                console.error("Error al parsear datos de localStorage, inicializando con datos por defecto.", e);
                this._initializeDefaultUserData();
            }
        } else {
            // Si no hay datos en localStorage, inicializamos con los datos por defecto
            this._initializeDefaultUserData();
        }
       
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
       
        localStorage.setItem('authData', JSON.stringify(Array.from(this._authData.entries())));
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
            } else { 
                api_return.status = false;
                api_return.result = 'USER_NOT_FOUND';
            }
        }
       
        this._saveAuthData(); 
        
        return api_return;
    }

    changePassword(username, newPassword) {
        let userdata = this.isValidUserGetData(username);
        if (userdata) {
            if (this.isValidPassword(newPassword)) {
                userdata.password = newPassword;
                
                this._saveAuthData(); 
                
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
        
        this._saveAuthData(); 
        
        return { status: true };
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
           
            this._saveAuthData(); 
            
            return { status: true };
        }
        return { status: false, result: 'USER_NOT_FOUND' };
    }

    unlockUser(username) {
        let userdata = this.isValidUserGetData(username);
        if (userdata) {
            userdata.isLocked = false;
            userdata.failedLoginCounter = 0;
           
            this._saveAuthData(); 
            
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
           
            this._saveAuthData(); 
            
            return { status: true };
        }
        return { status: false, result: 'USER_NOT_FOUND' };
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