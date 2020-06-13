const API_KEY = "ea831da44208024600c0ab9baef3ffa4";

const clockContainer = document.querySelector(".clock"),
  clockTitle = clockContainer.querySelector("h1"),
  form = document.querySelector(".name-form"),
  input = form.querySelector("input"),
  greetings = document.querySelector(".name-greetings"),
  toDoForm = document.querySelector(".toDoForm"),
  toDoInput = toDoForm.querySelector("input"),
  toDoList = document.querySelector(".toDoList"),
  body = document.querySelector("body"),
  weatherTemp = document.querySelector(".weather-temp"),
  weather = document.querySelector(".weather");

let toDoArray = [];

function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const temperature = json.main.temp;
      const place = json.name;
      const weatherIcon = json.weather[0].icon;
      const currentWeather = json.weather[0].main;
      weather.style.backgroundImage = `url(http://openweathermap.org/img/wn/${weatherIcon}.png)`;
      weatherTemp.innerText = `${currentWeather} ${temperature} @ ${place}`;
      const randomNum = getRandom();
      paintImage(randomNum, currentWeather);
    });
}

const weatherConditions = [
  "Thunderstorm",
  "Drizzle",
  "Rain",
  "Snow",
  "Haze",
  "Clear",
  "Clouds",
];

const USER_KEY = "currentUser",
  SHOWING_ON = "showing",
  TODOS_KEY = "toDos",
  IMG_NUM = 3,
  COORDS = "coords";

function saveName(text) {
  localStorage.setItem(USER_KEY, text);
}

function handleSubmitName(event) {
  event.preventDefault();
  const currentValue = input.value;
  paintGreeting(currentValue);
  saveName(currentValue);
}

function askName() {
  form.classList.add(SHOWING_ON);
  form.addEventListener("submit", handleSubmitName);
}

function paintGreeting(text) {
  form.classList.remove(SHOWING_ON);
  greetings.classList.add(SHOWING_ON);
  greetings.innerText = `Hello ${text}`;
}

function getTime() {
  const date = new Date();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const seconds = date.getSeconds();
  clockTitle.innerText = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function loadName() {
  const currentUser = localStorage.getItem(USER_KEY);
  if (currentUser === null) {
    askName();
  } else {
    paintGreeting(currentUser);
  }
}

function loadToDos() {
  const toDos = localStorage.getItem(TODOS_KEY);
  if (toDos !== null) {
    const parsedToDos = JSON.parse(toDos);
    parsedToDos.forEach((toDo) => {
      paintToDo(toDo.text, toDo.id);
    });
  }
}

function saveToDos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(toDoArray));
}

function paintToDo(text, id = +new Date()) {
  const li = document.createElement("li");
  const delBtn = document.createElement("button");
  const span = document.createElement("span");
  const newId = id;
  delBtn.innerText = "❎";
  delBtn.addEventListener("click", deleteToDo);
  span.innerText = text;
  li.appendChild(delBtn);
  li.appendChild(span);
  li.id = newId;
  toDoList.appendChild(li);
  const toDoObj = {
    text: text,
    id: newId,
  };
  toDoArray.push(toDoObj);
  saveToDos();
}

function handleSubmitToDo(event) {
  event.preventDefault();
  const currentValue = toDoInput.value;
  paintToDo(currentValue);
  toDoInput.value = "";
}

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  toDoList.removeChild(li);
  const cleanToDos = toDoArray.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  toDoArray = cleanToDos;
  saveToDos();
}

function paintImage(imgNum, weatherCondition) {
  const image = new Image();
  if (weatherConditions.includes(weatherCondition)) {
    image.src = `${weatherCondition}/${imgNum + 1}.jpg`;
  } else {
    image.src = `image/${imgNum + 1}.jpg`;
  }
  image.classList.add("bgImage");
  body.appendChild(image);
}

function getRandom() {
  const number = Math.floor(Math.random() * IMG_NUM);
  return number;
}

function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude,
  };
  saveCoords(coordsObj);
  getWeather(latitude, longitude);
}

function handleGeoError() {
  weatherTemp.innerText = "Error!";
}

function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoordsFn() {
  const loadedCoords = localStorage.getItem(COORDS);
  if (loadedCoords === null) {
    askForCoords();
  } else {
    const parseCoords = JSON.parse(loadedCoords);
    getWeather(parseCoords.latitude, parseCoords.longitude);
  }
}

function init() {
  getTime();
  setInterval(getTime, 1000);
  loadName();
  loadToDos();
  toDoForm.addEventListener("submit", handleSubmitToDo);
  loadCoordsFn();
}

init();
