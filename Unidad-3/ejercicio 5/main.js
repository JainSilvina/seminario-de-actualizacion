document.addEventListener('DOMContentLoaded', () => {
    const contactButton = document.getElementById('contact-button');
    const modalDialog = document.getElementById('contactModal');
    const contactForm = document.getElementById('formInsideModal');

    if (contactButton && modalDialog && contactForm) {

        contactButton.addEventListener('click', () => {
            modalDialog.show();
        });

        modalDialog.addEventListener('modal:accept', (event) => {

            
            window.alert('Su consulta fue recibida. A la brevedad lo contactaremos. Gracias');
            
            contactForm.resetForm();
            
            console.log('Formulario "enviado" (aceptado el modal).');
        });

        modalDialog.addEventListener('modal:cancel', (event) => {
            console.log('Envío CANCELADO por el usuario.');
        });

    } else {
        console.error('No se encontraron todos los elementos necesarios (botón, modal o formulario) en el DOM.');
    }
});