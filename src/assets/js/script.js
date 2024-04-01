const games = document.querySelectorAll(".game");

games.forEach((game) => {
  game.addEventListener("click", (e) => {
    window.electronAPI.setTitle(e.target.dataset.game);
  });
});
