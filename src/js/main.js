import { Swiper } from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";

document.addEventListener("DOMContentLoaded", function () {
  initResizeDetector();
  headerState();

  if (document.querySelector(".f-nav")) {
    initFNavAccordions();
  }
  if (document.querySelector(".cd-carousel")) {
    initCardCarousel();
  }
  if (document.querySelector(".ac")) {
    initAcc();
  }
  if (document.querySelector(".h-cat")) {
    initCategoryDrop();
  }
  if (document.querySelector("#search-mobile-open")) {
    initSearchMobile();
  }
  if (document.querySelector("#menu-mobile-open")) {
    initMenu();
  }
});

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function initResizeDetector() {
  const body = document.body;
  let resizeTimeout;
  let previousWidth = window.innerWidth;

  const handleResize = () => {
    const currentWidth = window.innerWidth;

    // Only trigger if width actually changed
    if (currentWidth !== previousWidth) {
      body.classList.add("resize-active");

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        body.classList.remove("resize-active");
      }, 300);

      previousWidth = currentWidth;
    }
  };

  window.addEventListener("resize", handleResize);
}

function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  };
}

function isVisible(element) {
  const style = window.getComputedStyle(element);
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    element.offsetHeight > 0
  );
}

function animateHeight(element, targetHeight, duration = 220, callback) {
  const startHeight = element.offsetHeight;
  const startTime = performance.now();

  element.style.overflow = "hidden";
  element.style.height = startHeight + "px";

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    const currentHeight =
      startHeight + (targetHeight - startHeight) * easeProgress;
    element.style.height = currentHeight + "px";

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      if (targetHeight === 0) {
        element.style.height = "0";
        element.style.display = "none";
      } else {
        element.style.height = "auto";
      }
      if (callback) callback();
    }
  }

  requestAnimationFrame(animate);
}

function initSearchMobile() {
  const openBtn = document.querySelector("#search-mobile-open");
  const closeBtn = document.querySelector("#search-mobile-close");
  const searchResults = document.querySelector("#search-results");
  const body = document.body;

  if (!openBtn || !closeBtn) return;

  let previousWidth = window.innerWidth;
  let isLocked = false;

  const openSearch = () => {
    body.classList.add("search-mobile-open");

    if (searchResults && !isLocked) {
      disableBodyScroll(searchResults, {
        allowTouchMove: (el) => {
          return searchResults.contains(el);
        },
      });
      isLocked = true;
    }
  };

  const closeSearch = () => {
    body.classList.remove("search-mobile-open");

    if (isLocked) {
      if (searchResults) {
        enableBodyScroll(searchResults);
      }
      isLocked = false;
    }
  };

  openBtn.addEventListener("click", openSearch);

  closeBtn.addEventListener("click", closeSearch);

  const handleResize = debounce(() => {
    const currentWidth = window.innerWidth;

    if (currentWidth !== previousWidth) {
      body.classList.remove("search-mobile-open");

      if (isLocked) {
        clearAllBodyScrollLocks();
        isLocked = false;
      }

      previousWidth = currentWidth;
    }
  }, 150);

  window.addEventListener("resize", handleResize);
}

function initMenu() {
  const openBtn = document.querySelector("#menu-mobile-open");
  const closeBtn = document.querySelector("#menu-mobile-close");
  const backBtn = document.querySelector("#menu-mobile-back");
  const menu = document.querySelector("#menu-mobile");
  const body = document.body;

  if (!openBtn || !closeBtn || !menu) return;

  const leftPanel = menu.querySelector(".menu-panel._left");
  const rightPanel = menu.querySelector(".menu-panel._right");
  const leftContent = leftPanel?.querySelector(".menu-content");
  const rightContent = rightPanel?.querySelector(".menu-content");

  let previousWidth = window.innerWidth;
  let isLocked = false;

  const openMenu = () => {
    body.classList.add("menu-mobile-active");

    if (leftContent && rightContent && !isLocked) {
      // Lock body scroll, allow scrolling in both menu content elements
      disableBodyScroll(leftContent, {
        allowTouchMove: (el) => {
          return leftContent.contains(el) || rightContent.contains(el);
        },
      });
      disableBodyScroll(rightContent, {
        allowTouchMove: (el) => {
          return leftContent.contains(el) || rightContent.contains(el);
        },
      });
      isLocked = true;
    }
  };

  const closeMenu = () => {
    body.classList.remove("menu-mobile-active");
    rightPanel?.classList.remove("_visible");

    if (isLocked) {
      clearAllBodyScrollLocks();
      isLocked = false;
    }
  };

  const showSubmenu = (submenuId) => {
    const submenuContent = document.getElementById(`menu-mobile-${submenuId}`);
    if (!submenuContent || !rightPanel) return;

    const rightPanelTitle = rightPanel.querySelector(".menu-head-ttl");
    const submenuItem = menu.querySelector(`[data-submenu="${submenuId}"]`);

    // Update title if submenu item has text content
    if (rightPanelTitle && submenuItem) {
      const itemText = submenuItem.querySelector("span");
      if (itemText) {
        rightPanelTitle.textContent = itemText.textContent;
      }
    }

    rightPanel.classList.add("_visible");
  };

  const hideSubmenu = () => {
    rightPanel?.classList.remove("_visible");
  };

  openBtn.addEventListener("click", openMenu);

  closeBtn.addEventListener("click", closeMenu);

  backBtn?.addEventListener("click", hideSubmenu);

  // Handle submenu items
  const submenuItems = menu.querySelectorAll("[data-submenu]");
  submenuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const submenuId = item.getAttribute("data-submenu");
      if (submenuId) {
        showSubmenu(submenuId);
      }
    });
  });

  const handleResize = debounce(() => {
    const currentWidth = window.innerWidth;

    if (currentWidth !== previousWidth) {
      body.classList.remove("menu-mobile-active");
      rightPanel?.classList.remove("_visible");

      if (isLocked) {
        clearAllBodyScrollLocks();
        isLocked = false;
      }

      previousWidth = currentWidth;
    }
  }, 150);

  window.addEventListener("resize", handleResize);
}

function initCategoryDrop() {
  const containers = document.querySelectorAll(".h-cat");

  containers.forEach((container) => {
    const btn = container.querySelector(".h-cat-btn");
    const drop = container.querySelector(".h-cat-drop");
    const dropIn = drop?.querySelector(".h-cat-drop-in");

    if (!btn || !drop || !dropIn) return;

    container.style.position = "relative";
    drop.style.display = "none";

    let isOpen = false;

    const handleDropdownOpen = () => {
      document.querySelectorAll(".h-cat-drop").forEach((otherDrop) => {
        if (otherDrop !== drop && isVisible(otherDrop)) {
          otherDrop.style.display = "none";
        }
      });

      drop.style.display = "block";
      drop.style.position = "absolute";
      dropIn.style.maxHeight = "";
      dropIn.style.overflowY = "";

      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const btnHeight = btn.offsetHeight;
      const dropdownTop = btnRect.bottom - containerRect.top + 8;

      drop.style.top = dropdownTop + "px";
      drop.style.left = "0px";
      drop.style.zIndex = "9999";

      const dropdownRect = drop.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownBottom = dropdownRect.bottom;
      const spaceFromDropdownToBottom = viewportHeight - dropdownRect.top;

      if (dropdownBottom > viewportHeight) {
        const dropPadding =
          parseFloat(getComputedStyle(drop).paddingTop || 0) +
          parseFloat(getComputedStyle(drop).paddingBottom || 0);
        const availableSpace = spaceFromDropdownToBottom - dropPadding - 16;
        if (availableSpace > 0) {
          dropIn.style.maxHeight = availableSpace + "px";
          dropIn.style.overflowY = "auto";
        }
      }

      isOpen = true;
    };

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (isOpen) {
        drop.style.display = "none";
        dropIn.style.maxHeight = "";
        dropIn.style.overflowY = "";
        isOpen = false;
      } else {
        handleDropdownOpen();
      }
    });

    drop.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    const handleOutsideClick = (e) => {
      if (!container.contains(e.target)) {
        if (isOpen) {
          drop.style.display = "none";
          dropIn.style.maxHeight = "";
          dropIn.style.overflowY = "";
          isOpen = false;
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    window.addEventListener(
      "resize",
      debounce(() => {
        if (isOpen) {
          drop.style.display = "none";
          dropIn.style.maxHeight = "";
          dropIn.style.overflowY = "";
          handleDropdownOpen();
        }
      }, 100)
    );

    window.addEventListener(
      "scroll",
      debounce(() => {
        if (isOpen) {
          drop.style.display = "none";
          dropIn.style.maxHeight = "";
          dropIn.style.overflowY = "";
          handleDropdownOpen();
        }
      }, 100)
    );
  });
}

function headerState() {
  const header = document.getElementById("header");
  if (!header) return;

  const setHeaderHeightVar = () => {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--headerHeight", height + "px");
  };

  setHeaderHeightVar();

  window.addEventListener(
    "resize",
    debounce(() => setHeaderHeightVar(), 100)
  );

  let ticking = false;
  let lastScrollTop = window.scrollY || document.documentElement.scrollTop;
  const headerHeight = () => header.offsetHeight;

  const handleHeaderVisibility = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const currHeaderHeight = headerHeight();
    const isScrolledPastHeader = scrollTop > currHeaderHeight;
    const isScrollingUp = scrollTop < lastScrollTop;

    if (isScrolledPastHeader) {
      header.classList.add("_scrolled");
    } else {
      header.classList.remove("_scrolled");
    }

    if (!isScrolledPastHeader) {
      header.classList.add("_show");
    } else if (isScrolledPastHeader && isScrollingUp) {
      header.classList.add("_show");
    } else if (isScrolledPastHeader && !isScrollingUp) {
      header.classList.remove("_show");
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    ticking = false;
  };

  const initialScrollTop = window.scrollY || document.documentElement.scrollTop;
  if (initialScrollTop <= headerHeight()) {
    header.classList.add("_show");
  } else {
    header.classList.remove("_show");
  }
  if (initialScrollTop > headerHeight()) {
    header.classList.add("_scrolled");
  } else {
    header.classList.remove("_scrolled");
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(handleHeaderVisibility);
      ticking = true;
    }
  });
}

function initAcc() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const acContainers = document.querySelectorAll(".ac");

  acContainers.forEach((ac) => {
    const cards = Array.from(ac.querySelectorAll(".ac-card"));
    const DELAY = 3000;
    let currentIndex = 0;
    let intervalId = null;
    let isHovered = false;
    let autoplayStoppedByTap = false;

    function activateCard(index) {
      cards.forEach((card) => card.classList.remove("active"));
      if (cards[index]) {
        cards[index].classList.add("active");
      }
    }

    function startAutoChange() {
      if (intervalId || autoplayStoppedByTap) return;
      if (window.innerWidth <= 991) return;
      intervalId = setInterval(() => {
        if (!isHovered) {
          currentIndex = (currentIndex + 1) % cards.length;
          activateCard(currentIndex);
        }
      }, DELAY);
    }

    function stopAutoChange() {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (isTouchDevice) {
      cards.forEach((card) => {
        card.addEventListener("touchend", function (e) {
          e.stopPropagation();
          currentIndex = cards.indexOf(this);
          activateCard(currentIndex);
          stopAutoChange();
          autoplayStoppedByTap = true;
        });
      });

      document.addEventListener("touchend", function (e) {
        if (autoplayStoppedByTap) {
          if (!ac.contains(e.target)) {
            autoplayStoppedByTap = false;
            if (window.innerWidth > 991) {
              startAutoChange();
            }
          }
        }
      });
    } else {
      ac.addEventListener("mouseenter", function () {
        isHovered = true;
        stopAutoChange();
      });

      ac.addEventListener("mouseleave", function () {
        isHovered = false;
        if (window.innerWidth > 991) {
          startAutoChange();
        }
      });

      cards.forEach((card) => {
        card.addEventListener("mouseenter", function () {
          cards.forEach((c) => c.classList.remove("active"));
          this.classList.add("active");
          currentIndex = cards.indexOf(this);
        });
      });
    }

    activateCard(currentIndex);

    if (window.innerWidth > 991) {
      startAutoChange();
    }

    function handleResize() {
      stopAutoChange();
      if (window.innerWidth > 991 && !autoplayStoppedByTap) {
        startAutoChange();
      }
    }

    window.addEventListener("resize", debounce(handleResize, 150));
  });
}

function initCardCarousel() {
  const carouselWraps = document.querySelectorAll(".cd-carousel");

  carouselWraps.forEach((carouselWrap) => {
    const swiperEl = carouselWrap.querySelector(".swiper");

    const slides = carouselWrap.querySelectorAll(".swiper-slide");
    const slideCount = slides.length;

    const dataCols = parseInt(carouselWrap.dataset.cols, 10) || 4;

    const middleSlide = slideCount > 4 ? Math.floor(slideCount / 2) : 0;

    const swiperOptions = {
      modules: [Pagination, Autoplay],
      slidesPerView: dataCols,
      spaceBetween: 24,
      loop: true,
      initialSlide: middleSlide,
      speed: 600, // Transition duration in milliseconds (default: 300)
      autoplay: {
        delay: 3500,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: carouselWrap.querySelector(".swiper-pagination"),
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 1,
      },
      breakpoints: {},
    };

    if (dataCols === 2) {
      swiperOptions.breakpoints = {
        0: {
          slidesPerView: 1.25,
          spaceBetween: 24,
        },
        575: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
      };
    } else {
      swiperOptions.breakpoints = {
        0: {
          slidesPerView: 1.25,
          spaceBetween: 24,
        },
        575: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        992: {
          slidesPerView: 4,
          spaceBetween: 24,
        },
      };
    }

    new Swiper(swiperEl, swiperOptions);
  });
}

function initFNavAccordions() {
  const MOBILE_MAX = 574;
  const RESIZE_DEBOUNCE = 150;
  const ANIM_MS = 220;
  const navs = document.querySelectorAll(".f-nav");
  if (!navs.length) return;

  const mq = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);

  const applyState = () => {
    navs.forEach((nav) => {
      const content = nav.querySelector(".f-nav-content");
      if (!content) return;

      if (mq.matches) {
        nav.classList.remove("is-open");
        content.style.height = "0";
        content.style.overflow = "hidden";
      } else {
        nav.classList.add("is-open");
        content.style.height = "auto";
        content.style.overflow = "";
      }
    });
  };

  applyState();

  navs.forEach((nav) => {
    const title = nav.querySelector(".f-nav-ttl");
    const content = nav.querySelector(".f-nav-content");
    if (!title || !content) return;

    const openContent = () => {
      const targetHeight = content.scrollHeight;
      animateHeight(content, targetHeight, ANIM_MS, () => {
        content.style.height = "auto";
      });
    };

    const closeContent = () => {
      const currentHeight = content.offsetHeight;
      animateHeight(content, 0, ANIM_MS);
    };

    const toggle = () => {
      if (!mq.matches) return;
      const isOpen = nav.classList.toggle("is-open");
      if (isOpen) {
        openContent();
      } else {
        closeContent();
      }
    };

    title.removeEventListener("click", toggle);
    title.addEventListener("click", toggle);

    if (mq.matches) {
      nav.classList.remove("is-open");
      content.style.height = "0";
      content.style.overflow = "hidden";
    } else {
      nav.classList.add("is-open");
      content.style.height = "auto";
      content.style.overflow = "";
    }
  });

  mq.addEventListener("change", applyState);
  window.addEventListener("resize", debounce(applyState, RESIZE_DEBOUNCE));
}
