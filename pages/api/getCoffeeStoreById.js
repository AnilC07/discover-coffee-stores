import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length > 0) {
        res.status(200).json(records);
      } else {
        res.status(200).json({
          message: `${id} could not be found`,
        });
      }
    } else {
      res.status(400).json({
        statu: "failed",
        message: `id is missing`,
      });
    }
  } catch (error) {
    res.status(500).json({
      statu: "failed",
      message: "no data available",
    });
  }
};

export default getCoffeeStoreById;
