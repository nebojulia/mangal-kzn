import ready from "../../js/utils/documentReady.js";

ready(function () {
  function clickHandler(event) {
    // Get the video link
    let link = event.target.closest("[data-youtube], [data-youtube-reviews]");
    if (!link) return;
    // Prevent the URL from redirecting users
    event.preventDefault();
    // Get the video ID
    let id = link.getAttribute("data-youtube");
    // Create the player
    let player = document.createElement("div");
    player.innerHTML = `<iframe class="video__container" src="https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0&showinfo=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen" allowfullscreen></iframe>`;
    // Inject the player into the UI
    link.replaceWith(player);
  }

  // Detect clicks on the video thumbnails
  document.addEventListener("click", clickHandler);

  let video = document.querySelector("[data-youtube]");

  // Get the video ID
  let id = new URL(video.href).searchParams.get("v");
  // Add the ID to the data-youtube attribute
  video.setAttribute("data-youtube", id);
  // Add a role of button
  video.setAttribute("role", "button");
  // Add a thumbnail
});
