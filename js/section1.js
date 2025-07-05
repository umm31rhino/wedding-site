
const section1 = document.getElementById('section1');
section1.style.backgroundImage = "url('assets/1-1.jpg')";
section1.innerHTML = `
  <h1 class="animated-text" id="titleText"></h1>
  <p class="animated-text" id="subTitleText"></p>
`;

const mainTitle = "Takumi & Ayaka Wedding";
const subTitle = "2025.10.10 Okinawa Seragaki island chapel";
const titleTextEl = document.getElementById("titleText");
const subTitleTextEl = document.getElementById("subTitleText");

function animateText(el, text) {
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.innerHTML = (char === " ") ? "&nbsp;" : char;
    span.style.animationDelay = \`\${i * 0.05}s\`;
    el.appendChild(span);
  });
}

animateText(titleTextEl, mainTitle);
animateText(subTitleTextEl, subTitle);
