const myForm = document.getElementById('astronomy-form');
const msgError = document.getElementById('message-error');
const msgSuccess = document.getElementById('message-success');

myForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const latValue = parseFloat(document.getElementById('lat').value);
    const lonValue = parseFloat(document.getElementById('lon').value);
    const altValue = parseFloat(document.getElementById('alt').value);
    const dateValue = document.getElementById('date').value;

    msgError.innerText = "";
    msgSuccess.innerText = "";


    if (latValue < -90 || latValue > 90) {
        msgError.innerText = "Erreur : La latitude doit être entre -90 et 90.";
        return;
    }

    if (lonValue < -180 || lonValue > 180) {
        msgError.innerText = "Erreur : La longitude doit être entre -180 et 180.";
        return;
    }

    const lat = latValue;
    const lon = lonValue;
    const alt = altValue;
    const date = dateValue;


    console.log("Données enregistrées :", { lat, lon, alt, date });
    msgSuccess.innerText = "Succès ! Les coordonnées sont valides.";
});