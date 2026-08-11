(() => {
  const root = document.documentElement;
  const responsive = window.matchMedia("(max-width: 991px)");
  let frame = 0;

  const update = () => {
    frame = 0;

    if (!responsive.matches) {
      root.classList.remove("cta-scroll-end");
      return;
    }

    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const remaining = Math.max(0, maxScroll - window.scrollY);
    const finishDistance = Math.min(200, Math.max(120, window.innerHeight * 0.15));
    root.classList.toggle("cta-scroll-end", remaining <= finishDistance);
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  responsive.addEventListener?.("change", schedule);
  schedule();
})();
