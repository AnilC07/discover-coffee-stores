import { createApi } from 'unsplash-js';


const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,

});


const dataFetchUrl = (latLong, query, limit) =>{
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}

const getListOfCoffeStores = async () => {
    const photos = await unsplash.search.getPhotos({
        query:'coffee shop',
        page:1,
        perPage:30,
    })
    const unsplashResults = photos.response.results
    return unsplashResults.map(result=>{
        return result.urls.small
    })
}

export const fetchCoffeeStores = async () =>{
    const photos = await getListOfCoffeStores()
    const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: process.env.FOURSQUARE_API_KEY
        },
      };
      const response = await fetch(
        dataFetchUrl("48.890303281324044%2C2.305135311004293","massage",6),
        options
      );
      const data = await response.json();
      return data.results.map((result,index) =>{
        return {...result, imgUrl: photos[index]}        
      })
      
}