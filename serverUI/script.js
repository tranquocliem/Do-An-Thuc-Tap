const banner = document.getElementsByClassName("banner")[0];
const blocks = document.getElementsByClassName("blocks");

for (var i = 1; i < 400; i++) {
  banner.innerHTML += "<div class='blocks'></div>";
  const duration = Math.random() * 5;
  blocks[i].style.animationDuration = 2 + duration + "s";
  blocks[i].style.animationDelay = duration + "s";
}

const section = document.querySelector("section");
setTimeout(function () {
  section.classList.add("active");
}, 14000);

setTimeout(function () {
  const text = document.querySelector(".text");
  text.classList.add("activeText");
  text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>");

  anime({
    targets: ".text span",
    translateY: [-600, 0],
    scale: [10, 1],
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 1500,
    delay: anime.stagger(100),
  });
}, 22000);

setTimeout(function () {
  const text = document.querySelector(".name");
  text.classList.add("activeName");
  const sec = document.querySelector(".section");
  sec.classList.add("activeSection");
  text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>");
}, 25000);

const text = document.querySelector(".name");
text.classList.add("activeName");
text.innerHTML = text.textContent.replace(/\S/g, "<span>$&</span>");
