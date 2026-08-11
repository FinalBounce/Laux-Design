(() => {
  const root = document.documentElement;
  const phone = window.matchMedia(
    "(max-width: 479px), (orientation: landscape) and (max-width: 932px) and (max-height: 520px)",
  );
  const appleMobile =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const trigger = document.querySelector(".work-intro .sticky-trigger");
  const stickyElement = document.querySelector(".work-intro .sticky-element");
  const circles = [1, 2, 3, 4, 5].map((number) =>
    document.querySelector(".circle-" + number),
  );
  const artworkTitle = document.querySelector(".h1-section-title");
  const mobileVideo = document.querySelector(
    ".background-video.ordi:not(.tel) video",
  );
  const logoVideo = document.querySelector(".background-video.ordi.tel video");
  let frame = 0;

  const clamp = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const interpolate = (progress, start, end, from = 0, to = 1) => {
    if (progress <= start) return from;
    if (progress >= end) return to;
    return from + (to - from) * ((progress - start) / (end - start));
  };

  const clearAnimation = () => {
    root.classList.remove("mobile-home-runtime");
    circles.forEach((circle) => circle?.style.removeProperty("--mobile-circle-size"));
    artworkTitle?.style.removeProperty("--mobile-artworks-transform");
  };

  const updateAnimation = () => {
    frame = 0;

    if (!phone.matches || !trigger || circles.some((circle) => !circle)) {
      clearAnimation();
      return;
    }

    root.classList.add("mobile-home-runtime");
    const viewportWidth = stickyElement?.clientWidth || window.innerWidth;
    const viewportHeight = stickyElement?.clientHeight || window.innerHeight;
    const scrollDistance = Math.max(1, trigger.offsetHeight - viewportHeight);
    const progress = clamp(
      -trigger.getBoundingClientRect().top / scrollDistance,
    ) * 100;
    const maxDiameter = Math.ceil(
      Math.hypot(viewportWidth, viewportHeight) * 1.15,
    );
    const sizes = [
      interpolate(progress, 0, 26, 0, maxDiameter),
      interpolate(progress, 13, 60, 0, maxDiameter),
      interpolate(progress, 38, 71, 0, maxDiameter),
      interpolate(progress, 47, 82, 0, maxDiameter),
      interpolate(progress, 66, 77, 0, maxDiameter),
    ];

    circles.forEach((circle, index) => {
      circle.style.setProperty("--mobile-circle-size", sizes[index].toFixed(3) + "px");
    });

    if (artworkTitle) {
      const titleProgress = clamp((progress - 64) / 20);
      const translate = -35 * titleProgress;
      const scale = 0.2 + 0.8 * titleProgress;
      artworkTitle.style.setProperty(
        "--mobile-artworks-transform",
        "translate3d(0, " + translate.toFixed(3) + "vh, 0) scale(" + scale.toFixed(3) + ")",
      );
    }
  };

  const scheduleAnimation = () => {
    if (!frame) frame = window.requestAnimationFrame(updateAnimation);
  };

  const startMobileVideo = () => {
    if (
      !phone.matches ||
      appleMobile ||
      !mobileVideo ||
      document.visibilityState === "hidden"
    ) return;

    mobileVideo.muted = true;
    mobileVideo.defaultMuted = true;
    mobileVideo.autoplay = true;
    mobileVideo.loop = true;
    mobileVideo.playsInline = true;
    mobileVideo.controls = false;
    mobileVideo.preload = "auto";
    mobileVideo.setAttribute("muted", "");
    mobileVideo.setAttribute("autoplay", "");
    mobileVideo.setAttribute("playsinline", "");
    mobileVideo.setAttribute("webkit-playsinline", "");
    mobileVideo.removeAttribute("controls");

    if (mobileVideo.readyState === 0) mobileVideo.load();
    const attempt = mobileVideo.play();
    attempt?.catch(() => {});
  };

  const configurePhone = () => {
    scheduleAnimation();

    root.classList.toggle("ios-mobile-media", phone.matches && appleMobile);

    if (!phone.matches) {
      logoVideo?.pause();
      return;
    }

    logoVideo?.pause();
    if (appleMobile) {
      mobileVideo?.pause();
      return;
    }

    startMobileVideo();
  };

  window.addEventListener("scroll", scheduleAnimation, { passive: true });
  document.addEventListener("touchmove", scheduleAnimation, { passive: true });
  window.addEventListener("resize", configurePhone, { passive: true });
  window.addEventListener("orientationchange", configurePhone, { passive: true });
  window.addEventListener("pageshow", configurePhone);
  document.addEventListener("visibilitychange", startMobileVideo);
  mobileVideo?.addEventListener("loadedmetadata", startMobileVideo);
  mobileVideo?.addEventListener("canplay", startMobileVideo);

  ["touchstart", "touchend", "pointerdown"].forEach((eventName) => {
    document.addEventListener(eventName, startMobileVideo, {
      capture: true,
      once: true,
      passive: true,
    });
  });

  phone.addEventListener?.("change", configurePhone);
  configurePhone();
})();
