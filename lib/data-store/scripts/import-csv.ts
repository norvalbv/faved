import { importCSVData } from '../utils/csv-import'

async function main() {
  const csvPath = process.argv[2]
  if (!csvPath) {
    console.error('Please provide the path to the CSV file')
    process.exit(1)
  }

  try {
    const count = await importCSVData(csvPath)
    console.log(`Successfully imported ${count} records`)
  } catch (error) {
    console.error('Error importing CSV:', error)
    process.exit(1)
  }
}

main() 