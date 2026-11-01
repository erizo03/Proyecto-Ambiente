
// Obtener los elementos del HTML
const formulario = document.getElementById("formContacto");

const resultado = document.getElementById("resultadoContacto");

// Evento del formulario
formulario.addEventListener("submit", function(evento) {

    // Evitar que se recargue la página
    evento.preventDefault();

    // Obtener los datos
    const nombre = document.getElementById("nombre").value.trim();

    const correo = document.getElementById("correo").value.trim();

    const mensaje = document.getElementById("mensaje").value.trim();

    // Validar los campos
    if (nombre === "" || correo === "" || mensaje === "") {

        resultado.textContent = "Todos los campos son obligatorios.";

        resultado.className = "mensaje-error";

    } else if (correo.indexOf("@") === -1 ||
               correo.indexOf(".") === -1) {

        resultado.textContent = "Ingrese un correo electrónico válido.";

        resultado.className = "mensaje-error";

    } else {

        resultado.textContent =
            "Consulta validada correctamente. El envío estará disponible próximamente.";

        resultado.className = "mensaje-exito";

        // Limpiar el formulario
        formulario.reset();
    }

});
