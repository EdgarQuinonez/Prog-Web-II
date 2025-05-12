let db;

// Inicializar la base de datos
function initDatabase() {
    console.log("Base de datos inicializada");
    
    // Usando localStorage como alternativa temporal
    if (!localStorage.getItem('registros-pacientes-veterinarios')) {
        localStorage.setItem('registros-pacientes-veterinarios', JSON.stringify([]));
    }
}

// Guardar un nuevo registro de paciente
function guardarRegistroPaciente(registro, callback) {
    try {
        const registros = JSON.parse(localStorage.getItem('registros-pacientes-veterinarios'));
        registro.id = registros.length > 0 ? Math.max(...registros.map(r => r.id)) + 1 : 1;
        registros.push(registro);
        localStorage.setItem('registros-pacientes-veterinarios', JSON.stringify(registros));
        callback();
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        alert('Ocurrió un error al guardar el registro. Por favor intente nuevamente.');
    }
}

// Obtener todos los registros de pacientes
function obtenerRegistrosPacientes(callback) {
    try {
        const registros = JSON.parse(localStorage.getItem('registros-pacientes-veterinarios'));
        callback(registros || []);
    } catch (error) {
        console.error('Error al obtener registros:', error);
        callback([]);
    }
}

// Obtener un registro específico por ID
function obtenerRegistroPaciente(id, callback) {
    try {
        const registros = JSON.parse(localStorage.getItem('registros-pacientes-veterinarios'));
        const registro = registros.find(r => r.id === id);
        callback(registro);
    } catch (error) {
        console.error('Error al obtener el registro:', error);
        callback(null);
    }
}

// Actualizar un registro existente
function actualizarRegistroPaciente(registro, callback) {
    try {
        let registros = JSON.parse(localStorage.getItem('registros-pacientes-veterinarios'));
        const indice = registros.findIndex(r => r.id === registro.id);
        if (indice !== -1) {
            registros[indice] = registro;
            localStorage.setItem('registros-pacientes-veterinarios', JSON.stringify(registros));
        }
        callback();
    } catch (error) {
        console.error('Error al actualizar el registro:', error);
        alert('Ocurrió un error al actualizar el registro.');
    }
}

// Eliminar un registro
function eliminarRegistroPaciente(id, callback) {
    try {
        let registros = JSON.parse(localStorage.getItem('registros-pacientes-veterinarios'));
        registros = registros.filter(r => r.id !== id);
        localStorage.setItem('registros-pacientes-veterinarios', JSON.stringify(registros));
        callback();
    } catch (error) {
        console.error('Error al eliminar el registro:', error);
        alert('Ocurrió un error al eliminar el registro.');
    }
}