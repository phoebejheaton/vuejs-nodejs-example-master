export async function getAllEntries() {
    const response = await fetch('/api/database');
    return await response.json();
}

export async function createEntry(data) {
    const response = await fetch(`/api/entry`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({entry: data})
      })
    return await response.json();
}

export async function deleteEntry(data) {
    const dtcStr = data.DowntimeCode;
    const response = await fetch('/api/database/del/' + dtcStr, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function editEntry(index,data) {
    const response = await fetch('/api/database/editdesc/' + index +'/'+ data, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function addEntry(index, DTL3, DESC) {
    const dtcStr = index.DowntimeCode;
    const response = await fetch('/api/database/add/' + dtcStr + '/' + DTL3 + '/' + DESC, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function addSubGroup(TYP, DTL2, DTL3, FLTR, EXCL, DESC) {
    const response = await fetch('/api/database/add/' + TYP + '/' + DTL2 + '/' + DTL3 + '/' + FLTR + '/' + EXCL + '/' + DESC, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}