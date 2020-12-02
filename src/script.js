
import "regenerator-runtime/runtime";
import Swiper, { Navigation, Pagination } from 'swiper'
import 'swiper/swiper-bundle.css'
import { getWeatherInput, suggestion, weatherParagraph } from "./weather";
Swiper.use([Navigation, Pagination])

const swiper = new Swiper(".swiper-container", {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})

const key = 'w5dwwGRRzGs6AgSz3teXnfI2FrdVGLdl'
const url = 'https://app.ticketmaster.com/discovery/v2/events'
const start = 'startDateTime'
const startTime = 'T00:00:00Z'
const end = 'endDateTime'
const endTime = 'T23:59:00Z'
const city = 'city'

const eventTemplate = document.querySelector("#eventTemplate");
const eventContent = document.querySelector("#eventContent");

const result = document.getElementById("result");

function getInput() {
  const cityInput = document.getElementById("cityname").value;
  const dateInput = document.getElementById("date").value;
  
  const budgetInput = document.getElementById("budget").value || 0;
  const requestURL = url.concat('?apikey=', key, '&locale=*', '&', start, '=', dateInput, startTime, '&', end, '=', dateInput, endTime, '&', city, '=', cityInput);



  if (!cityInput) {
    document.getElementById("cityname").classList = "shake";
    document.getElementById("cityname").placeholder = "Please enter location";
  }
  
  if (!budgetInput) {
    document.getElementById("budget").classList = "shake";
    document.getElementById("budget").placeholder = "Please enter budget";
  }

  if (!dateInput) {
    document.getElementById("date").classList = "shake";
  }

  else if (cityInput && budgetInput && dateInput) {
    showResult(budgetInput, requestURL);
  }
}

const findMinMaxPrice = (prices) => {
  const minPrices = prices.map(price => price.min)
  const minPrice = minPrices.sort()[0]
  const maxPrices = prices.map(price => price.max)
  const maxPrice = maxPrices.sort()[maxPrices.length - 1]
  return { minPrice, maxPrice }
}

async function convertEventsToArray(data) {
  const events = [];

  if (data._embedded && data._embedded.events) {
    data._embedded.events.forEach(singleEvent => {
      if (!singleEvent) return;

      const { priceRanges, name, dates, images, _embedded } = singleEvent;
      if (!priceRanges || !name || !dates || !images || !_embedded) return;

      events.push(singleEvent);
    });
  }

  return events;
}

async function filterEventsByBudget(events, budget) {
  const eventsInTheBudget = [];

  events.forEach(singleEvent => {
    const { minPrice } = findMinMaxPrice(singleEvent.priceRanges);

    if (minPrice > budget) {
      return;
    }

    return eventsInTheBudget.push(singleEvent);
  });

  return eventsInTheBudget;
}

function clearPreviousSearch() {
  eventContent.innerHTML = ""
  suggestion.innerHTML = ""
  weatherParagraph.innerHTML = ""

}

async function presentOnScreen(eventsInTheBudget) {
  clearPreviousSearch()

  if (eventsInTheBudget.length <= 0) {
    getWeatherInput();
  } else {
    eventsInTheBudget.forEach(eventToPresent => {
      const { priceRanges, name, dates, images, _embedded, url } = eventToPresent;
      const { minPrice, maxPrice } = findMinMaxPrice(priceRanges);      
      const cloneTemplate = eventTemplate.content.cloneNode(true);

      const image = cloneTemplate.querySelector("#image");
      const eventCard = cloneTemplate.querySelector(".eventCard");
      const eventName = cloneTemplate.querySelector("#eventname");
      const eventDateTime = cloneTemplate.querySelector("#eventdatetime");
      const eventVenue = cloneTemplate.querySelector("#eventvenue");
      const eventPrice = cloneTemplate.querySelector("#eventprice");
      const templateA = cloneTemplate.querySelector("#a");

      const imageUrl = images[2].url;
      image.src = imageUrl;
      eventCard.appendChild(image);

      eventName.innerText = name;
      eventCard.appendChild(eventName);

      const startDateTime = `${dates.start.localDate} @ ${dates.start.localTime}`;
      eventDateTime.innerHTML = startDateTime;
      eventCard.appendChild(eventDateTime);

      const venue = _embedded.venues[0].name;
      eventVenue.innerHTML = venue;
      eventCard.appendChild(eventVenue);

      const price = minPrice + ' - ' + maxPrice + ' ' + priceRanges[0].currency;
      eventPrice.innerHTML = price;
      eventCard.appendChild(eventPrice);
      
      templateA.href = url
      eventCard.appendChild(templateA)    
      
      cloneTemplate.appendChild(eventCard);
      eventContent.appendChild(cloneTemplate);
    });
  }
}

async function showResult(budget, requestURL) {
  await fetch(requestURL)
    .then(response => response.json())
    .then(rawDataAsJSON => convertEventsToArray(rawDataAsJSON))
    .then(events => filterEventsByBudget(events, budget))
    .then(eventsInTheBudget => presentOnScreen(eventsInTheBudget));

  result.className = "bottomsection";
  result.scrollIntoView({behavior: "smooth"})
  swiper.update();
}

document.getElementById("searchButton").addEventListener("click", getInput)







