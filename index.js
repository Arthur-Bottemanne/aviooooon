const astronomyForm = document.getElementById('astronomy-form');
const errorMessageDisplay = document.getElementById('message-error');
const successMessageDisplay = document.getElementById('message-success');

astronomyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const latitudeValue = parseFloat(document.getElementById('latitude').value);
    const longitudeValue = parseFloat(document.getElementById('longitude').value);
    const altitudeValue = parseFloat(document.getElementById('altitude').value);
    const dateValue = document.getElementById('date').value;

    errorMessageDisplay.innerText = "";
    successMessageDisplay.innerText = "";


    if (latitudeValue < -90 || latitudeValue > 90) {
        errorMessageDisplay.innerText = "Erreur : La latitude doit être entre -90 et 90.";
        return;
    }

    if (longitudeValue < -180 || longitudeValue > 180) {
        errorMessageDisplay.innerText = "Erreur : La longitude doit être entre -180 et 180.";
        return;
    }

    const latitude = latitudeValue;
    const longitude = longitudeValue;
    const altitude = altitudeValue;
    const date = dateValue;


    console.log("Données enregistrées :", { latitude, longitude, altitude, date });
    successMessageDisplay.innerText = "Succès ! Les coordonnées sont valides.";
});