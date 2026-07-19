const roles = [
  { count: "4人", name: "美术组", members: ["胡雪婷", "肖依橙", "詹益鹏", "严培源"], summary: "视觉方向 角色概念与场景气氛", detail: "负责角色与场景概念 宣传视觉 色彩基调和最终风格统一 让不同环节的资产始终属于同一个世界", outputs: ["角色与场景概念", "宣传视觉", "风格规范"] },
  { count: "1人", name: "程序", members: ["邓俊浩"], summary: "交互逻辑 系统接入与版本打包", detail: "负责核心玩法 关卡事件 UI接入 版本打包与技术问题排查 确保创意最终能够运行和交付", outputs: ["核心交互", "事件系统", "版本交付"] },
  { count: "4人", name: "建模组", members: ["罗子洋", "刘伟", "李金辉", "李嘉帆"], summary: "角色 场景模块与道具资产", detail: "负责角色 怪物 环境模块和关键道具的三维制作 并完成规范整理与引擎导入", outputs: ["角色模型", "环境资产", "引擎规范"] },
  { count: "2人", name: "动画组", members: ["徐梓皓", "黄耀燊"], summary: "角色动作 技能反馈与关键演出", detail: "负责角色和怪物动作 技能表现 镜头演出与动画落地 让玩法反馈更清晰 角色更有生命力", outputs: ["角色动作", "技能动画", "镜头演出"] },
  { count: "2人", name: "地编组", members: ["莫泳强", "成佳豪"], summary: "关卡搭建 玩家动线与光影氛围", detail: "负责关卡空间 场景摆放 光照气氛和玩家动线 把分散资产组织成可探索 可游玩的完整体验", outputs: ["关卡空间", "光影氛围", "玩家动线"] },
  { count: "1人", name: "UI / 音效", members: ["柯皓轩"], summary: "界面反馈 声音节奏与展示包装", detail: "负责界面视觉 按钮反馈 环境音效和最终展示包装 保证信息清楚并建立统一的体验节奏", outputs: ["界面视觉", "声音反馈", "展示包装"] }
];

const shell = document.querySelector(".site-shell");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const navShowcaseLink = navigation?.querySelector('a[href="#showcase"], a[href="#shenggu-showcase"]');

const heroProjects = [
  {
    key: "yingxi",
    name: "影戏",
    title: "《影戏》",
    status: "可玩 Demo 已完成",
    image: "./assets/yingxi-main.jpg",
    alt: "《影戏》主菜单与角色战斗画面",
    showcase: "#showcase"
  },
  {
    key: "shenggu",
    name: "社鼓神像",
    title: "《社鼓神像》",
    status: "可玩 Demo 已完成",
    image: "./assets/shenggu-poster.webp",
    alt: "《社鼓神像》官方宣传图",
    showcase: "#shenggu-showcase"
  }
];

const heroVisual = document.querySelector(".hero-visual");
const heroPanel = document.querySelector("#hero-project-panel");
const heroMainImage = document.querySelector("[data-hero-main-image]");
const heroMainStatus = document.querySelector("[data-hero-main-status]");
const heroMainTitle = document.querySelector("[data-hero-main-title]");
const heroSecondary = document.querySelector(".hero-secondary-shot");
const heroSecondaryImage = document.querySelector("[data-hero-secondary-image]");
const heroSecondaryStatus = document.querySelector("[data-hero-secondary-status]");
const heroSecondaryTitle = document.querySelector("[data-hero-secondary-title]");
const heroSection = document.querySelector(".hero");
const heroProjectLink = document.querySelector("[data-hero-project-link]");
const heroDemoLink = document.querySelector("[data-hero-demo-link]");
const heroDemoLabel = document.querySelector("[data-hero-demo-label]");
const heroRotationButton = document.querySelector(".hero-rotation-toggle");
const heroRotationLabel = document.querySelector("[data-hero-rotation-label]");
const heroRotationMessage = document.querySelector("[data-hero-rotation-message]");
const heroProjectTabs = [...document.querySelectorAll("[data-hero-project-index]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroRotationDelay = 7000;
let activeHeroProject = 0;
let heroRotationTimer;
let heroRotationPaused = false;
let heroInView = true;

function renderHeroProject(index, animate = true) {
  if (!heroVisual || !heroMainImage || !heroSecondaryImage) return;
  activeHeroProject = index;
  const active = heroProjects[index];
  const secondary = heroProjects[(index + 1) % heroProjects.length];
  heroVisual.dataset.activeProject = active.key;
  heroMainImage.src = active.image;
  heroMainImage.alt = active.alt;
  heroMainStatus.textContent = active.status;
  heroMainTitle.textContent = active.title;
  heroSecondaryImage.src = secondary.image;
  heroSecondaryImage.alt = secondary.alt;
  heroSecondaryStatus.textContent = secondary.status;
  heroSecondaryTitle.textContent = secondary.title;
  heroSecondary.setAttribute("aria-label", "将" + secondary.title + "切换到主画面");
  if (heroDemoLink) heroDemoLink.dataset.demoProject = active.name;
  if (heroDemoLabel) heroDemoLabel.textContent = "联系获取" + active.title + "Demo";
  if (navShowcaseLink) navShowcaseLink.href = active.showcase;
  heroProjectTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  });
  heroPanel?.setAttribute("aria-labelledby", heroProjectTabs[index]?.id || "");
  if (animate) {
    heroVisual.classList.remove("hero-refresh");
    window.requestAnimationFrame(() => heroVisual.classList.add("hero-refresh"));
    window.setTimeout(() => heroVisual.classList.remove("hero-refresh"), 500);
  }
}

function selectProject(index, { animateHero = true, pauseRotation = false } = {}) {
  renderHeroProject(index, animateHero);
  setProjectCard(index);
  setShowcaseProject(index);
  prepareDemoRequest(heroProjects[index].name, false);
  if (!pauseRotation) return;
  heroRotationPaused = true;
  updateHeroRotationControl();
  stopHeroRotation();
}

function stopHeroRotation() {
  window.clearInterval(heroRotationTimer);
  heroRotationTimer = undefined;
}

function startHeroRotation() {
  stopHeroRotation();
  if (reducedMotion || heroRotationPaused || document.hidden || !heroInView || heroSection?.matches(":hover") || heroSection?.contains(document.activeElement)) return;
  heroRotationTimer = window.setInterval(() => {
    selectProject((activeHeroProject + 1) % heroProjects.length);
  }, heroRotationDelay);
}

function updateHeroRotationControl() {
  if (!heroRotationButton || !heroRotationMessage || !heroRotationLabel) return;
  const rotationIcon = heroRotationButton.querySelector(".rotation-icon");
  if (reducedMotion) {
    heroRotationLabel.textContent = "切换";
    if (rotationIcon) rotationIcon.textContent = "↔";
    heroRotationButton.setAttribute("aria-label", "手动切换主画面项目");
    heroRotationButton.removeAttribute("aria-pressed");
    heroRotationMessage.textContent = "已按系统设置关闭动效";
    return;
  }
  heroRotationLabel.textContent = heroRotationPaused ? "继续" : "暂停";
  if (rotationIcon) rotationIcon.textContent = heroRotationPaused ? "▶" : "Ⅱ";
  heroRotationButton.setAttribute("aria-label", heroRotationPaused ? "继续自动轮播" : "暂停自动轮播");
  heroRotationButton.setAttribute("aria-pressed", String(heroRotationPaused));
  heroRotationMessage.textContent = heroRotationPaused ? "自动交换已暂停" : "每7秒自动交换";
}

heroSecondary?.addEventListener("click", () => {
  selectProject((activeHeroProject + 1) % heroProjects.length, { pauseRotation: true });
});
heroProjectTabs.forEach((tab, index) => tab.addEventListener("click", () => {
  selectProject(index, { pauseRotation: true });
}));
heroProjectTabs.forEach((tab, index) => tab.addEventListener("keydown", (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const nextIndex = (index + direction + heroProjectTabs.length) % heroProjectTabs.length;
  heroProjectTabs[nextIndex].focus();
  heroProjectTabs[nextIndex].click();
}));
heroRotationButton?.addEventListener("click", () => {
  if (reducedMotion) {
    selectProject((activeHeroProject + 1) % heroProjects.length);
    return;
  }
  heroRotationPaused = !heroRotationPaused;
  updateHeroRotationControl();
  if (heroRotationPaused) stopHeroRotation();
  else startHeroRotation();
});
heroSection?.addEventListener("mouseenter", stopHeroRotation);
heroSection?.addEventListener("mouseleave", startHeroRotation);
heroSection?.addEventListener("focusin", stopHeroRotation);
heroSection?.addEventListener("focusout", () => {
  window.requestAnimationFrame(() => {
    if (!heroSection.contains(document.activeElement)) startHeroRotation();
  });
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopHeroRotation();
  else startHeroRotation();
});
if ("IntersectionObserver" in window && heroSection) {
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroInView = entry.isIntersecting;
    if (heroInView) startHeroRotation();
    else stopHeroRotation();
  }, { threshold: .18 });
  heroObserver.observe(heroSection);
}
renderHeroProject(0, false);
updateHeroRotationControl();
startHeroRotation();

menuButton?.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
});
navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  navigation.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "打开导航");
}));
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !navigation?.classList.contains("open")) return;
  navigation.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "打开导航");
  menuButton?.focus();
});

document.addEventListener("click", (event) => {
  if (!navigation?.classList.contains("open")) return;
  if (navigation.contains(event.target) || menuButton?.contains(event.target)) return;
  navigation.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "打开导航");
});

const siteHeader = document.querySelector(".site-header");
const backToTop = document.querySelector(".back-to-top");
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const secondaryShowcaseSection = document.querySelector("#shenggu-showcase");
if (secondaryShowcaseSection) observedSections.push(secondaryShowcaseSection);

function updateScrollControls() {
  const scrolled = window.scrollY > 120;
  siteHeader?.classList.toggle("is-scrolled", scrolled);
  backToTop?.classList.toggle("visible", window.scrollY > 760);
}

window.addEventListener("scroll", updateScrollControls, { passive: true });
updateScrollControls();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const activeTarget = "#" + visible.target.id;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === activeTarget;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-25% 0px -60%", threshold: [0, .2, .5] });
  observedSections.forEach((section) => navObserver.observe(section));
}

const projectTabs = [...document.querySelectorAll("[data-project-index]")];
const projectCards = [...document.querySelectorAll("[data-project-card]")];

function setProjectCard(index, focus = false) {
  projectCards.forEach((card, cardIndex) => { card.hidden = cardIndex !== index; });
  projectTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.setAttribute("tabindex", selected ? "0" : "-1");
  });
  if (focus) projectTabs[index]?.focus();
}

projectTabs.forEach((tab, index) => tab.addEventListener("click", () => selectProject(index, { pauseRotation: true })));
projectTabs.forEach((tab, index) => tab.addEventListener("keydown", (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const nextIndex = (index + direction + projectTabs.length) % projectTabs.length;
  selectProject(nextIndex, { pauseRotation: true });
  projectTabs[nextIndex]?.focus();
}));

const showcaseSections = [...document.querySelectorAll("[data-showcase-key]")];
const showcaseButtons = [...document.querySelectorAll("[data-showcase-index]")];

function setShowcaseProject(index, scrollIntoView = false) {
  showcaseSections.forEach((section, sectionIndex) => {
    section.hidden = sectionIndex !== index;
    if (sectionIndex !== index) section.querySelector("video")?.pause();
  });
  showcaseButtons.forEach((button) => {
    const selected = Number(button.dataset.showcaseIndex) === index;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.setAttribute("tabindex", selected ? "0" : "-1");
  });
  if (scrollIntoView) {
    window.requestAnimationFrame(() => showcaseSections[index]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }));
  }
}

showcaseButtons.forEach((button) => button.addEventListener("click", () => {
  const index = Number(button.dataset.showcaseIndex);
  selectProject(index, { pauseRotation: true });
  window.requestAnimationFrame(() => showcaseSections[index]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }));
}));
showcaseButtons.forEach((button) => button.addEventListener("keydown", (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const nextIndex = (Number(button.dataset.showcaseIndex) + direction + showcaseSections.length) % showcaseSections.length;
  selectProject(nextIndex, { pauseRotation: true });
  window.requestAnimationFrame(() => showcaseSections[nextIndex]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }));
  window.requestAnimationFrame(() => showcaseSections[nextIndex]?.querySelector(`[data-showcase-index="${nextIndex}"]`)?.focus());
}));

document.querySelectorAll('a[href="#showcase"], a[href="#shenggu-showcase"]').forEach((link) => {
  link.addEventListener("click", () => selectProject(link.getAttribute("href") === "#shenggu-showcase" ? 1 : 0, { pauseRotation: true }));
});

heroProjectLink?.addEventListener("click", () => selectProject(activeHeroProject, { pauseRotation: true }));

setProjectCard(0);
setShowcaseProject(0);

const demoContactTitle = document.querySelector("[data-demo-contact-title]");
const demoContactMessage = document.querySelector("[data-demo-contact-message]");
const demoCopyButton = document.querySelector("[data-demo-copy]");
const demoAccessNote = document.querySelector(".demo-access-note");
let demoHighlightTimer;

function prepareDemoRequest(projectName, highlight = true) {
  if (demoContactTitle) demoContactTitle.textContent = "获取《" + projectName + "》PC Demo";
  if (demoContactMessage) demoContactMessage.textContent = "体验版本暂不提供公开下载 请通过微信 QQ或邮箱联系我们 并注明项目名称";
  if (demoCopyButton) demoCopyButton.dataset.copy = "你好 我想获取《" + projectName + "》PC Demo体验版本";
  if (!demoAccessNote || !highlight) return;
  window.clearTimeout(demoHighlightTimer);
  demoAccessNote.classList.remove("is-targeted");
  window.requestAnimationFrame(() => demoAccessNote.classList.add("is-targeted"));
  demoHighlightTimer = window.setTimeout(() => demoAccessNote.classList.remove("is-targeted"), 2600);
}

document.querySelectorAll("[data-demo-project]").forEach((link) => link.addEventListener("click", () => {
  const projectName = link.dataset.demoProject;
  const index = heroProjects.findIndex((project) => project.name === projectName);
  if (index >= 0) selectProject(index, { pauseRotation: true });
  prepareDemoRequest(projectName);
}));

const roleButtons = [...document.querySelectorAll(".role-list button")];
const rolePanel = document.querySelector(".role-panel");
roleButtons.forEach((button, index) => button.addEventListener("click", () => {
  const role = roles[index];
  roleButtons.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
    item.setAttribute("aria-selected", String(itemIndex === index));
    item.setAttribute("tabindex", itemIndex === index ? "0" : "-1");
  });
  rolePanel.innerHTML = "<p>" + role.count + "</p><h3>" + role.name + "</h3><strong>" + role.summary + "</strong><span>" + role.detail + "</span><div class=\"role-members\"><small>成员</small><p>" + role.members.join(" · ") + "</p></div><ul>" + role.outputs.map((item) => "<li>" + item + "</li>").join("") + "</ul>";
}));
roleButtons.forEach((button, index) => button.setAttribute("tabindex", index === 0 ? "0" : "-1"));
roleButtons.forEach((button, index) => button.addEventListener("keydown", (event) => {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  let nextIndex = index;
  if (event.key === "ArrowDown") nextIndex = (index + 1) % roleButtons.length;
  if (event.key === "ArrowUp") nextIndex = (index - 1 + roleButtons.length) % roleButtons.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = roleButtons.length - 1;
  roleButtons[nextIndex].focus();
  roleButtons[nextIndex].click();
}));

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("copy failed");
}

const toast = document.querySelector(".toast");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
  const value = button.dataset.copy;
  const defaultLabel = button.dataset.defaultLabel || "复制";
  button.disabled = true;
  button.textContent = "复制中…";
  try {
    await copyText(value);
    button.textContent = "已复制 ✓";
    showToast(defaultLabel.replace("复制", "") + "已复制到剪贴板");
  } catch {
    button.textContent = "请手动复制";
    showToast("复制失败 请手动选择内容");
  }
  window.setTimeout(() => {
    button.textContent = defaultLabel;
    button.disabled = false;
  }, 2200);
}));

document.querySelectorAll(".video-shell").forEach((shell) => {
  const video = shell.querySelector("video");
  const playButton = shell.querySelector(".video-play-button");
  if (!video || !playButton) return;
  const playLabel = playButton.querySelector("strong");
  playButton.addEventListener("click", async () => {
    try {
      await video.play();
    } catch {
      showToast("浏览器阻止了自动播放 请使用视频控制栏");
    }
  });
  video.addEventListener("play", () => playButton.classList.add("is-hidden"));
  video.addEventListener("pause", () => {
    if (video.ended) return;
    if (playLabel) playLabel.textContent = video.currentTime > 0 ? "继续播放" : "播放宣传片";
    playButton.classList.remove("is-hidden");
  });
  video.addEventListener("ended", () => {
    if (playLabel) playLabel.textContent = "重新播放";
    playButton.classList.remove("is-hidden");
  });
});

const forbiddenButton = document.querySelector(".forbidden-button");
forbiddenButton?.addEventListener("click", () => {
  const active = shell.classList.toggle("ritual-mode");
  forbiddenButton.textContent = active ? "恢复正常" : "不要按";
  forbiddenButton.setAttribute("aria-pressed", String(active));
});

const cursorBeam = document.querySelector(".cursor-beam");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (cursorBeam && finePointer && !reducedMotion) {
  let targetX = -500;
  let targetY = -500;
  let currentX = -500;
  let currentY = -500;
  let previousX = -500;
  let previousY = -500;
  let beamFrame;

  const animateBeam = () => {
    currentX += (targetX - currentX) * .24;
    currentY += (targetY - currentY) * .24;
    const deltaX = currentX - previousX;
    const deltaY = currentY - previousY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > .2) {
      cursorBeam.style.setProperty("--beam-angle", Math.atan2(deltaY, deltaX) * 180 / Math.PI + "deg");
    }
    cursorBeam.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;
    previousX = currentX;
    previousY = currentY;
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) < .2) {
      currentX = targetX;
      currentY = targetY;
      cursorBeam.style.transform = `translate3d(${currentX}px,${currentY}px,0) translate(-50%,-50%)`;
      beamFrame = undefined;
      return;
    }
    beamFrame = window.requestAnimationFrame(animateBeam);
  };

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    targetX = event.clientX;
    targetY = event.clientY;
    if (currentX < -100) {
      currentX = targetX;
      currentY = targetY;
    }
    cursorBeam.classList.add("visible");
    if (!beamFrame) beamFrame = window.requestAnimationFrame(animateBeam);
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    cursorBeam.classList.remove("visible");
    if (beamFrame) window.cancelAnimationFrame(beamFrame);
    beamFrame = undefined;
  });
  document.documentElement.addEventListener("mouseenter", () => {
    if (targetX >= 0) cursorBeam.classList.add("visible");
  });
}

const lightboxTriggers = [...document.querySelectorAll(".project-image-button, .frame-card, .process-card button, .strip-image-button")];

function openLightbox(trigger) {
  const gallery = lightboxTriggers.filter((item) => !item.closest("[hidden]") && item.querySelector("img"));
  let currentIndex = gallery.indexOf(trigger);
  if (currentIndex < 0) currentIndex = 0;
  const firstImage = gallery[currentIndex]?.querySelector("img");
  if (!firstImage) return;
  document.querySelector(".lightbox")?.remove();
  const previousFocus = document.activeElement;
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "项目图片查看器");
  overlay.innerHTML = '<button class="lightbox-close" type="button">关闭 ESC</button><button class="lightbox-nav prev" type="button" aria-label="查看上一张">←</button><div class="lightbox-image-wrap"><img alt=""></div><button class="lightbox-nav next" type="button" aria-label="查看下一张">→</button><span class="lightbox-count" aria-live="polite"></span>';
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  const overlayImage = overlay.querySelector("img");
  const count = overlay.querySelector(".lightbox-count");
  const previousButton = overlay.querySelector(".lightbox-nav.prev");
  const nextButton = overlay.querySelector(".lightbox-nav.next");

  const renderImage = (index) => {
    currentIndex = (index + gallery.length) % gallery.length;
    const image = gallery[currentIndex].querySelector("img");
    overlayImage.src = image.currentSrc || image.src;
    overlayImage.alt = image.alt || "项目大图";
    count.textContent = `${currentIndex + 1} / ${gallery.length}`;
    const singleImage = gallery.length < 2;
    previousButton.hidden = singleImage;
    nextButton.hidden = singleImage;
  };

  const close = () => {
    document.removeEventListener("keydown", onKeydown);
    overlay.remove();
    document.body.style.overflow = "";
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };
  overlay.addEventListener("click", (event) => { if (event.target === overlay || event.target.classList.contains("lightbox-close")) close(); });
  previousButton.addEventListener("click", () => renderImage(currentIndex - 1));
  nextButton.addEventListener("click", () => renderImage(currentIndex + 1));
  const onKeydown = (event) => {
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") renderImage(currentIndex - 1);
    if (event.key === "ArrowRight") renderImage(currentIndex + 1);
    if (event.key === "Tab") {
      const focusable = [overlay.querySelector(".lightbox-close"), previousButton, nextButton].filter((item) => item && !item.hidden);
      const currentFocusIndex = focusable.indexOf(document.activeElement);
      if (event.shiftKey && currentFocusIndex <= 0) {
        event.preventDefault();
        focusable[focusable.length - 1]?.focus();
      } else if (!event.shiftKey && currentFocusIndex === focusable.length - 1) {
        event.preventDefault();
        focusable[0]?.focus();
      }
    }
  };
  document.addEventListener("keydown", onKeydown);
  let swipeStartX = 0;
  overlay.querySelector(".lightbox-image-wrap").addEventListener("pointerdown", (event) => { swipeStartX = event.clientX; });
  overlay.querySelector(".lightbox-image-wrap").addEventListener("pointerup", (event) => {
    const distance = event.clientX - swipeStartX;
    if (Math.abs(distance) < 50) return;
    renderImage(currentIndex + (distance < 0 ? 1 : -1));
  });
  renderImage(currentIndex);
  overlay.querySelector(".lightbox-close").focus();
}

lightboxTriggers.forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});
document.querySelector(".level-strip figcaption button")?.addEventListener("click", () => openLightbox(document.querySelector(".strip-image-button")));
