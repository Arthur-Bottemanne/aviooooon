const myForm = document.getElementById('astronomy-form');
const msgError = document.getElementById('message-erreur');
const msgSucces = document.getElementById('message-succes');

myForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const lat = parseFloat(document.getElementById('lat').value);
    const lon = parseFloat(document.getElementById('lon').value);
    const alt = parseFloat(document.getElementById('alt').value);
    const date = document.getElementById('date').value;

    msgError.innerText = "";
    msgSucces.innerText = "";


    if (lat < -90 || lat > 90) {
        msgError.innerText = "Erreur : La latitude doit être entre -90 et 90.";
        return;
    }

    if (lon < -180 || lon > 180) {
        msgError.innerText = "Erreur : La longitude doit être entre -180 et 180.";
        return;
    }


    console.log("Données enregistrées :", { lat, lon, alt, date });
    msgSucces.innerText = "Succès ! Les coordonnées sont valides.";
});