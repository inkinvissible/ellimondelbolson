document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Obtener los valores del formulario
    let name = document.getElementById("name").value.trim();
    let message = document.getElementById("message").value.trim();

    if (!name || !message) {
        alert("Por favor, completa todos los campos antes de enviar el mensaje.");
        return;
    }

    // Número de WhatsApp al que se enviará el mensaje (cambia esto por el número deseado)
    let phoneNumber = "5492944118890"; // Reemplaza con el número correcto en formato internacional

    // Formatear el mensaje para WhatsApp
    let whatsappMessage = `Hola, mi nombre es ${name}. ${message}`;
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Redirigir a WhatsApp
    window.location.href = whatsappURL;
});
