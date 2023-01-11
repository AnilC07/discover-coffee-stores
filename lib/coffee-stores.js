import { createApi } from "unsplash-js";

// Fournit par la documentation de unsplash
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

// C'est pour Foursquare
const dataFetchUrl = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}&v=20210525&limit=${limit}`;
};

const getListOfCoffeStores = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "café",
    page: 1,
    perPage: 40,
  });
  const unsplashResults = photos.response.results; // On obtient un tableau
  // Retourne toutes les images de taille small pour chaques resultats
  return unsplashResults.map((result) => {
    return result.urls.small;
  });
};

export const fetchCoffeeStores = async (latLong = "48.8784811455714,2.2948473390590762", limit = 6) => {
    // Récupere les photos qui sont retourner par la fonction
  const photos = await getListOfCoffeStores();

  // Config des options pour le fetch
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };
  // Attend le retour de la reponse
  const response = await fetch(
    dataFetchUrl(latLong, "café", limit),
    options
  );
  // Attend de remplir data avec les inforations
  const data = await response.json();
  // Renvoi les informations dans un objet
  return data.results.map((result, index) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.formatted_address,
      imgUrl: photos.length > 0 ? photos[index] : null
    };
  });
};
