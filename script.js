const roles = [
  { count: "4人", name: "美术组", members: ["胡雪婷", "肖依橙", "詹益鹏", "严培源"], summary: "视觉方向、角色概念与场景气氛", detail: "负责角色与场景概念、宣传视觉、色彩基调和最终风格统一，让不同环节的资产始终属于同一个世界。", outputs: ["角色与场景概念", "宣传视觉", "风格规范"] },
  { count: "1人", name: "程序", members: ["邓俊浩"], summary: "交互逻辑、系统接入与版本打包", detail: "负责核心玩法、关卡事件、UI接入、版本打包与技术问题排查，确保创意最终能够运行和交付。", outputs: ["核心交互", "事件系统", "版本交付"] },
  { count: "4人", name: "建模组", members: ["罗子洋", "刘伟", "李金辉", "李嘉帆"], summary: "角色、场景模块与道具资产", detail: "负责角色、怪物、环境模块和关键道具的三维制作，并完成规范整理与引擎导入。", outputs: ["角色模型", "环境资产", "引擎规范"] },
  { count: "2人", name: "动画组", members: ["徐梓皓", "黄耀燊"], summary: "角色动作、技能反馈与关键演出", detail: "负责角色和怪物动作、技能表现、镜头演出与动画落地，让玩法反馈更清晰、角色更有生命力。", outputs: ["角色动作", "技能动画", "镜头演出"] },
  { count: "2人", name: "地编组", members: ["莫泳强", "成佳豪"], summary: "关卡搭建、玩家动线与光影氛围", detail: "负责关卡空间、场景摆放、光照气氛和玩家动线，把分散资产组织成可探索、可游玩的完整体验。", outputs: ["关卡空间", "光影氛围", "玩家动线"] },
  { count: "1人", name: "UI / 音效", members: ["柯皓轩"], summary: "界面反馈、声音节奏与展示包装", detail: "负责界面视觉、按钮反馈、环境音效和最终展示包装，保证信息清楚并建立统一的体验节奏。", outputs: ["界面视觉", "声音反馈", "展示包装"] }
];

const shell = document.querySelector(".site-shell");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

const heroProjects = [
  {
    key: "yingxi",
    title: "《影戏》",
    status: "可玩 Demo 已完成",
    image: "./assets/yingxi-main.jpg",
    alt: "《影戏》主菜单与角色战斗画面",
    showcase: "#showcase"
  },
  {
    key: "shenggu",
    title: "《社鼓神像》",
    status: "可玩 Demo 已完成",
    image: "./assets/shenggu-poster.webp",
    alt: "《社鼓神像》官方宣传图",
    showcase: "#shenggu-showcase"
  }
];

const heroVisual = document.querySelector(".hero-visual");
const heroMainImage = document.querySelector("[data-hero-main-image]");
const heroMainStatus = document.querySelector("[data-hero-main-status]");
const heroMainTitle = document.querySelector("[data-hero-main-title]");
const heroSecondary = document.querySelector(".hero-secondary-shot");
const heroSecondaryImage = document.querySelector("[data-hero-secondary-image]");
const heroSecondaryStatus = document.querySelector("[data-hero-secondary-status]");
const heroSecondaryTitle = document.querySelector("[data-hero-secondary-title]");
const heroShowcaseLink = document.querySelector("[data-hero-showcase-link]");
const heroLinkLabel = document.querySelector("[data-hero-link-label]");
const heroRotationButton = document.querySelector(".hero-rotation-toggle");
const heroRotationMessage = document.querySelector("[data-hero-rotation-message]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const heroRotationDelay = 7000;
let activeHeroProject = 0;
let heroRotationTimer;
let heroRotationPaused = false;

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
  heroShowcaseLink.href = active.showcase;
  heroLinkLabel.textContent = "播放" + active.title + "宣传片";
  if (animate) {
    heroVisual.classList.remove("hero-refresh");
    window.requestAnimationFrame(() => heroVisual.classList.add("hero-refresh"));
    window.setTimeout(() => heroVisual.classList.remove("hero-refresh"), 500);
  }
}

function stopHeroRotation() {
  window.clearInterval(heroRotationTimer);
  heroRotationTimer = undefined;
}

function startHeroRotation() {
  stopHeroRotation();
  if (reducedMotion || heroRotationPaused || document.hidden || heroVisual?.matches(":hover")) return;
  heroRotationTimer = window.setInterval(() => {
    renderHeroProject((activeHeroProject + 1) % heroProjects.length);
  }, heroRotationDelay);
}

function updateHeroRotationControl() {
  if (!heroRotationButton || !heroRotationMessage) return;
  if (reducedMotion) {
    heroRotationButton.textContent = "切换项目";
    heroRotationButton.setAttribute("aria-label", "手动切换主画面项目");
    heroRotationButton.removeAttribute("aria-pressed");
    heroRotationMessage.textContent = "已按系统设置关闭动效";
    return;
  }
  heroRotationButton.textContent = heroRotationPaused ? "继续轮播" : "暂停轮播";
  heroRotationButton.setAttribute("aria-label", heroRotationPaused ? "继续自动轮播" : "暂停自动轮播");
  heroRotationButton.setAttribute("aria-pressed", String(heroRotationPaused));
  heroRotationMessage.textContent = heroRotationPaused ? "自动交换已暂停" : "每7秒自动交换";
}

heroSecondary?.addEventListener("click", () => {
  renderHeroProject((activeHeroProject + 1) % heroProjects.length);
  startHeroRotation();
});
heroRotationButton?.addEventListener("click", () => {
  if (reducedMotion) {
    renderHeroProject((activeHeroProject + 1) % heroProjects.length);
    return;
  }
  heroRotationPaused = !heroRotationPaused;
  updateHeroRotationControl();
  if (heroRotationPaused) stopHeroRotation();
  else startHeroRotation();
});
heroVisual?.addEventListener("mouseenter", stopHeroRotation);
heroVisual?.addEventListener("mouseleave", startHeroRotation);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopHeroRotation();
  else startHeroRotation();
});
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

document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
  const value = button.dataset.copy;
  const defaultLabel = button.dataset.defaultLabel || "复制";
  try {
    await copyText(value);
    button.textContent = "已复制";
  } catch {
    button.textContent = "请手动复制";
  }
  window.setTimeout(() => button.textContent = defaultLabel, 2200);
}));

const forbiddenButton = document.querySelector(".forbidden-button");
forbiddenButton?.addEventListener("click", () => {
  const active = shell.classList.toggle("ritual-mode");
  forbiddenButton.textContent = active ? "恢复正常" : "不要按";
  forbiddenButton.setAttribute("aria-pressed", String(active));
});

function openLightbox(image) {
  if (!image) return;
  document.querySelector(".lightbox")?.remove();
  const previousFocus = document.activeElement;
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.innerHTML = '<button type="button">关闭 ESC</button><img src="' + image.src + '" alt="' + (image.alt || "项目大图") + '">';
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  const close = () => {
    document.removeEventListener("keydown", onKeydown);
    overlay.remove();
    document.body.style.overflow = "";
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };
  overlay.addEventListener("click", (event) => { if (event.target === overlay || event.target.tagName === "BUTTON") close(); });
  overlay.querySelector("img").addEventListener("click", (event) => event.stopPropagation());
  const onKeydown = (event) => {
    if (event.key === "Escape") {
      close();
    }
  };
  document.addEventListener("keydown", onKeydown);
  overlay.querySelector("button").focus();
}

document.querySelectorAll(".project-image-button, .frame-card, .process-card button, .strip-image-button").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button.querySelector("img")));
});
document.querySelector(".level-strip figcaption button")?.addEventListener("click", () => openLightbox(document.querySelector(".strip-image-button img")));
