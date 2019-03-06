createStar = () => {
    const iconElement = document.createElement("I");
    iconElement.classList.add('fas');
    iconElement.classList.add('fa-star');
    return iconElement;
}
loadStars = (ratings) => {
    return ratings.forEach(rating => {
        const ratingNumber = Number(rating.textContent);
        rating.innerHTML = '';
        for (let i = 0; i < ratingNumber; i++) {
            rating.appendChild(createStar())
        }
    })
}

window.onload = () => {
    const ratings = [...document.querySelectorAll(".rating")];
    loadStars(ratings);
} 