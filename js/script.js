'use strict';

const seats = document.querySelectorAll('.cinema-row__single'),
  datesDays = document.querySelector('#dates-days'),
  movieSelect = document.querySelector('#set-movie-select'),
  movieInfoBlock = document.querySelector('#movie-info-block');


seats.forEach(row => {
  const rowSeats = row.querySelectorAll('.seat');

  rowSeats.forEach((seatNum, i) => {
    seatNum.addEventListener('mouseover', (e) => {
      const seatNumber = i + 1;
      const seatRow = e.currentTarget.parentElement.dataset.rowname;
      e.currentTarget.append(createSeatTooltip(seatRow, seatNumber));
    });

    seatNum.addEventListener('mouseleave', (e) => {
      e.currentTarget.innerHTML = '';
    });

    

    seatNum.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('bought-seat');

      // const selectedSeats = [];
      // if (e.currentTarget.classList.contains('bought-seat')) {
      //   const seatNumber = i + 1;
      //   const seatRow = e.currentTarget.parentElement.dataset.rowname;

      //   const boughtSeatNumber = `Ряд ${seatRow} Место ${seatNumber}`;
      //   selectedSeats.push(boughtSeatNumber)
      // }

    });
  });
});

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
    // fullData = addDays(value).toISOString().split('T')[0];
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

      selectedDaysModal.innerHTML = selectedDaysText.join('<br>');
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

//Right modal info 
const modalTimeSelected = document.querySelector('#modal-time-selected'),
  timeSelect = document.querySelector('#cinema-time-select'),
  modalCinemaSelected = document.querySelector('#modal-cinema-selected'),
  cinemaSelect = document.querySelector('#cinema-select');

timeSelect.addEventListener('change', (e) => modalTimeSelected.textContent = e.currentTarget.value);
cinemaSelect.addEventListener('change', (e) => modalCinemaSelected.textContent = e.currentTarget.value);