document.addEventListener("DOMContentLoaded", () => {
  const embla__sliders = document.querySelectorAll(".embla");
  embla__sliders.forEach((embla__slider) => {
    let slidesToScroll__mobile = embla__slider.getAttribute("slides-mobile") || 1;
    let slidesToScroll__tab = embla__slider.getAttribute("slides-tab") || 1;
    let slidesToScroll__desk = embla__slider.getAttribute("slides-desk") || 1;
    let mobile__only = embla__slider.getAttribute("mobile-only") || 0;
    let embla__loop = embla__slider.hasAttribute("embla-loop");

    let options = {};
    if (mobile__only == 1) {
      options = {
        loop: false,
        slidesToScroll: slidesToScroll__mobile,
        containScroll: "trimSnaps",
        breakpoints: {
          "(min-width: 768px)": { loop: true, slidesToScroll: slidesToScroll__tab },
          "(min-width: 1080px)": { loop: true, slidesToScroll: slidesToScroll__desk, active: false }
        }
      };
    } else {
      options = {
        loop: embla__loop,
        align: "start",
        containScroll: "trimSnaps",
        slidesToScroll: slidesToScroll__mobile,
        breakpoints: {
          "(min-width: 768px)": { loop: embla__loop, slidesToScroll: slidesToScroll__tab },
          "(min-width: 1080px)": { loop: embla__loop, slidesToScroll: slidesToScroll__desk }
        }
      };
    }

    const viewportNode = embla__slider.querySelector(".embla__viewport");
    const prevButtonNode = embla__slider.querySelector(".embla__arrow--prev");
    const nextButtonNode = embla__slider.querySelector(".embla__arrow--next");
    const dotsNode = embla__slider.querySelector(".embla__dots");

    const emblaApi = EmblaCarousel(viewportNode, options);

    // Next/Prev button click handlers
    if (prevButtonNode) {
      prevButtonNode.addEventListener("click", emblaApi.scrollPrev, false);
    }
    if (nextButtonNode) {
      nextButtonNode.addEventListener("click", emblaApi.scrollNext, false);
    }

    // Next/Prev button disable toggle + is-disabled class
    const toggleArrowButtonsState = () => {
      if (prevButtonNode) {
        const canScrollPrev = emblaApi.canScrollPrev();
        prevButtonNode.disabled = !canScrollPrev;
        prevButtonNode.classList.toggle("is-disabled", !canScrollPrev);
      }
      if (nextButtonNode) {
        const canScrollNext = emblaApi.canScrollNext();
        nextButtonNode.disabled = !canScrollNext;
        nextButtonNode.classList.toggle("is-disabled", !canScrollNext);
      }
    };

    // Dots variables & functions
    let dotNodes = [];

    const addDotBtnsWithClickHandlers = () => {
      if (!dotsNode) return false;

      const snapCount = emblaApi.scrollSnapList().length;

      // Only show dots if there's more than 1 page
      if (snapCount <= 1) {
        dotsNode.innerHTML = "";
        return;
      }

      dotsNode.innerHTML = emblaApi
        .scrollSnapList()
        .map(() => '<button class="embla__dot" type="button"></button>')
        .join("");

      const scrollTo = (index) => {
        emblaApi.scrollTo(index);
      };

      dotNodes = Array.from(dotsNode.querySelectorAll(".embla__dot"));
      dotNodes.forEach((dotNode, index) => {
        dotNode.addEventListener("click", () => scrollTo(index), false);
      });
    };

    const toggleDotBtnsActive = () => {
      if (!dotsNode || dotNodes.length === 0) return;

      const previous = emblaApi.previousScrollSnap();
      const selected = emblaApi.selectedScrollSnap();

      if (dotNodes[previous]) {
        dotNodes[previous].classList.remove("embla__dot--selected");
      }
      if (dotNodes[selected]) {
        dotNodes[selected].classList.add("embla__dot--selected");
      }
    };

    // Register Embla events
    emblaApi
      .on("init", toggleArrowButtonsState)
      .on("select", toggleArrowButtonsState)
      .on("reInit", toggleArrowButtonsState)
      .on("init", addDotBtnsWithClickHandlers)
      .on("reInit", addDotBtnsWithClickHandlers)
      .on("init", toggleDotBtnsActive)
      .on("reInit", toggleDotBtnsActive)
      .on("select", toggleDotBtnsActive);
  });
});