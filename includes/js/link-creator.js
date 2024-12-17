let getUri = document.querySelector("#uri");
let getTitle = document.querySelector("#title");
let linkType = document.querySelector("#link-type");
let button = document.querySelector("#submit");
let outputContainer = document.querySelector(
  "#output-container"
);
let outputCode = document.querySelector("#output code");
let copyButton = document.querySelector("#copy-btn");

// Fehlerbox-Container
const errorContainer = document.querySelector(
  "#error-container"
);

// Funktion zum Anzeigen von Fehlermeldungen
function showError(message, duration = 3000) {
  // Erstelle die Fehlerbox
  const errorBox = document.createElement("div");
  errorBox.classList.add("error-message");
  errorBox.textContent = message;

  // Füge die Fehlermeldung zum Container hinzu
  errorContainer.appendChild(errorBox);

  // Fehlerbox nach x Sekunden ausblenden
  setTimeout(() => {
    errorBox.classList.add("fade-out");
    // Entferne das Element nach der Animation
    setTimeout(() => errorBox.remove(), 500);
  }, duration);
}

button.addEventListener("click", function () {
  let uriValue = getUri.value.trim();
  let titleOrWordValue = getTitle.value.trim();
  let selectedType = linkType.value;

  if (uriValue === "") {
    showError("Bitte eine gültige URL eingeben.");
    return;
  }

  let linkHtml = "";

  if (selectedType === "flickr") {
    if (titleOrWordValue === "") {
      titleOrWordValue = uriValue;
    }
    linkHtml = `<a href="${uriValue}" target="_blank">${titleOrWordValue}</a>`;
  } else if (selectedType === "secondlife") {
    if (titleOrWordValue === "") {
      titleOrWordValue = uriValue;
    }
    linkHtml = `[${uriValue} ${titleOrWordValue}]`;
  }

  // Zeige den generierten Code an
  outputContainer.style.display = "block";
  outputCode.textContent = linkHtml;
});

copyButton.addEventListener("click", function () {
  let textToCopy = outputCode.textContent;

  navigator.clipboard.writeText(textToCopy).then(
    () => {
      showError("Code wurde kopiert!", 2000); // Zeige Erfolgsmeldung
    },
    (err) => {
      showError("Fehler beim Kopieren: " + err);
    }
  );
});
