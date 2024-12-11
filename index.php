<input type="text" id="uri" placeholder="Gib eine URL ein">
<button id="submit">Generate Code</button>

<div id="output-container" style="margin-top: 20px; display: none;">
  <div id="output" style="
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    white-space: pre-wrap;
    position: relative;
  ">
    <code></code>
    <button id="copy-btn" style="
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    ">Copy</button>
  </div>
</div>

<script>
  let getUri = document.querySelector("#uri");
  let button = document.querySelector("#submit");
  let outputContainer = document.querySelector("#output-container");
  let outputCode = document.querySelector("#output code");
  let copyButton = document.querySelector("#copy-btn");

  button.addEventListener("click", function () {
    if (getUri.value.trim() === "") {
      alert("Bitte eine gültige URL eingeben.");
      return;
    }

    // Erstelle den HTML-Code
    let linkHtml = `<a href="${getUri.value}" target="_blank">${getUri.value}</a>`;
    
    // Zeige den Code im Container an
    outputContainer.style.display = "block";
    outputCode.textContent = linkHtml;
  });

  // Copy-to-Clipboard Funktion
  copyButton.addEventListener("click", function () {
    let textToCopy = outputCode.textContent;

    // Text in die Zwischenablage kopieren
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        alert("Code wurde kopiert!");
      },
      (err) => {
        alert("Fehler beim Kopieren: " + err);
      }
    );
  });
</script>
