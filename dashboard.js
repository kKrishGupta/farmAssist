
document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const profilePopup = document.getElementById("profilePopup");

  // Toggle profile popup
  profileBtn.addEventListener("click", () => {
    profilePopup.style.display =
      profilePopup.style.display === "block" ? "none" : "block";
  });

  // Close popup if clicked outside
  document.addEventListener("click", (e) => {
    if (!profileBtn.contains(e.target) && !profilePopup.contains(e.target)) {
      profilePopup.style.display = "none";
    }
  });

  // Logout button action
  const logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", () => {
    alert("You have been logged out!");
    // redirect to login page if needed
    window.location.href = "login.html";
  });
});


let cards = document.querySelector('.circle-cards');
let angle = 0;
function next() {
  angle -= 90; // rotate by one card
  cards.style.transform = `rotate(${angle}deg)`;
}
function prev() {
  angle += 90;
  cards.style.transform = `rotate(${angle}deg)`;
}
