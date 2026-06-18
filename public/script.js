async function comprar() {

    const response = await fetch("/crear-pago", {
        method: "POST"
    });

    const data = await response.json();

    if(data.success){
        window.location.href = data.url;
    } else {
        alert("Error al crear el pago");
    }

}