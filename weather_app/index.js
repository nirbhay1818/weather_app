const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoConatiner=document.querySelector(".user-info-container");

// initialize variable
let oldTab=userTab;
const API_KEY="273181371a7ab587fcf4224eb6eba8b8";
oldTab.classList.add("current-tab");
// Ek kaam pending hai?
getfromSessionStorage();


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // is search tab is invisible, if yes then visible
            userInfoConatiner.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main phle search waale tab pr tha ,ab your weather tab visible krna hai
            searchForm.classList.remove("active");
            userInfoConatiner.classList.remove("active");
            // now i'm in your weather tab,so weather to be display,so let's check the local storage
            // first for coordinates,if we have saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    // pass clicked tab as input parameter
    switchTab(searchTab);
})

// check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if local coordinate not prsent
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // make grant access conatiner invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API call
    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoConatiner.classList.add("active");
        // render the data to UI
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // HW
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]"); 

    // fetch the value from weatherinfo object and put it in UI
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert("No Geolocation Available")
    }
}

function showPosition(position){
    const userCoordinate={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    // store the coordinates
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinate));
    // show the coordinates to the UI
    fetchUserWeatherInfo(userCoordinate);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    } 
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoConatiner.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
       const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
       );
       const data=await response.json();
       loadingScreen.classList.remove("active");
       userInfoConatiner.classList.add("active");
       renderWeatherInfo(data);
    }
    catch(err){
        console.log("No data Found");
    }
}