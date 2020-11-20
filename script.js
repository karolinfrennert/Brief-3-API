const key = 'w5dwwGRRzGs6AgSz3teXnfI2FrdVGLdl'
const url = 'https://app.ticketmaster.com/discovery/v2/events'
const start = 'startDateTime'
const startTime = 'T00:00:00Z'
const end = 'endDateTime'
const endTime = 'T23:59:00Z'
const city = 'city'

let imageEl = document.getElementById("image")
let nameEl = document.getElementById("eventname")
let dateEl = document.getElementById("eventdatetime")
let venueEl = document.getElementById("eventvenue")
let priceEl = document.getElementById("eventprice")
let button = document.getElementById("button")








let cityInput, dateInput, requestURL

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


function showResult() {
  fetch(requestURL)
    .then(response => response.json())
    .then(data => {
      const events = data._embedded.events;
      events.forEach(event => {
        if (!event) return
        
        //Template content
        const eventTemplate = document.querySelector("#eventTemplate")
        const eventContent = document.querySelector("#eventContent")
        const cloneTemplate = eventTemplate.content.cloneNode(true)

        //Template elements
        const image = cloneTemplate.querySelector("#image")
        const eventName = cloneTemplate.querySelector("#eventname") 
        const eventDateTime = cloneTemplate.querySelector("#eventdatetime")
        const eventVenue = cloneTemplate.querySelector("#eventvenue")
        const eventPrice = cloneTemplate.querySelector("#eventprice")
        const templateButton = cloneTemplate.querySelector("#button")

        const {priceRanges, name, dates, images, venues, address} = event;

        if (!priceRanges && !name && !dates && !images && !venues && !address?.venues) return

        console.log({priceRanges, name, dates, images})
        const {minPrice, maxPrice} = findMinMaxPrice(priceRanges);
        if (budgetInput >= minPrice) {   
          
          const imageUrl = event.images[0].url
          image.src = imageUrl;
          cloneTemplate.appendChild(image)

          eventName.innerText = name
          cloneTemplate.appendChild(eventName)        
          
          const startDateTime = `${start.localDate} @ ${start.localTime}`
          eventDateTime.innerHTML = startDateTime
          cloneTemplate.appendChild(eventDateTime)

        /*console.log(venue)
         const venue = venues.address.line1
         eventVenue.innerHTML = venue*/

          const price = minPrice + ' - ' + maxPrice + ' ' + priceRanges.currency
          eventPrice.innerHTML = price
          cloneTemplate.appendChild(eventPrice)

          
          eventContent.appendChild(cloneTemplate)
        }

      });

      
     
  });
  
}



  

document.getElementById("searchButton").addEventListener("click", getInput)



//Create button to change event
/*const changeButton = document.createElement("button");
changeButton.innerText = "Hey I'm a button";
button.appendChild(changeButton);

changeInnerText = () => {
  changeButton.innerText = "Hey you clicked me";
  changeButton.classList.add("button");
}

changeButton.addEventListener('click', changeInnerText);*/


