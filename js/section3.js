const message = `私たちらしく 沖縄でのんびり結婚式を挙げることにしました\nゆるやかな時間の中で 皆さんと笑顔のひとときを過ごせたら幸いです\n旅のついでに…という気持ちで お越しいただけると嬉しいです`;
const container = document.getElementById("section3");
container.innerHTML = '<h2>Message</h2><p class="animated-text" id="messageText"></p>';
const messageEl = document.getElementById("messageText");
message.split("").forEach((char, i) => {
  const span = document.createElement("span");
  span.innerHTML = (char === "\n") ? "<br>" : (char === " " ? "&nbsp;" : char);
  span.style.animationDelay = `${i * 0.05}s`;
  messageEl.appendChild(span);
});