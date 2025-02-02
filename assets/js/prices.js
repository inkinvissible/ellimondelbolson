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
    tbody.innerHTML = '';

    if (!pricesJson.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">No se encontraron datos</td>
            </tr>
        `;
        return;
    }

    pricesJson.forEach(item => {
        const tr = document.createElement('tr');

        // 1. Columna Tarifa
        const tdTarifa = document.createElement('td');
        tdTarifa.setAttribute('data-label', 'Tarifa');
        const originalPrice = parseFloat(item.tarifa) || 0;
        const discount = parseFloat(item.descuento) || 0;
        if (discount > 0) {
            const discountedPrice = originalPrice - discount;
            tdTarifa.innerHTML = `<del style="color:red;">$${originalPrice.toFixed(2)}</del> $${discountedPrice.toFixed(2)}`;
        } else {
            tdTarifa.textContent = `$${originalPrice.toFixed(2)}`;
        }
        tr.appendChild(tdTarifa);

        // 2. Columna Pasajeros
        const tdPax = document.createElement('td');
        tdPax.setAttribute('data-label', 'Pasajeros');
        tdPax.textContent = item.pax || '';
        tr.appendChild(tdPax);

        // 3. Columna Días
        const tdDias = document.createElement('td');
        tdDias.setAttribute('data-label', 'Días');
        tdDias.textContent = item.dias || '';
        tr.appendChild(tdDias);

        // 4. Columna Válido hasta
        const tdValido = document.createElement('td');
        tdValido.setAttribute('data-label', 'Válido hasta');
        tdValido.textContent = item.valido || '';
        tr.appendChild(tdValido);

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
