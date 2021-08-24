export async function getAllEntries() {
    const response = await fetch('/api/database');
    return await response.json();
}

export async function getDepartments() {
    const response = await fetch('/api/department');
    return await response.json();
}

export async function postDepartment(index){
    const response = await fetch("/api/chosendepartment/" + index, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function postTempWC(wc){
    const response = await fetch("/api/selectedprocess/" + wc, {
        method: "POST",
        headers:{'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function getExcludes(){
    const response = await fetch("/api/getexcludes");
    return await response.json();
}

export async function getWCs(){
    const response = await fetch('/api/getWC');
    return await response.json();
}

export async function postWC(index){
    const response = await fetch("/api/chosenwc/" + index, {
        method: "POST",
        headers:  {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function deleteEntry(data, email) {
    const dtcStr = data.DowntimeCode;
    const response = await fetch('/api/database/del/' + dtcStr + '/' + email, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function editEntry(index,data, email) {
    const response = await fetch('/api/database/editdesc/' + index +'/'+ data + '/' + email, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function addEntry(index, DTL3, DESC, email) {
    const dtcStr = index.DowntimeCode;
    const response = await fetch('/api/database/add/' + dtcStr + '/' + DTL3 + '/' + DESC + '/' + email, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function addSubGroup(TYP, DTL2, DTL3, FLTR, EXCL, DESC, email) {
    const response = await fetch('/api/database/add/' + TYP + '/' + DTL2 + '/' + DTL3 + '/' + FLTR + '/' + EXCL + '/' + DESC + '/' + email, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}

export async function userStatCheck() {
    const response = await fetch("/api/user")
    return await response.json();
}

export async function userLogOn(password) {
    const response = await fetch("/api/logon/" + password, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    })
    return await response.json();
}