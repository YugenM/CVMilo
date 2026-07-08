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
 * 4. Envío del Formulario de Contacto (Web3Forms API)
 * Envía la información real a tu correo electrónico de forma asíncrona.
 */
function enviarMensaje(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = form.querySelector('.form-submit-btn');
    
    // Capturar datos del formulario
    const formData = new FormData(form);
    
    // Verificar si el usuario ha configurado la API Key
    const accessKey = formData.get('access_key');
    if (accessKey === 'TU_ACCESS_KEY_AQUI' || accessKey.trim() === '') {
        feedback.classList.remove('hidden');
        feedback.style.background = 'rgba(239, 68, 68, 0.15)';
        feedback.style.border = '1px solid #ef4444';
        feedback.style.color = '#f87171';
        feedback.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Por favor, configura tu <strong>access_key</strong> gratuita de Web3Forms en el archivo <code>index.html</code>.';
        return;
    }
    
    // Deshabilitar botón durante el envío
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';
    
    // Convertir datos a JSON
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
    
    // Enviar a la API de Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let res = await response.json();
        if (response.status === 200) {
            // Éxito al enviar
            feedback.classList.remove('hidden');
            feedback.removeAttribute('style'); // Remover estilos de error temporales
            feedback.classList.add('success');
            feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> ¡Mensaje enviado con éxito! Te llegará una notificación a tu correo y te contactaré pronto.';
            form.reset();
        } else {
            // Error devuelto por la API
            throw new Error(res.message || 'Error del servidor');
        }
    })
    .catch(error => {
        console.error('Error al enviar:', error);
        feedback.classList.remove('hidden');
        feedback.style.background = 'rgba(239, 68, 68, 0.15)';
        feedback.style.border = '1px solid #ef4444';
        feedback.style.color = '#f87171';
        feedback.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Hubo un problema al enviar: ${error.message}. Inténtalo de nuevo.`;
    })
    .finally(() => {
        // Reactivar botón
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar Mensaje';
        
        // Limpiar el estado después de 7 segundos
        setTimeout(() => {
            feedback.classList.add('hidden');
            feedback.removeAttribute('style');
            feedback.classList.remove('success');
            feedback.innerHTML = '';
        }, 7000);
    });
}
