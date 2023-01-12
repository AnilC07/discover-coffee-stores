import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {

  if (req.method === "PUT") {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);


        if (records.length > 0) {
            const record = records[0];
            const calculateVoting = parseInt(record.voting) +1
            
            // update a record 
            const updateRecord = await table.update([{
                id:record.recordId,
                fields:{
                    voting:calculateVoting
                }
            }])

            if(updateRecord){
                const minifiedRecord = getMinifiedRecords(updateRecord)
                res.json({minifiedRecord})
            }

          res.status(200).json(records);
        }else{
            res.status(500).json({ message: "coffee store does not exist" });
        }
        // res.json({ message: `this works ${id}` });
      } else {
        res.status(400).json({ message: "id is missing" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
