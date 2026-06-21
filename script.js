const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  observer.observe(el);
});

const fitSlides = () => {
  const isPresentationWidth = window.matchMedia("(min-width: 901px)").matches;
  const navHeight = document.querySelector(".topbar")?.offsetHeight ?? 0;
  const availableHeight = window.innerHeight - navHeight - 8;
  const slides = document.querySelectorAll(".hero, .s-gray, .s-white, .closing");

  slides.forEach((slide) => {
    slide.classList.remove("fit-slide");
    slide.style.removeProperty("--fit-zoom");

    if (!isPresentationWidth) return;

    const slideBlocks = [...slide.children].filter((child) =>
      child.matches(".wrap, .diag-outer")
    );
    const contentHeight = slideBlocks.reduce(
      (height, block) => height + block.getBoundingClientRect().height,
      0
    );
    const slideStyle = window.getComputedStyle(slide);
    const verticalPadding =
      parseFloat(slideStyle.paddingTop) + parseFloat(slideStyle.paddingBottom);
    const neededHeight = contentHeight + verticalPadding;

    if (neededHeight <= availableHeight) return;

    const zoom = Math.max(0.78, Math.min(1, availableHeight / neededHeight));
    slide.classList.add("fit-slide");
    slide.style.setProperty("--fit-zoom", zoom.toFixed(3));
  });
};

window.addEventListener("load", fitSlides);
window.addEventListener("resize", fitSlides);
