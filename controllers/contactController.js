// -----------------------------------------------------
// controllers/contactController.js
// Capa de controladores para contactos
// -----------------------------------------------------
const contactService = require('../services/contactService');

class ContactController {
    async submitContactForm(req, res) {
        const { nombre, email, telefono, asunto, mensaje } = req.body;
        try {
            const success = await contactService.submitContactForm(nombre, email, telefono, asunto, mensaje);
            if (success) {
                res.status(201).json({ message: 'Mensaje de contacto enviado exitosamente.' });
            } else {
                res.status(500).json({ message: 'No se pudo enviar el mensaje de contacto.' });
            }
        } catch (error) {
            console.error('Error en ContactController.submitContactForm:', error.message);
            res.status(400).json({ message: error.message }); // 400 para errores de validación, 500 para otros errores
        }
    }
}

module.exports = new ContactController();