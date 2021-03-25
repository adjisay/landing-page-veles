function slider() {
  // const slider = document.querySelector('.slider__container'),
  //       slides = document.querySelectorAll('.slider__slide'),
  //       prev   = document.querySelector('.slider__control--prev'),
  //       next   = document.querySelector('.slider__control--next'),
  //       slidesWrapper = document.querySelector('.slider__gallery'),
  //       width = window.getComputedStyle(slidesWrapper).width;

  // let slideIndex = 1;
  // let offset = 0;

  // slides.forEach(slide => {
  //   slide.style.width = width;
  // });
  
  // next.addEventListener('click', () => {
  //   if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
  //     offset = 0;
  //   } else {
  //     offset += +width.slice(0, width.length - 2);
  //   }

  //   slider.style.transform = `translateX(-${offset}px)`;
  // });

  // prev.addEventListener('click', () => {
  //   if (offset == 0) {
  //     offset = +width.slice(0, width.length - 2) * (slides.length - 1);
  //   } else {
  //     offset -= +width.slice(0, width.length - 2);
  //   }

  //   slider.style.transform = `translateX(-${offset}px)`;
  // });
}

export default slider;