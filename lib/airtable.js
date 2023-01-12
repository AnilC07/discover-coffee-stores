const Airtable = require("airtable");
const base = new Airtable({ apiKey: "keykLQmDfsLiLOI4I" }).base(
  "appf6nFaBj3BmQle1"
);

export const table = base("coffee-stores");


export const getMinifiedRecord = (record) => {
  return { recordId: record.id, ...record.fields };
};

export const getMinifiedRecords = (records) => {
  return records.map((record) => getMinifiedRecord(record));
};

export const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecord);
};
