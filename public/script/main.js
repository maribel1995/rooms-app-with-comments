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
  startMap();
} 

 startMap = () => {
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

    const bounds = new google.maps.LatLngBounds();

    const getRooms = () =>{
      axios.get("/api/rooms")
      .then(response => {
        mapRooms(response.data.rooms)
      })
      .catch(error => {
        console.log(error)
      })
    };

    

    const mapRooms = (rooms) => {
      rooms.forEach(room => {
        const roomLocation = {
          lat: room.location.coordinates[1],
          lng: room.location.coordinates[0]
        };
        bounds.extend(roomLocation);

        new google.maps.Marker({
          position: roomLocation,
          map: map,
          title: room.name
        });
      });
      map.fitBounds(bounds);
    }

    getRooms();
  }


  
 