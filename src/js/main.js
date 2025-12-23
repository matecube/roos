$(document).ready(() => {
  if ($(".f-nav").length) {
    initFNavAccordions();
  }
});

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function initFNavAccordions() {
  const MOBILE_MAX = 574;
  const RESIZE_DEBOUNCE = 150;
  const ANIM_MS = 220;
  const ANIM_EASING = "swing";
  const $navs = $(".f-nav");
  if (!$navs.length) return;

  const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);

  const applyState = () => {
    if (mq.matches) {
      $navs.each((_, nav) => {
        const $nav = $(nav);
        const $content = $nav.find(".f-nav-content");
        if (!$content.length) return;
        $nav.removeClass("is-open");
        $content.stop(true, true).css({ height: 0, overflow: "hidden" });
      });
    } else {
      $navs.each((_, nav) => {
        const $nav = $(nav);
        const $content = $nav.find(".f-nav-content");
        if (!$content.length) return;
        $nav.addClass("is-open");
        $content.stop(true, true).css({ height: "auto", overflow: "" });
      });
    }
  };

  applyState();

  $navs.each((_, nav) => {
    const $nav = $(nav);
    const $title = $nav.find(".f-nav-ttl");
    const $content = $nav.find(".f-nav-content");
    if (!$title.length || !$content.length) return;

    const openContent = () => {
      const targetHeight = $content[0].scrollHeight;
      $content
        .stop(true, true)
        .css({ overflow: "hidden" })
        .animate(
          { height: targetHeight },
          {
            duration: ANIM_MS,
            easing: ANIM_EASING,
            complete: () => $content.css({ height: "auto" }),
          }
        );
    };

    const closeContent = () => {
      const currentHeight = $content.outerHeight();
      $content
        .stop(true, true)
        .css({ overflow: "hidden", height: currentHeight })
        .animate({ height: 0 }, { duration: ANIM_MS, easing: ANIM_EASING });
    };

    const toggle = () => {
      if (!mq.matches) return; // Only toggle on mobile widths
      const isOpen = $nav.toggleClass("is-open").hasClass("is-open");
      if (isOpen) {
        openContent();
      } else {
        closeContent();
      }
    };

    $title.off("click.fNav").on("click.fNav", toggle);

    if (mq.matches) {
      $nav.removeClass("is-open");
      $content.css({ height: 0, overflow: "hidden" });
    } else {
      $nav.addClass("is-open");
      $content.css({ height: "auto", overflow: "" });
    }
  });

  mq.addEventListener("change", applyState);
  window.addEventListener("resize", debounce(applyState, RESIZE_DEBOUNCE));
}
