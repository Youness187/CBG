const games = document.querySelectorAll(".game");

games.forEach((game) => {
  game.addEventListener("click", openGame, {once: true});
});

window.electronAPI.close((s) => {
  let game = document.querySelector(`img[data-game="${s}"]`);
  let scoreDiv = document.querySelector(`div[data-game="${s}"]`);
  game.classList.remove("opend");
  scoreDiv.classList.remove("opend");
  game.addEventListener("click", openGame, {once: true});
});

function openGame(e) {
  e = e.target == undefined ? e : e.target;
  let scoreDiv = document.querySelector(`div[data-game="${e.dataset.game}"]`);
  scoreDiv.classList.add("opend");
  e.classList.add("opend");
  window.electronAPI.setTitle(e.dataset.game);
}