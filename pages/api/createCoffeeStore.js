import { getMinifiedRecords, table } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  console.log(req.method)
  if (req.method === "POST") {
    const { id, name, address, neighborhood, voting, imgUrl } = req.body;
    try {
      if (id) {
        // Find a record
        const findCoffeeStoreRecord = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        if (findCoffeeStoreRecord.length !== 0) {
          const coffee = getMinifiedRecords(findCoffeeStoreRecord);
          res.status(200).json(coffee);
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
