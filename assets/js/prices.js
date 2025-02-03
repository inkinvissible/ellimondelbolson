// URL del CSV de la hoja de cálculo
const fetchUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSdRyrWjjqk2gYGcmXWkyYvD-7AZ4pFse27WLBTs7vTxFZPifwm0lB6ZdsWEy1uM9pgDaL0PbIIX1W/pub?gid=2105850887&single=true&output=csv';

// Variable global donde se almacenarán los datos del CSV
let pricesData = [];
// Variable global para almacenar los datos de la reserva (para usarlos al reservar)
let reservationData = {};

/**
 * Función para formatear los datos CSV en un arreglo JSON.
 */
const formatPrices = (csvData) => {
    const rows = csvData.split('\n').filter(row => row.trim() !== '');
    const headers = rows[0].split(',').map(header => header.trim());
    const jsonData = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index] !== undefined ? values[index] : null;
        });
        return entry;
    });
    return jsonData;
};

/**
 * Función que dado el texto del rango ("dias") y la cantidad de noches, determina si la estadía califica.
 * Ejemplo: "1-3" significa de 1 a 3 noches, "7 o más" significa 7 o más noches.
 */
const isInRange = (diasText, noches) => {
    if (diasText.includes('-')) {
        const [min, max] = diasText.split('-').map(num => parseInt(num, 10));
        return noches >= min && noches <= max;
    } else if (diasText.toLowerCase().includes('o más')) {
        // Asumimos que el número indicado es el mínimo
        const min = parseInt(diasText, 10);
        return noches >= min;
    }
    return false;
};

/**
 * Función para obtener la tarifa correspondiente, según la cantidad de pasajeros y noches.
 */
const getPricingForStay = (pax, noches) => {
    // Filtrar por cantidad de pasajeros
    const filtered = pricesData.filter(item => parseInt(item.pax, 10) === pax);
    // Buscar el objeto que cumpla con el rango de días
    for (const item of filtered) {
        if (isInRange(item.dias, noches)) {
            return item;
        }
    }
    return null;
};

/**
 * Función para mostrar un mensaje de alerta.
 */
const showAlert = (message, type = 'danger') => {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
};

/**
 * Función para obtener el CSV, formatearlo a JSON y almacenar en pricesData.
 */
const fetchPrices = () => {
    fetch(fetchUrl)
        .then(response => response.text())
        .then(csvData => {
            console.log('CSV Data:', csvData);
            pricesData = formatPrices(csvData);
            console.log('Prices JSON:', pricesData);
        })
        .catch(err => {
            console.error('Error fetching data:', err);
            showAlert('Error al obtener los datos de precios.', 'danger');
        });
};

// Llamar a la función para obtener los datos al cargar la página
fetchPrices();

/**
 * Función auxiliar para parsear una fecha con formato "dd/mm/yyyy" a Date.
 */
const parseDateDMY = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    // Recordar que en JavaScript los meses se indexan desde 0.
    return new Date(year, month - 1, day);
};

/**
 * Evento submit del formulario para procesar los datos ingresados.
 */
document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Limpiar alertas previas
    document.getElementById('alertContainer').innerHTML = '';

    // Obtener valores del formulario
    const fechaEntrada = document.getElementById('inputFechaEntrada').value;
    const fechaSalida = document.getElementById('inputFechaSalida').value;
    const pasajeros = parseInt(document.getElementById('inputPasajeros').value, 10);

    // Validaciones básicas
    if (!fechaEntrada || !fechaSalida) {
        showAlert('Por favor, ingresa ambas fechas.');
        return;
    }
    if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
        showAlert('La fecha de entrada debe ser anterior a la fecha de salida.');
        return;
    }
    if (isNaN(pasajeros) || pasajeros < 1) {
        showAlert('La cantidad de pasajeros debe ser al menos 1.');
        return;
    }

    // Calcular la cantidad de noches (diferencia en días)
    const diffTime = Math.abs(new Date(fechaSalida) - new Date(fechaEntrada));
    const noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Buscar la tarifa correspondiente según la cantidad de pasajeros y noches
    const pricing = getPricingForStay(pasajeros, noches);
    if (!pricing) {
        showAlert('No se encontró una tarifa para la combinación de pasajeros y noches ingresadas.');
        return;
    }

    // Verificar la fecha de validez (se espera que pricing.valido tenga formato "dd/mm/yyyy")
    if (pricing.valido) {
        const validDate = parseDateDMY(pricing.valido);
        const entradaDate = new Date(fechaEntrada);
        if (entradaDate > validDate) {
            showAlert('No se pueden brindar los precios porque no han sido cargados todavía (fecha de validez vencida).');
            return;
        }
    }

    // Obtener tarifa original y descuento (si aplica)
    const tarifaOriginal = parseFloat(pricing.tarifa) || 0;
    const descuento = parseFloat(pricing.descuento) || 0;
    let tarifaDiaria = tarifaOriginal;
    let tarifaDiariaDisplay = `$${tarifaDiaria.toFixed(2)}`;
    if (descuento > 0) {
        tarifaDiaria = tarifaOriginal - descuento;
        tarifaDiariaDisplay = `<del class="text-danger">$${tarifaOriginal.toFixed(2)}</del> $${tarifaDiaria.toFixed(2)}`;
    }

    // Calcular tarifa total
    const tarifaTotal = tarifaDiaria * noches;

    // Actualizar la información en la card
    document.getElementById('noches').textContent = noches;
    document.getElementById('tarifaDiaria').innerHTML = tarifaDiariaDisplay;
    document.getElementById('tarifaTotal').textContent = `$${tarifaTotal.toFixed(2)}`;
    document.getElementById('paxDisplay').textContent = pasajeros;

    // Guardar los datos de la reserva para usarlos en el botón Reservar
    reservationData = {
        fechaEntrada,
        fechaSalida,
        pasajeros,
        noches,
        tarifaDiaria: `$${tarifaDiaria.toFixed(2)}`,
        tarifaTotal: `$${tarifaTotal.toFixed(2)}`,
        // También se guarda la fecha de validez (opcional, para uso futuro)
        valido: pricing.valido
    };

    // Mostrar el card (quitamos la clase d-none)
    document.getElementById('resultCard').classList.remove('d-none');
});

/**
 * Evento click para el botón "Reservar".
 * Al hacer click se construye el mensaje y se redirige a la API de WhatsApp.
 */
document.getElementById('reserveBtn').addEventListener('click', function(event) {
    event.preventDefault();

    // Verificar que tengamos datos de reserva
    if (!reservationData.fechaEntrada) {
        showAlert('Por favor, calcula la cotización antes de reservar.');
        return;
    }

    // Verificar nuevamente la fecha de validez (por si se cambió o recargó la página)
    if (reservationData.valido) {
        const validDate = parseDateDMY(reservationData.valido);
        const entradaDate = new Date(reservationData.fechaEntrada);
        if (entradaDate > validDate) {
            showAlert('No se pueden brindar los precios porque no han sido cargados todavía (fecha de validez vencida).');
            return;
        }
    }

    // Construir el mensaje para WhatsApp
    const message = `Hola!, estoy interesado en reservar.%0ASomos ${reservationData.pasajeros} pasajeros y queremos alojarnos en El Limón de El Bolsón. Serían ${reservationData.noches} noches, desde el ${reservationData.fechaEntrada} hasta ${reservationData.fechaSalida}.%0AEl precio por noche es de ${reservationData.tarifaDiaria} y el precio total es de ${reservationData.tarifaTotal}.`;

    const whatsappURL = `https://api.whatsapp.com/send?phone=5491159439209&text=${message}`;

    // Redirigir al usuario a WhatsApp
    window.open(whatsappURL, '_blank');
});