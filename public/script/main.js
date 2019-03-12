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
    startMap();
    const ratings = [...document.querySelectorAll(".rating")];
    loadStars(ratings);
} 

function startMap() {
    const ironhackSP = {
        lat: -23.56173216, 
        lng: -46.6623271
      };
    const map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 10,
        center: ironhackSP
      }
    );
  }
  
 