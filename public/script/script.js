const rating = document.querySelector(".rating");
const iconElement = document.createElement("I");
console.log(rating)
iconElement.classList.add('fas');
iconElement.classList.add('fa-star');
rating.appendChild(iconElement);