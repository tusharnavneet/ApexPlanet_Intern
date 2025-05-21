
function showAlert() {
  alert("🌟 Great job exploring JavaScript interactivity!");
}


function greetUser() {
  const userName = prompt("What is your name?");
  if (userName && userName.trim() !== "") {
    alert(`👋 Welcome, ${userName}! So glad you're here.`);
  } else {
    alert("Hi there! 👋 Please enter your name next time.");
  }
}


const text = "Hi, I'm a Web Developer";
let index = 0;
function typeEffect() {
  const title = document.getElementById("typed-text");
  if (index < text.length) {
    title.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeEffect, 100);
  }
}
window.onload = () => {
  document.getElementById("typed-text").innerHTML = "";
  typeEffect();
};


