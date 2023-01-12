export const fetcher = async (url) =>{
    const response =  await fetch(url)
    const coffeeStoreData = await response.json()
    return coffeeStoreData
}