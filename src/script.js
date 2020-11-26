
import "regenerator-runtime/runtime";
import Swiper, { Navigation, Pagination } from 'swiper'
import 'swiper/swiper-bundle.css'
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

const BUTTON_TEXT = "Change event"

let cityInput, dateInput, budgetInput, requestURL

function getInput() {
  cityInput = document.getElementById("cityname").value
  dateInput = document.getElementById("date").value
  budgetInput = document.getElementById("budget").value || 0 
  requestURL = url.concat('?apikey=', key, '&locale=*', '&', start, '=', dateInput, startTime, '&', end, '=', dateInput, endTime, '&', city, '=', cityInput)
  showResult()
}

const findMinMaxPrice = (prices) => {
  const minPrices = prices.map(price =>  price.min)
  const minPrice = minPrices.sort()[0]
  const maxPrices = prices.map(price => price.max) 
  const maxPrice = maxPrices.sort()[maxPrices.length - 1]   
  return {minPrice, maxPrice}  
}


async function showResult() {
  await fetch(requestURL)
    .then(response => response.json())
    .then(data => {
      const events = data._embedded.events;
      events.forEach(event => {
        if (!event) return
        
        console.log(event)
        //Template content
        const eventTemplate = document.querySelector("#eventTemplate")
        const eventContent = document.querySelector("#eventContent")        
        const cloneTemplate = eventTemplate.content.cloneNode(true)

        //Template elements
        const image = cloneTemplate.querySelector("#image")
        const eventCard = cloneTemplate.querySelector(".eventCard")
        const eventName = cloneTemplate.querySelector("#eventname") 
        const eventDateTime = cloneTemplate.querySelector("#eventdatetime")
        const eventVenue = cloneTemplate.querySelector("#eventvenue")
        const eventPrice = cloneTemplate.querySelector("#eventprice")
        const templateA = cloneTemplate.querySelector("#a")   
             

        
        const {priceRanges, name, dates, images, _embedded, url} = event;

        if (!priceRanges && !name && !dates && !images && !_embedded && !url) return        
        const {minPrice, maxPrice} = findMinMaxPrice(priceRanges)

        if (budgetInput >= minPrice) {   
          
          const imageUrl = event.images[0].url
          image.src = imageUrl;
          eventCard.appendChild(image)

          eventName.innerText = name
          eventCard.appendChild(eventName)        
          
          const startDateTime = `${dates.start.localDate} @ ${dates.start.localTime}`
          eventDateTime.innerHTML = startDateTime
          eventCard.appendChild(eventDateTime)

        
         const venue = _embedded.venues[0].name
         eventVenue.innerHTML = venue
         eventCard.appendChild(eventVenue)

          const price = minPrice + ' - ' + maxPrice + ' ' + priceRanges[0].currency
          eventPrice.innerHTML = price
          eventCard.appendChild(eventPrice)
          
         
          templateA.href = url
          eventCard.appendChild(templateA)        
          
                   
          cloneTemplate.appendChild(eventCard)
          eventContent.appendChild(cloneTemplate)

        }

      });  
      
  });
  swiper.update()
    
} 

document.getElementById("searchButton").addEventListener("click", getInput)







