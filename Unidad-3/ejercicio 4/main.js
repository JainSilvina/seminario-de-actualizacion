document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('open-modal-button');
    const modalDialog = document.getElementById('myModal');

    if (openButton && modalDialog) {
        openButton.addEventListener('click', () => {
            modalDialog.show();
            console.log('Modal abierto.');
        });

        modalDialog.addEventListener('modal:accept', (event) => {
            console.log('✅ Acción ACEPTADA por el usuario.');
            window.alert('Has aceptado la acción.');
        });

        modalDialog.addEventListener('modal:cancel', (event) => {
            console.log('❌ Acción CANCELADA por el usuario o por cierre externo (ESC/click en fondo).');
            window.alert('Has cancelado la acción.');
        });
    } else {
        console.error('No se encontraron los elementos HTML necesarios para la prueba.');
    }
});