const formulario = document.getElementById('crudForm');
const inputProducto = document.getElementById('product');
const inputCantidad = document.getElementById('quantity');
const inputPrecio = document.getElementById('price');
const cuerpoTabla = document.getElementById('itemList').getElementsByTagName('tbody')[0];

function cargarItems() {
    const items = JSON.parse(localStorage.getItem('items')) || [];
    cuerpoTabla.innerHTML = '';
    let totalCantidad = 0;
    let totalPrecio = 0;
    const productos = [];
    const cantidades = [];

    items.forEach((item) => {
        const estadoStock = obtenerEstadoStock(item.quantity);
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.id}</td>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${parseFloat(item.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</td>
            <td class="${obtenerClaseStock(item.quantity)}">${estadoStock}</td>
            <td>
                <button class="btn-editar" onclick="editarItem(${item.id})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarItem(${item.id})">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);

        //Sumar cantidad y precio
        totalCantidad += parseInt(item.quantity);
        totalPrecio += parseFloat(item.price);

        // Agregar producto y cantidad grafica
        productos.push(item.product);
        cantidades.push(parseInt(item.quantity));
    });

    //totales tabla
    document.getElementById('totalCantidad').innerText = totalCantidad;
    document.getElementById('totalPrecio').innerText = parseFloat(totalPrecio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

    //Llamar gráfica
    crearGrafica(productos, cantidades);
}

//crear grafica
function crearGrafica(productos, cantidades) {
    const ctx = document.getElementById('graficaCantidad').getContext('2d');
    new Chart(ctx, {
        type: 'pie', 
        data: {
            labels: productos,
            datasets: [{
                label: 'Cantidad de Productos',
                data: cantidades,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                        }
                    }
                }
            }
        }
    });
}

//estado stock
function obtenerEstadoStock(cantidad) {
    if (cantidad < 100) {
        return 'Bajo Stock';
    } else if (cantidad >= 100 && cantidad <= 300) {
        return 'Medio Stock';
    } else {
        return 'Mucho Stock';
    }
}

//clase stock
function obtenerClaseStock(cantidad) {
    if (cantidad < 100) {
        return 'bajostock';
    } else if (cantidad >= 100 && cantidad <= 300) {
        return 'mediostock';
    } else {
        return 'altostock';
    }
}

//agregar
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const producto = inputProducto.value;
    const cantidad = inputCantidad.value;
    const precio = inputPrecio.value;

    const items = JSON.parse(localStorage.getItem('items')) || [];
    const nuevoId = items.length ? items[items.length - 1].id + 1 : 1;
    items.push({ id: nuevoId, product: producto, quantity: cantidad, price: precio });
    localStorage.setItem('items', JSON.stringify(items));

    //Limpiar
    inputProducto.value = '';
    inputCantidad.value = '';
    inputPrecio.value = '';

    cargarItems();
});

//editar
function editarItem(id) {
    const items = JSON.parse(localStorage.getItem('items'));
    const indiceItem = items.findIndex(item => item.id === id);
    const item = items[indiceItem];
    
    const nuevoProducto = prompt('Editar producto:', item.product);
    const nuevaCantidad = prompt('Editar cantidad:', item.quantity);
    const nuevoPrecio = prompt('Editar precio:', item.price);

    if (nuevoProducto && nuevaCantidad && nuevoPrecio) {
        items[indiceItem] = { id: item.id, product: nuevoProducto, quantity: nuevaCantidad, price: nuevoPrecio };
        localStorage.setItem('items', JSON.stringify(items));
        cargarItems();
    }
}

// eliminar
function eliminarItem(id) {
    const items = JSON.parse(localStorage.getItem('items'));
    const nuevosItems = items.filter(item => item.id !== id);
    localStorage.setItem('items', JSON.stringify(nuevosItems));
    cargarItems();
}


document.addEventListener('DOMContentLoaded', () => {
    cargarItems(); 

    const btnEliminarTodo = document.getElementById('btnEliminarTodo');
    btnEliminarTodo.addEventListener('click', eliminarTodo); 
});


function eliminarTodo() {
    localStorage.removeItem('items');
    cargarItems();
}
