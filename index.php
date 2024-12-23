<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="includes/style/style.css">
  <link rel="stylesheet" href="includes/style/bootstrap.min.css">
  <link rel="stylesheet" href="includes/style/fontawesome.min.css">

  <title>Link Gen for FlickR and SL-Profile</title>
</head>
<body>
<div class="container d-flex flex-column justify-content-center align-items-center vh-100 text-center">
    <h1 class="mb-4">Link Generator</h1>
    
    <!-- Eingabefeld für Link -->
    <div class="mb-3 w-100" style="max-width: 500px;">
      <input type="text" id="uri" class="form-control" placeholder="Gib die URL ein">
    </div>

    <!-- Eingabefeld für Titel/Word -->
    <div class="mb-3 w-100" style="max-width: 500px;">
      <input type="text" id="title" class="form-control" placeholder="Gib den Titel oder das Word ein">
    </div>

    <!-- Dropdown-Menü für Link-Typ -->
    <div class="mb-3 w-100" style="max-width: 500px;">
      <select id="link-type" class="form-select">
        <option value="flickr">FlickR</option>
        <option value="secondlife">Second Life Profile Link</option>
      </select>
    </div>

    <!-- Button -->
    <button id="submit" class="btn btn-primary mb-4">
      <i class="fas fa-link"></i> Generate Code
    </button>

    <!-- Error Container -->
     <div id="error-container" ></div>

    <!-- Code-Container -->
    <div id="output-container" class="card shadow-sm text-start w-100" style="max-width: 500px; display: none;">
      <div class="card-body position-relative">
        <pre id="output" class="mb-0"><code></code></pre>
        <!-- Kopier-Button -->
        <button id="copy-btn" class="btn btn-sm btn-secondary position-absolute" style="top: 10px; right: 10px;">
          <i class="fas fa-copy"></i> Copy
        </button>
      </div>
    </div>
    <!-- Footer -->
<footer class="text-center py-3 mt-5">
  <div class="container">
    <p class="mb-0">
      <span id="copyright">&copy; 2024</span> | Made by 
      <a href="https://tmlr.eu" class="text-decoration-none" target="_blank" rel="noreferrer">
      TMLR
      </a>
    </p>
  </div>
</footer>
  </div>



<script src="includes/js/bootstrap.min.js"></script>
<script src="includes/js/link-creator.js"></script>
<script src="includes/js/copyright.js"></script>



</body>
</html>