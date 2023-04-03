import ready from "../../js/utils/documentReady.js";
import Swiper, { Navigation, Pagination } from "swiper";

ready(function () {
  const sliders = document.querySelectorAll(".carousel");
  sliders.forEach((el) => {
    new Swiper(el, {
      modules: [Navigation, Pagination],
      loop: true,
      pagination: {
        el: ".swiper-pagination",
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
});
