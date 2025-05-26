// -----------------------------------------------------
// services/contactService.js
// Capa de lógica de negocio para contactos
// -----------------------------------------------------
const contactRepository = require('../data/contactRepository');

class ContactService {
    async submitContactForm(nombre, email, telefono, asunto, mensaje) {
        // Aquí podrías añadir validaciones, enviar correos electrónicos de confirmación, etc.
        if (!nombre || !email || !asunto || !mensaje) {
            throw new Error('Todos los campos obligatorios deben ser completados.');
        }
        return await contactRepository.createContact(nombre, email, telefono, asunto, mensaje);
    }
}

module.exports = new ContactService();
