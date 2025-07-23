
function initializeSite() {
  document.getElementById("container").scrollTo(0, 0);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".section").forEach(section => {
    const bg = section.getAttribute("data-bg");
    if (bg) section.style.backgroundImage = `url('${bg}')`;
    observer.observe(section);
  });

  const menuBtn = document.getElementById("menuButton");
  const navMenu = document.getElementById("navMenu");
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });
}

function openDoors() {
  document.querySelector(".door.left").classList.add("open-left");
  document.querySelector(".door.right").classList.add("open-right");
  document.querySelector(".door-overlay").style.display = "none";
  setTimeout(() => {
    document.getElementById("doorContainer").style.display = "none";
  }, 2000);
}
