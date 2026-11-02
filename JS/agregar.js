const botonesAgregar = document.querySelectorAll(".agregar");

botonesAgregar.forEach(function(boton) {

    boton.addEventListener("click", function() {

        const ventana = boton.closest(".detalle-modal");
        const nombre = ventana.querySelector("h2").textContent;
        const precioTexto = ventana.querySelector(".precio").textContent;  
        const precio = parseInt(precioTexto.replace("₡", "").replaceAll(".", ""));   
        const imagen = ventana.querySelector(".imagen-modal img").getAttribute("src");

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        let productoExistente = null;

        carrito.forEach(function(producto) {

            if (producto.nombre === nombre) {
                productoExistente = producto;
            }

        });

        if (productoExistente) {

            productoExistente.cantidad++;

        } else {

            carrito.push({
                nombre: nombre,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));

        boton.textContent = "¡Agregado!";
        setTimeout(function() {
            boton.textContent = "Agregar";
        }, 1200);
    });

});