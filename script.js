/**
 * ==========================================================================
 * SCRIPT INTERACTIVO - CV DINÁMICO
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    inicializarMenuActivo();
});

/**
 * 1. Filtrado de Habilidades
 * Oculta/Muestra las tarjetas de habilidades dinámicamente con transiciones fluidas.
 */
function filtrarHabilidades(categoria) {
    // Actualizar botones de pestañas
    const botones = document.querySelectorAll('.tab-btn');
    botones.forEach(btn => btn.classList.remove('active'));
    
    // Encontrar el botón clickeado
    const botonActivo = Array.from(botones).find(btn => 
        btn.getAttribute('onclick').includes(`'${categoria}'`)
    );
    if (botonActivo) botonActivo.classList.add('active');

    // Filtrar tarjetas
    const tarjetas = document.querySelectorAll('.skill-card');
    tarjetas.forEach(tarjeta => {
        const catTarjeta = tarjeta.getAttribute('data-category');
        if (categoria === 'todas' || catTarjeta === categoria) {
            tarjeta.classList.remove('hidden');
        } else {
            tarjeta.classList.add('hidden');
        }
    });
}

/**
 * 2. Menú de Navegación Dinámico (Scroll Active State)
 * Detecta qué sección está visible en pantalla y resalta el enlace correspondiente.
 */
function inicializarMenuActivo() {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let currentSectionId = 'inicio';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            // Se considera activa si el scroll está a más de la mitad de la sección
            if (window.scrollY >= (sectionTop - 200)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 3. Exportar a PDF (Llamando al flujo de impresión optimizado)
 * Llama a la ventana de impresión del navegador. El CSS de @media print se encarga
 * de formatear el documento perfectamente a blanco y negro y remover partes interactivas.
 */
function exportarPDF() {
    // Temporalmente cambiamos el título de la página para que el PDF se guarde con un nombre elegante
    const tituloOriginal = document.title;
    
    // Intentamos obtener el nombre del usuario si no es el placeholder
    const h1Text = document.querySelector('.glitch-text').textContent;
    const nombreLimpio = h1Text.includes('[Tu Nombre') ? 'Curriculum_Vitae' : h1Text.replace(/\s+/g, '_');
    
    document.title = `CV_${nombreLimpio}_Programador`;
    
    // Ejecutar impresión
    window.print();
    
    // Restaurar título original
    setTimeout(() => {
        document.title = tituloOriginal;
    }, 1000);
}

/**
 * 4. Simulación del Formulario de Contacto
 * Valida y simula el envío del formulario con animaciones de éxito.
 */
function enviarMensajeSimulado(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form.querySelector('.form-submit-btn');
    
    // Deshabilitar botón durante el proceso
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';
    
    // Simular retraso de red (1.5 segundos)
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensaje';
        
        // Mostrar mensaje de éxito
        feedback.classList.remove('hidden');
        feedback.classList.add('success');
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Mensaje enviado con éxito! Me pondré en contacto contigo a la brevedad.';
        
        // Limpiar el formulario
        form.reset();
        
        // Ocultar feedback después de 5 segundos
        setTimeout(() => {
            feedback.classList.add('hidden');
            feedback.classList.remove('success');
            feedback.innerHTML = '';
        }, 5000);
        
    }, 1500);
}
