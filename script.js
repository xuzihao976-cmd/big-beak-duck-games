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

const roleButtons = [...document.querySelectorAll(".role-list button")];
const rolePanel = document.querySelector(".role-panel");
roleButtons.forEach((button, index) => button.addEventListener("click", () => {
  const role = roles[index];
  roleButtons.forEach((item, itemIndex) => {
    item.classList.toggle("active", itemIndex === index);
    item.setAttribute("aria-selected", String(itemIndex === index));
  });
  rolePanel.innerHTML = "<p>" + role.count + "</p><h3>" + role.name + "</h3><strong>" + role.summary + "</strong><span>" + role.detail + "</span><div class=\"role-members\"><small>成员</small><p>" + role.members.join(" · ") + "</p></div><ul>" + role.outputs.map((item) => "<li>" + item + "</li>").join("") + "</ul>";
}));
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

document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", async () => {
  const value = button.dataset.copy;
  const defaultLabel = button.dataset.defaultLabel || "复制";
  try {
    await navigator.clipboard.writeText(value);
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
