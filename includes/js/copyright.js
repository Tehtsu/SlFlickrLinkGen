const copyrightSpan = document.querySelector("#copyright");

const dateYear = new Date();
let year = dateYear.getFullYear();
console.log(typeof year);

if (year === 2024) {
  copyrightSpan.innerHTML = "&copy; 2024";
} else {
  copyrightSpan.innerHTML = `&copy; 2024 - ${year}`;
}
