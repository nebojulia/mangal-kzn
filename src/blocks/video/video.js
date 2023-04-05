import ready from "../../js/utils/documentReady.js";

ready(function () {
  const video = document.querySelector("[data-youtube]");
  const id = new URL(video.href).searchParams.get("v");
  video.setAttribute("role", "button");

  video.addEventListener("click", function (event) {
    event.preventDefault();

    video.innerHTML = `<iframe class="video__container" src="https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0&showinfo=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen" allowfullscreen></iframe>`;
  });
});
