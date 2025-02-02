const fetchUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSdRyrWjjqk2gYGcmXWkyYvD-7AZ4pFse27WLBTs7vTxFZPifwm0lB6ZdsWEy1uM9pgDaL0PbIIX1W/pub?gid=2105850887&single=true&output=csv';


const formatPrices = (csvData) => {
    // Separamos las filas y eliminamos líneas vacías
    const rows = csvData.split('\n').filter(row => row.trim() !== '');

    // La primera fila se utiliza para los encabezados
    const headers = rows[0].split(',').map(header => header.trim());

    // Procesamos cada fila (omitiendo la de los encabezados)
    const jsonData = rows.slice(1).map(row => {
        // Separamos cada valor de la fila
        const values = row.split(',').map(value => value.trim());

        // Creamos un objeto asignando cada valor a su encabezado correspondiente
        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index] !== undefined ? values[index] : null;
        });
        return entry;
    });

    return jsonData;
};


const createTable = (pricesJson) => {
    const tbody = document.getElementById('tableBody');

    // Limpia cualquier contenido previo en el tbody
    tbody.innerHTML = '';

    // Si no hay datos, se puede mostrar un mensaje o simplemente salir
    if (!pricesJson.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">No se encontraron datos</td>
            </tr>
        `;
        return;
    }

    // Recorremos cada objeto del arreglo para crear las filas
    pricesJson.forEach(item => {
        const tr = document.createElement('tr');
        // Por cada propiedad del objeto, se crea una celda (td)
        Object.keys(item).forEach(key => {
            const td = document.createElement('td');
            td.textContent = item[key] || '';
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
};

/**
 * Realiza la petición para obtener el CSV, lo convierte a JSON y crea la tabla.
 */
const fetchPrices = () => {
    fetch(fetchUrl)
        .then(response => response.text())
        .then(csvData => {
            console.log('CSV Data:', csvData);
            const pricesJSON = formatPrices(csvData);
            console.log('Prices JSON:', pricesJSON);
            createTable(pricesJSON);
        })
        .catch(err => console.error('Error fetching data:', err));
};

fetchPrices();
