document.addEventListener("DOMContentLoaded", function () {
  const leftDoor = document.getElementById("leftDoor");
  const rightDoor = document.getElementById("rightDoor");
  const doorContainer = document.getElementById("doorContainer");
  const mainContent = document.getElementById("container");

  if (!leftDoor || !rightDoor || !doorContainer || !mainContent) return;

  function openDoors() {
    leftDoor.classList.add("open-left");
    rightDoor.classList.add("open-right");

    setTimeout(() => {
      doorContainer.style.display = "none";
      mainContent.style.display = "block";
    }, 2500); // エフェクト後に非表示にする時間
  }

  leftDoor.addEventListener("click", openDoors);
  rightDoor.addEventListener("click", openDoors);
  doorContainer.addEventListener("click", openDoors); // 全体クリックにも対応
});