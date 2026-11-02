
const envio_gratis = 25000;

const nombresPago = {
    sinpe: "SINPE Móvil",
    tarjeta: "Tarjeta de crédito o débito",
    efectivo: "Efectivo"
};

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const formulario = document.getElementById("formCompra");
const listaCarrito = document.getElementById("listaCarrito");
const carritoVacio = document.getElementById("carritoVacio");
const confirmacion = document.getElementById("confirmacion");
const resultado = document.getElementById("resultadoCompra");
const resumenSubtotal = document.getElementById("resumenSubtotal");
const resumenEnvio = document.getElementById("resumenEnvio");
const resumenTotal = document.getElementById("resumenTotal");
const provincia = document.getElementById("provincia");
const datosDomicilio = document.getElementById("datosDomicilio");

function formatoColones(monto) {
    return "₡" + monto.toLocaleString("es-CR");
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function opcionMarcada(nombreGrupo) {
    return document.querySelector('input[name="' + nombreGrupo + '"]:checked').value;
}

function mostrarCarrito() {

    if (carrito.length == 0) {

        carritoVacio.classList.remove("oculto");
        formulario.classList.add("oculto");

        return;
    }

    carritoVacio.classList.add("oculto");
    formulario.classList.remove("oculto");

    listaCarrito.innerHTML = "";
    carrito.forEach(function(producto, indice) {

        const subtotal = producto.precio * producto.cantidad;

        listaCarrito.innerHTML += `
            <div class="item-carrito">
                <img src="${producto.imagen}" alt="${producto.nombre}">

                <div class="info-item">
                    <strong>${producto.nombre}</strong>
                    <small>${formatoColones(producto.precio)} c/u</small>
                </div>

                <div class="cantidad">
                    <button type="button" class="btn-cantidad"
                            onclick="cambiarCantidad(${indice}, -1)">−</button>
                    <span>${producto.cantidad}</span>
                    <button type="button" class="btn-cantidad"
                            onclick="cambiarCantidad(${indice}, 1)">+</button>
                </div>

                <span class="precio subtotal-item">${formatoColones(subtotal)}</span>

                <button type="button" class="btn-eliminar"
                        onclick="eliminarProducto(${indice})">Eliminar</button>
            </div>
        `;
    });

    actualizarResumen();
}

function cambiarCantidad(indice, cambio) {

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }

    guardarCarrito();
    mostrarCarrito();
}

function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    guardarCarrito();
    mostrarCarrito();
}


function calcularSubtotal() {

    let subtotal = 0;

    carrito.forEach(function(producto) {
        subtotal += producto.precio * producto.cantidad;
    });

    return subtotal;
}

function calcularEnvio() {

    if (opcionMarcada("entrega") == "retiro") {
        return 0;
    }

    if (calcularSubtotal() >= envio_gratis) {
        return 0;
    }

    if (provincia.value == "") {
        return null;
    }

    if (provincia.value == "san-jose" ||
        provincia.value == "alajuela" ||
        provincia.value == "cartago" ||
        provincia.value == "heredia") {

        return 2000;
    }

    return 3500;
}

function actualizarResumen() {

    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();

    let total = subtotal;

    resumenSubtotal.textContent = formatoColones(subtotal);

    if (envio == null) {

        resumenEnvio.textContent = "Elija provincia";

    } else if (envio == 0) {

        resumenEnvio.textContent = "Gratis";

    } else {

        resumenEnvio.textContent = formatoColones(envio);

        total = subtotal + envio;
    }

    resumenTotal.textContent = formatoColones(total);
}

function cambiarEntrega() {

    if (opcionMarcada("entrega") == "retiro") {
        datosDomicilio.classList.add("oculto");
    } else {
        datosDomicilio.classList.remove("oculto");
    }
    
    actualizarResumen();
}

document.querySelectorAll('input[name="entrega"]').forEach(function(opcion) {
    opcion.addEventListener("change", cambiarEntrega);
});

provincia.addEventListener("change", actualizarResumen);


function cambiarPago() {

    document.querySelectorAll(".info-pago").forEach(function(info) {
        info.classList.add("oculto");
    });

    const metodo = opcionMarcada("pago");

    document.getElementById("info-" + metodo).classList.remove("oculto");
}

document.querySelectorAll('input[name="pago"]').forEach(function(opcion) {
    opcion.addEventListener("change", cambiarPago);
});

function validarTarjeta() {

    const titular = document.getElementById("titular").value.trim();
    const numero = document.getElementById("numeroTarjeta").value.replaceAll(" ", "");
    const vencimiento = document.getElementById("vencimiento").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (titular == "" || numero == "" || vencimiento == "" || cvv == "") {
        return "Complete todos los datos de la tarjeta.";
    }

    if (numero.length !== 16 || isNaN(numero)) {
        return "El número de tarjeta debe tener 16 dígitos.";
    }

    if (vencimiento.length !== 5 || vencimiento.indexOf("/") !== 2) {
        return "La fecha de vencimiento debe tener el formato MM/AA.";
    }

    if (cvv.length !== 3 || isNaN(cvv)) {
        return "El CVV debe tener 3 dígitos.";
    }

    return "";
}



formulario.addEventListener("submit", function(evento) {

   
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.replaceAll(" ", "").replaceAll("-", "");
    const correo = document.getElementById("correo").value.trim();
    const canton = document.getElementById("canton").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const entrega = opcionMarcada("entrega");
    const pago = opcionMarcada("pago");

    let error = "";

    if (nombre == "" || telefono == "" || correo == "") {
        error = "Complete su nombre, teléfono y correo.";

    } else if (telefono.length !== 8 || isNaN(telefono)) {

        error = "El teléfono debe tener 8 dígitos.";

    } else if (correo.indexOf("@") == -1 ||
               correo.indexOf(".") == -1) {

        error = "Ingrese un correo electrónico válido.";

    } else if (entrega == "domicilio" &&
               (provincia.value == "" || canton == "" || direccion == "")) {

        error = "Complete la provincia, el cantón y la dirección de entrega.";

    } else if (pago == "tarjeta") {

        error = validarTarjeta();
    }

    if (error !== "") {

        resultado.textContent = error;

        resultado.className = "mensaje-error";

        return;
    }

    confirmarPedido();
});


function confirmarPedido() {

    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();
    const total = subtotal + envio;
    const numeroPedido = "ORD-" + Date.now().toString().slice(-6);
    const fecha = new Date().toLocaleDateString("es-CR");
    const pago = opcionMarcada("pago");

    let textoEntrega = "Retiro en Tarrazú";

    if (opcionMarcada("entrega") == "domicilio") {

        const canton = document.getElementById("canton").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const nombreProvincia = provincia.options[provincia.selectedIndex].text;
        textoEntrega = "Envío a domicilio: " + direccion + ", " + canton + ", " + nombreProvincia;
    }

    let textoEnvio = "Gratis";

    if (envio > 0) {
        textoEnvio = formatoColones(envio);
    }

    let listaProductos = "";

    carrito.forEach(function(producto) {
        listaProductos += `
            <li>
                <span>${producto.cantidad} x ${producto.nombre}</span>
                <span>${formatoColones(producto.precio * producto.cantidad)}</span>
            </li>
        `;
    });

    document.getElementById("confNumero").textContent = numeroPedido;

    document.getElementById("detalleConfirmacion").innerHTML = `
        <ul class="lista-confirmacion">${listaProductos}</ul>
        <p><strong>Fecha:</strong> ${fecha}</p>
        <p><strong>Entrega:</strong> ${textoEntrega}</p>
        <p><strong>Pago:</strong> ${nombresPago[pago]}</p>
        <p><strong>Envío:</strong> ${textoEnvio}</p>
        <p class="total-confirmacion">Total: ${formatoColones(total)}</p>
    `;

    guardarEnPerfil(numeroPedido, fecha, total);

    carrito = [];

    guardarCarrito();

    formulario.classList.add("oculto");

    confirmacion.classList.remove("oculto");

    window.scrollTo(0, 0);
}

function guardarEnPerfil(numeroPedido, fecha, total) {

    const sesion = JSON.parse(localStorage.getItem("sesionActiva"));

    if (!sesion) {
        return;
    }

    const pedido = {
        id: numeroPedido,
        fecha: fecha,
        total: formatoColones(total),
        estado: "En preparación"
    };

    sesion.pedidos.push(pedido);

    localStorage.setItem("sesionActiva", JSON.stringify(sesion));

    const usuario = JSON.parse(localStorage.getItem("usuarioRegistrado"));

    if (usuario && usuario.email == sesion.email) {

        usuario.pedidos = sesion.pedidos;
        localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
    }
}


const sesionActual = JSON.parse(localStorage.getItem("sesionActiva"));

if (sesionActual) {

    document.getElementById("nombre").value = sesionActual.nombre + " " + sesionActual.apellidos;
    document.getElementById("correo").value = sesionActual.email;
}

mostrarCarrito();