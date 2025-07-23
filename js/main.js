
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  }, {
    threshold: 0.6
  });

  sections.forEach(section => observer.observe(section));

  // Menu toggle
  const menuButton = document.getElementById("menuButton");
  const navMenu = document.getElementById("navMenu");

  menuButton.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  });

  // Door animation
  const leftDoor = document.getElementById("leftDoor");
  const rightDoor = document.getElementById("rightDoor");
  const doorOverlay = document.getElementById("doorOverlay");

  const openDoors = () => {
    leftDoor.classList.add("open-left");
    rightDoor.classList.add("open-right");
    setTimeout(() => {
      doorOverlay.style.display = "none";
      document.body.classList.remove("no-scroll");
    }, 2000);
  };

  [leftDoor, rightDoor, doorOverlay].forEach(el => {
    el.addEventListener("click", openDoors);
  });
});
