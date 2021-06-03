'use strict';

const seats = document.querySelector('.cinema-seats').querySelectorAll('.seat'),
  datesDays = document.querySelector('#dates-days'),
  movieSelect = document.querySelector('#set-movie-select'),
  movieInfoBlock = document.querySelector('#movie-info-block'),
  modal = document.querySelector('#right-modal'),
  modalShowBtn = document.querySelector('#modal-show-btn'),
  buyTicketsBtn = document.querySelector('#buy-tickets-btn');

const purchase = {
  seats: '',
  day: '',
  ticketPrice: 500,
  fullPrice() {
    if (this.seats.length !== 0 && this.day.length !== 0) {
      return `${this.ticketPrice * this.seats.length * this.day.length} р.`;
    } else {
      return '-';
    }
  }
};

const updatePurchaseFullPrice = () => {
  const modalTotalPrice = document.querySelector('#modal-total-price');
  modalTotalPrice.textContent = `${purchase.fullPrice()}`;
};


//Make closure for call complete modal only once
const showModalInfoClosure = () => {
  let wasCalled = false;

  return function () {
    if (purchase.seats.length !== 0 &&
      purchase.day.length !== 0 &&
      purchase.cinema !== undefined &&
      purchase.time !== undefined
    ) {
      if (!wasCalled) {
        modal.classList.add('open-modal');
        wasCalled = true;
      }
      buyTicketsBtn.classList.add('active-btn');
    } else {
      modal.classList.remove('open-modal');
      buyTicketsBtn.classList.remove('active-btn');
    }
  };
};

//Modal closure
const showModalInfoComplete = showModalInfoClosure();

//Look seat info on hover and buy seat on click (add info seat in modal)
seats.forEach(seatNum => {
  seatNum.addEventListener('mouseover', (e) => {
    const seatNumber = e.currentTarget.dataset.seatnumber.slice(1);
    const seatRow = e.currentTarget.dataset.seatnumber.slice(0, 1);

    e.currentTarget.append(createSeatTooltip(seatRow, seatNumber));
  });

  seatNum.addEventListener('mouseleave', (e) => {
    e.currentTarget.innerHTML = '';
  });

  seatNum.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('bought-seat');

    const modalBoughtSeats = document.querySelector('#modal-bought-seats');
    const allBoughtSeats = document.querySelectorAll('.bought-seat');

    const allBoughtSeatsNumbers = [...allBoughtSeats].map(seat => {
      return `Ряд ${seat.dataset.seatnumber.slice(0, 1)} Место ${seat.dataset.seatnumber.slice(1)}`;
    });

    purchase.seats = allBoughtSeatsNumbers;

    const createSeatInfo = (i) => {
      const seatInfo = document.createElement('div');
      seatInfo.className = `right-modal__select-info`;
      seatInfo.innerHTML = `
        <p class="right-modal__select-name">${purchase.seats[i]}</p>
        <p class="right-modal__select-text">${purchase.ticketPrice} р.</p>
      `;

      return seatInfo;
    };

    modalBoughtSeats.innerHTML = '';

    purchase.seats.forEach((seat, i) => modalBoughtSeats.append(createSeatInfo(i)));

    updatePurchaseFullPrice();
    showModalInfoComplete();
  });
});

//Create seat tooltip html
const createSeatTooltip = (rowName, seatNum) => {
  const seatTooltop = document.createElement('div');
  seatTooltop.className = 'seat-tooltip';
  seatTooltop.innerHTML = `
  <div class="seat-tooltip__block">
    <p class="seat-tooltip__row">Ряд</p>
    <p class="seat-tooltip__row-name">${rowName}</p>
  </div>
  <div class="seat-tooltip__block">
    <p class="seat-tooltip__seat">Место</p>
    <p class="seat-tooltip__seat-num">${seatNum}</p>
  </div>
  `;

  return seatTooltop;
};

//Single day HTML block
const createDate = (day, dayName, month, fulldata) => {
  const date = document.createElement('div');
  date.className = 'dates__date';
  date.setAttribute('data-day', `${fulldata}`);
  date.innerHTML = `
    <p class="dates__month">${month}</p>
    <div class="dates__number">${day}</div>
    <p class="dates__day">${dayName}</p>
  `;

  return date;
};

//Set day number
const addDays = (days) => {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
};

//Create current day block
const updateDates = (value) => {
  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

  const month = monthNames[addDays(value).getMonth()],
    dayName = dayNames[addDays(value).getDay()],
    day = addDays(value).getDate(),
    fullData = `${day} ${month} ${dayName}`;

  const singleDay = createDate(day, dayName, month, fullData);

  return singleDay;
};

//Make current days for two weeks
const showedDays = 14;
let allDates;

const addDates = () => {
  for (let i = 0; i < showedDays; i++) {
    datesDays.append(updateDates(i));
  }

  allDates = document.querySelectorAll('.dates__date');

  const selectedDaysModal = document.querySelector('#modal-date-selected');

  allDates.forEach(date => {
    date.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('dates-background-change');
      e.currentTarget.classList.toggle('selected-day');

      const selectedDaysBlock = datesDays.querySelectorAll('.selected-day');
      const selectedDaysText = [];

      selectedDaysBlock.forEach(day => {
        selectedDaysText.push(day.dataset.day);
      });

      purchase.day = selectedDaysText;
      selectedDaysModal.innerHTML = purchase.day.join('<br>');

      updatePurchaseFullPrice();
      showModalInfoComplete();
    });
  });
};

addDates();

//Set movie 
const fetchMovieInfo = async (movieNumber) => {
  const fetchInfo = await fetch('js/movies.json');
  const resp = await fetchInfo.json();
  const movieNum = await resp[movieNumber];

  const name = movieNum.Title,
    year = movieNum.Year,
    descr = movieNum.Plot,
    rating = movieNum.imdbRating,
    rated = movieNum.Rated,
    time = movieNum.Runtime,
    genre = movieNum.Genre,
    release = movieNum.Released,
    country = movieNum.Country;

  const info = createMovieInfoHtml(name, year, descr, rating, rated, time, genre, release, country);

  const moviePoster = document.querySelector('#movie-poster');

  switch (name) {
    case 'Taxi Driver':
      movieInfoBlock.style.backgroundImage = 'url(img/taxi-driver.jpg)';
      moviePoster.setAttribute('src', 'img/taxi-driver-poster.jpg');
      break;
    case 'Pulp Fiction':
      movieInfoBlock.style.backgroundImage = 'url(img/pulp-fiction.jpg)';
      moviePoster.setAttribute('src', 'img/pulp-fiction-poster.jpg');
      break;
    case 'The Godfather':
      movieInfoBlock.style.backgroundImage = 'url(img/godfather.jpg)';
      moviePoster.setAttribute('src', 'img/godfather-poster.jpg');
      break;
  }

  movieInfoBlock.innerHTML = '';

  movieInfoBlock.append(info);
};

fetchMovieInfo(0);

//Create movie info html
const createMovieInfoHtml = (name, year, descr, rating, rated, time, genre, release, country) => {
  const movieInfo = document.createElement('div');
  movieInfo.className = 'movie-info__text';
  movieInfo.innerHTML = `
    <h1 class="movie-info__name">${name}</h1>
    <div class="movie-info__release">${year}</div>
    <p class="movie-info__descr">${descr}</p>
    <div class="movie-info__bottom">
      <div class="movie-info__rating">
        <span>IMDb</span>
        <span>${rating}</span>
      </div>
      <div class="movie-info__common">
      ${rated} | ${time} | ${genre} | ${release} (${country})
      </div>
    </div>
  `;

  return movieInfo;
};


// Change movie info by click in select block
movieSelect.addEventListener('change', (e) => {
  switch (e.currentTarget.value) {
    case 'Taxi Driver':
      fetchMovieInfo(0);
      break;
    case 'Pulp Fiction':
      fetchMovieInfo(1);
      break;
    case 'The Godfather':
      fetchMovieInfo(2);
      break;
  }
});

//Right modal info add cinema name and time
const modalTimeSelected = document.querySelector('#modal-time-selected'),
  timeSelect = document.querySelector('#cinema-time-select'),
  modalCinemaSelected = document.querySelector('#modal-cinema-selected'),
  cinemaSelect = document.querySelector('#cinema-select');

timeSelect.addEventListener('change', (e) => {
  purchase.time = e.currentTarget.value;
  modalTimeSelected.textContent = purchase.time;
  showModalInfoComplete();
});

cinemaSelect.addEventListener('change', (e) => {
  purchase.cinema = e.currentTarget.value;
  modalCinemaSelected.textContent = purchase.cinema;
  showModalInfoComplete();
});

//Show modal on click
modalShowBtn.addEventListener('click', () => modal.classList.toggle('open-modal'));


buyTicketsBtn.addEventListener('click', () => {
  console.log('1');
});