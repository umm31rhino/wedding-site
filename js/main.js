
document.addEventListener("DOMContentLoaded", () => {
  const doors = document.querySelectorAll(".door");
  doors.forEach(door => door.addEventListener("click", openDoors));

  function openDoors() {
    document.getElementById("leftDoor").classList.add("open-left");
    document.getElementById("rightDoor").classList.add("open-right");
    setTimeout(() => {
      document.getElementById("doorContainer").style.display = "none";
      enableScroll();
    }, 2000);
  }

  function enableScroll() {
    document.body.style.overflow = "auto";
  }

  // スクロール時のエフェクト
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".section").forEach(section => {
    const bg = section.getAttribute("data-bg");
    section.style.backgroundImage = `url(${bg})`;
    observer.observe(section);
  });

  const menuBtn = document.getElementById("menuButton");
  const nav = document.getElementById("navMenu");
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
});
