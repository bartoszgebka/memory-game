const grid = document.querySelector(".grid");

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) {
    card.classList.toggle("flip");
  }
});