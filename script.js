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

let cityInput, dateInput, requestURL

function getInput() {
    cityInput = document.getElementById("cityname").value
    dateInput = document.getElementById("date").value
    budgetInput = document.getElementById("budget").value  
    requestURL = url.concat('?apikey=',key,'&locale=*','&',start,'=',dateInput,startTime,'&',end,'=',dateInput,endTime,'&',city,'=',cityInput)
    showResult()
}

function showResult() {
    fetch(requestURL) 
    
    .then(response => response.json())
    
    .then(data => {
        console.log(budgetInput)
        if (budgetInput <= data._embedded.events[0].priceRanges[0].max){
        let eventName = data._embedded.events[0].name
        nameEl.innerHTML = eventName
        let eventDateTime = data._embedded.events[0].dates.start.localDate + " @ " + data._embedded.events[0].dates.start.localTime
        dateEl.innerHTML = eventDateTime
        let eventVenue = data._embedded.events[0]._embedded.venues[0].address.line1
        venueEl.innerHTML = eventVenue
        let eventPrice = data._embedded.events[0].priceRanges[0].min + ' - ' + data._embedded.events[0].priceRanges[0].max + ' ' + data._embedded.events[0].priceRanges[0].currency
        priceEl.innerHTML = eventPrice
        let imageUrl = data._embedded.events[0].images[0].url
        imageEl.src = imageUrl;    
        console.log(data);
    }
    else {
        nameEl.innerHTML = "Sorry we couldn't find something within your budget";
    } 
    
    
    })
}

document.getElementById("searchButton").addEventListener("click", getInput)

