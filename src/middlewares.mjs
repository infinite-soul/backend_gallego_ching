export function validateFields(req, res, next) {
    const requiredFields = ['title', 'description', 'price', 'stock', 'category'];
    const updatedFields = Object.keys(req.body);

    // Verificar si hay campos adicionales en la solicitud
    const hasInvalidFields = updatedFields.some(field => !requiredFields.includes(field));
    if (hasInvalidFields) {
        return res.status(400).send({ status: 'error', error: 'No se permiten campos adicionales en la solicitud' });
    }

    // Verificar si se proporcionó al menos un campo para actualizar
    if (updatedFields.length === 0) {
        return res.status(400).send({ status: 'error', error: 'Debes proporcionar al menos un campo para actualizar' });
    }

    // Verificar si al menos uno de los campos requeridos coincide con los campos proporcionados
    const isValid = requiredFields.some(field => updatedFields.includes(field));
    if (!isValid) {
        return res.status(400).send({ status: 'error', error: 'Debes proporcionar al menos uno de los campos requeridos para actualizar' });
    }

    next();
}
