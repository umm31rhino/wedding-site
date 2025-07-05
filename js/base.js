
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  container.scrollTo(0, 0);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.6
  });

  document.querySelectorAll(".section").forEach(section => {
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
});
