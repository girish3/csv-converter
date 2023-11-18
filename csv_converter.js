const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Define a column mapping from the old CSV file to the new one
const columnMapping = {
  'contact detail': 'contact_number',
  'name': 'name',
  'company': 'company name',

  // Add more column mappings as needed
};

// Create a stream to read the old CSV file
const oldCsv = fs.createReadStream('old.csv');

// Create a CSV writer for the new CSV file
const newCsv = createCsvWriter({
  path: 'new.csv',
  header: Object.values(columnMapping).map(id => ({id, title: id})),
});

// Parse the old CSV file and write the new CSV file
const rows = [];
oldCsv.pipe(csv())
  .on('data', (row) => {
    // Create a new row for the new CSV file using the column mapping
    const newRow = {};
    for (const oldColumn in columnMapping) {
      const newColumn = columnMapping[oldColumn];
      // Trim the column name from the old CSV file
      const trimmedOldColumn = Object.keys(row).find(key => key.trim() === oldColumn);
      if (trimmedOldColumn) {
        newRow[newColumn] = row[trimmedOldColumn].trim();
      }
    }
    rows.push(newRow);
  })
  .on('end', () => {
    // Write the new CSV file
    newCsv.writeRecords(rows);
  });