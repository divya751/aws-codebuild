export default function addColumnsIfMissing(rows, defaultColumns) {
    if (!rows || !defaultColumns) {
        return
    }

    //add union of all columns for all rows, including union of props
    const columns = new Set();
    for (const row of rows) {
        for (const column of Object.keys(row)) {
            columns.add(column)
        }
    }

    //populate empty contents if content not present for row
    for (const row of rows) {
        for (const col of (new Set([...columns, ...defaultColumns]))) {
            if (!row[col]) row[col] = ""
        }
    }
}