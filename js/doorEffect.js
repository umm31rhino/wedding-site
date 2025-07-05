document.addEventListener("DOMContentLoaded", function () {
  const leftDoor = document.getElementById("leftDoor");
  const rightDoor = document.getElementById("rightDoor");
  const doorContainer = document.getElementById("doorContainer");
  const mainContent = document.getElementById("container");

  if (!leftDoor || !rightDoor || !doorContainer || !mainContent) return;

  // CSS perspective を使って、扉を手前に回転する
  function openDoors() {
    leftDoor.style.transform = "perspective(1000px) rotateY(90deg)";
    rightDoor.style.transform = "perspective(1000px) rotateY(-90deg)";
    leftDoor.style.transition = "transform 2s ease-in-out";
    rightDoor.style.transition = "transform 2s ease-in-out";

    setTimeout(() => {
      doorContainer.style.display = "none";
      mainContent.style.display = "block";
    }, 2500);
  }

  leftDoor.addEventListener("click", openDoors);
  rightDoor.addEventListener("click", openDoors);
  doorContainer.addEventListener("click", openDoors); // 全体クリックにも対応
});
