const fetchUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSSdRyrWjjqk2gYGcmXWkyYvD-7AZ4pFse27WLBTs7vTxFZPifwm0lB6ZdsWEy1uM9pgDaL0PbIIX1W/pubhtml?gid=2105850887&single=true'

const fetchPrices = () =>{
    fetch(fetchUrl).then(response => response.text()).then(data => console.log(data))
}
fetchPrices()