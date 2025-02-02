const getPromosUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSdRyrWjjqk2gYGcmXWkyYvD-7AZ4pFse27WLBTs7vTxFZPifwm0lB6ZdsWEy1uM9pgDaL0PbIIX1W/pub?gid=0&single=true&output=csv'

fetch(getPromosUrl)
    .then(response => response.text())
    .then(data => {
        // Split CSV en filas
        const rows = data.split('\n');
        
        // Obtener encabezados de la primera fila
        const headers = rows[0].split(',').map(header => header.trim());
        
        // Función para parsear una línea CSV respetando comillas
        const parseCSVLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let char of line) {
                if (char === '"' ) {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current);
            return result;
        };
        
        // Convertir filas restantes a array de objetos
        const jsonData = rows.slice(1).map(row => {
            const values = parseCSVLine(row).map(value => value.trim().replace(/^"|"$/g, ''));
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});
        });

        console.log(JSON.stringify(jsonData, null, 2));
        const promosContainer = document.getElementById('promos');
console.log('Promos container:', promosContainer);

jsonData.forEach((promo, index) => {
    console.log(`Creando card para promo ${index + 1}:`, promo);

    // Crear elementos
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-6';

    const singleBlogDiv = document.createElement('div');
    singleBlogDiv.className = 'single_blog mt-30';

    const blogContentDiv = document.createElement('div');
    blogContentDiv.className = 'blog_content';

    const title = document.createElement('h4');
    title.className = 'blog_title';
    console.log('Título:', promo.titulo);
    title.textContent = promo.titulo || 'Título por defecto';

    const paragraph = document.createElement('p');
    console.log('Descripción:', promo.descripcion);
    paragraph.textContent = promo.descripcion.concat(". ", `Válido hasta ${promo.valido}` ) || 'Descripción por defecto.';

    // Ensamblar la estructura
    blogContentDiv.appendChild(title);
    blogContentDiv.appendChild(paragraph);
    singleBlogDiv.appendChild(blogContentDiv);
    colDiv.appendChild(singleBlogDiv);
    promosContainer.appendChild(colDiv);

        console.log(`Card creada para promo ${index + 1}`);
    });
    })
    .catch(error => {
        console.error('Error:', error);
    });

