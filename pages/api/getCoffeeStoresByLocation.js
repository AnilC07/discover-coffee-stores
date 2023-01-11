import { fetchCoffeeStores } from "../../lib/coffee-stores";


const getCoffeeStoresByLocation = async (req,res) =>{
try {
    const {latLong, limit} = req.query
    // console.log(latLong, limit)
    //configure latLong and limit
    const response = await fetchCoffeeStores(latLong, limit);

    //return something
    res.status(200).json({response})
} catch (error) {
    console.log('There is an error', error)
    res.status(500).json({
        message: 'Something went wrong'
    })
}

}

export default getCoffeeStoresByLocation