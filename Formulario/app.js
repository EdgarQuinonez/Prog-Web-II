document.addEventListener('DOMContentLoaded', function() {
   // Initialize database
    initDatabase();
    
    // Tab Navigation Elements
    const patientFormTab = document.getElementById('patient-form-tab');
    const adminViewTab = document.getElementById('admin-view-tab');
    const patientFormSection = document.getElementById('patient-form-section');
    const adminViewSection = document.getElementById('admin-view-section');
    
    // Tab Switching Functionality
    function switchTab(tab) {
        // Update active tab styling
        patientFormTab.classList.remove('active');
        adminViewTab.classList.remove('active');
        tab.classList.add('active');
        
        // Show/hide sections
        patientFormSection.classList.remove('active-section');
        adminViewSection.classList.remove('active-section');
        
        if (tab === patientFormTab) {
            patientFormSection.classList.add('active-section');
        } else {
            adminViewSection.classList.add('active-section');
            loadRecordsTable(); // Load records when admin view is shown
        }
    }
    
    // Tab Click Event Listeners
    patientFormTab.addEventListener('click', () => switchTab(patientFormTab));
    adminViewTab.addEventListener('click', () => switchTab(adminViewTab));
    
    // Admin View Elements
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const recordsList = document.getElementById('records-list');
    const editModal = document.getElementById('edit-modal');
    const closeModal = document.querySelector('.close-modal');
    const editForm = document.getElementById('edit-form');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    
    // Load records into the admin table
    function loadRecordsTable(searchTerm = '') {
        obtenerRegistrosPacientes(function(registros) {
            recordsList.innerHTML = '';
            
            if (registros.length === 0) {
                recordsList.innerHTML = '<tr><td colspan="6">No se encontraron registros</td></tr>';
                return;
            }
            
            // Filter records if search term exists
            const filteredRecords = searchTerm 
                ? registros.filter(registro => 
                    registro.mascota.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    registro.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                : registros;
            
            filteredRecords.forEach(registro => {
                const row = document.createElement('tr');
                
                // Format date for display
                const fechaVisita = new Date(registro.fechaRegistro);
                const fechaFormateada = fechaVisita.toLocaleDateString('es-ES');
                
                row.innerHTML = `
                    <td>${registro.id}</td>
                    <td>${registro.mascota.nombre}</td>
                    <td>${registro.cliente.nombre}</td>
                    <td>${registro.mascota.especie}</td>
                    <td>${fechaFormateada}</td>
                    <td class="actions">
                        <button class="edit-btn" data-id="${registro.id}">Editar</button>
                        <button class="delete-btn" data-id="${registro.id}">Eliminar</button>
                        <button class="view-btn" data-id="${registro.id}">Ver</button>
                    </td>
                `;
                
                recordsList.appendChild(row);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    openEditModal(id);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    if (confirm('¿Está seguro que desea eliminar este registro?')) {
                        eliminarRegistroPaciente(id, function() {
                            loadRecordsTable();
                        });
                    }
                });
            });
            
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    // Implement view functionality as needed
                    alert(`Ver detalles del registro ${id}`);
                });
            });
        });
    }
    
    // Open edit modal with record data
    function openEditModal(id) {
        obtenerRegistroPaciente(id, function(registro) {
            if (!registro) {
                alert('Registro no encontrado');
                return;
            }
            
            // Populate edit form with record data
            editForm.innerHTML = `
                <input type="hidden" name="id" value="${registro.id}">
                
                <div class="form-group">
                    <label>Nombre Mascota:</label>
                    <input type="text" name="pet-name" value="${registro.mascota.nombre}" required>
                </div>
                
                <div class="form-group">
                    <label>Nombre Dueño:</label>
                    <input type="text" name="owner-name" value="${registro.cliente.nombre}" required>
                </div>
                
                <div class="form-group">
                    <label>Especie:</label>
                    <input type="text" name="species" value="${registro.mascota.especie}" required>
                </div>
                
                <div class="form-group">
                    <label>Raza:</label>
                    <input type="text" name="breed" value="${registro.mascota.raza}" required>
                </div>
                
                <!-- Add more fields as needed -->
            `;
            
            editModal.style.display = 'block';
        });
    }
    
    // Close edit modal
    function closeEditModal() {
        editModal.style.display = 'none';
    }
    
    // Save edited record
    function saveEditedRecord() {
        const formData = new FormData(editForm);
        const id = parseInt(formData.get('id'));
        
        obtenerRegistroPaciente(id, function(registro) {
            if (!registro) return;
            
            // Update record with edited values
            registro.mascota.nombre = formData.get('pet-name');
            registro.cliente.nombre = formData.get('owner-name');
            registro.mascota.especie = formData.get('species');
            registro.mascota.raza = formData.get('breed');
            
            actualizarRegistroPaciente(registro, function() {
                closeEditModal();
                loadRecordsTable();
            });
        });
    }
    
    // Event Listeners for Admin View
    searchBtn.addEventListener('click', function() {
        loadRecordsTable(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadRecordsTable(searchInput.value);
        }
    });
    
    refreshBtn.addEventListener('click', function() {
        searchInput.value = '';
        loadRecordsTable();
    });
    
    closeModal.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    saveEditBtn.addEventListener('click', saveEditedRecord);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

        // Elementos del formulario
    const intakeForm = document.getElementById('intake-form');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Manejador de envío del formulario
    intakeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recolectar datos del formulario
        const formData = {
            cliente: {
                nombre: document.getElementById('client-name').value,
                direccion: {
                    calle: document.getElementById('street-address').value,
                    ciudad: document.getElementById('city').value,
                    estado: document.getElementById('state').value,
                    codigoPostal: document.getElementById('zip-code').value
                },
                contacto: {
                    email: document.getElementById('email').value,
                    telefono: document.getElementById('phone').value
                },
                contactoEmergencia: {
                    nombre: document.getElementById('emergency-contact-name').value,
                    parentesco: document.getElementById('emergency-contact-relationship').value,
                    telefono: document.getElementById('emergency-contact-phone').value
                }
            },
            mascota: {
                nombre: document.getElementById('pet-name').value,
                tiempoPosesion: document.getElementById('ownership-duration').value,
                especie: document.getElementById('species').value,
                raza: document.getElementById('breed').value,
                color: document.getElementById('color').value,
                edad: document.getElementById('age').value,
                genero: document.querySelector('input[name="gender"]:checked')?.value || '',
                esterilizado: document.querySelector('input[name="neutered"]:checked')?.value || '',
                exposicionExterior: document.querySelector('input[name="outdoor-exposure"]:checked')?.value || '',
                historialViajes: document.getElementById('travel-history').value
            },
            fechaRegistro: new Date().toISOString()
        };
        
        // Validar campos requeridos
        if (!validarFormulario(formData)) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }
        
        // Guardar en la base de datos
        guardarRegistroPaciente(formData, function() {
            alert('¡Formulario de ingreso enviado con éxito!');
            intakeForm.reset();
        });
    });
    
    // Manejador del botón limpiar
    clearBtn.addEventListener('click', function() {
        if (confirm('¿Está seguro que desea limpiar el formulario?')) {
            intakeForm.reset();
        }
    });
    
    // Función para validar campos requeridos
    function validarFormulario(datos) {
        if (!datos.cliente.nombre || 
            !datos.cliente.direccion.calle ||
            !datos.cliente.direccion.ciudad ||
            !datos.cliente.direccion.estado ||
            !datos.cliente.direccion.codigoPostal ||
            !datos.cliente.contacto.email ||
            !datos.cliente.contacto.telefono ||
            !datos.cliente.contactoEmergencia.nombre ||
            !datos.cliente.contactoEmergencia.parentesco ||
            !datos.cliente.contactoEmergencia.telefono ||
            !datos.mascota.nombre ||
            !datos.mascota.especie ||
            !datos.mascota.raza ||
            !datos.mascota.color ||
            !datos.mascota.edad ||
            !datos.mascota.genero) {
            return false;
        }
        return true;
    }
    
    // Función para cargar registros (para uso futuro)
    function cargarRegistrosPacientes(callback) {
        obtenerRegistrosPacientes(function(registros) {
            callback(registros);
        });
    }
});