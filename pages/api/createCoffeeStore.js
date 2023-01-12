import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {

  if (req.method === "POST") {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;
    try {
      if (id) {
        // Find a record
        const records = await findRecordByFilter(id);

        if (records.length > 0) {
          res.status(200).json(records);
        } else {
          if (name) {
            const newcoffeeStore = await table.create([
              {
                fields: {
                  // Apparament ya besoin du fields pour que airtable puisse identifier les champs
                  id,
                  name,
                  address,
                  neighborhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const createRecord = getMinifiedRecords(newcoffeeStore);
            res.status(201).json({ status: "success", data: createRecord });
          } else {
            res.status(404).json({ message: "name is missing" });
          }
        }
      } else {
        res.status(404).json({ message: "id is missing" });
      }
    } catch (error) {
      console.error("Error creating or finding store", error);
      res
        .status(500)
        .json({ message: "Error creating or finding store", error });
    }
  }
};

export default createCoffeeStore;
