let loadedData
    ,dupCheckFlag = null

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:1401/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data))
    loadHTMLTable([])
})

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id)
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id)
    }
    // if (event.target.className === "goCheck") {
    //     handleEditRow(event.target.dataset.id)
    // }
})

const updateBtn = document.querySelector('#update-row-btn')

function deleteRowById(id) {
    fetch('http://localhost:1401/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload()
        }
    })
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row')
    updateSection.hidden = false
    document.querySelector('#update-name-input').dataset.id = id
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input')

    fetch('http://localhost:1401/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload()
        }
    })
}


const addBtn = document.querySelector('#add-name-btn')

addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input')
    const name = nameInput.value.replace(/'|;|--|,|-/g, '')
    nameInput.value = ""

    // 이름 중복체크 로직
    let arrExtName = []    
    if(name=='' || name == null|| name==undefined){
        alert('확장자명을 입력해주세요')
        throw '확장자명을 입력해주세요'
    }
    
    function dupCheck(name){
        if(loadedData){
            if(loadedData.length == 200){
                alert('확장자는 최대 200개까지 차단할 수 있습니다.')
                throw 'Only 200 extensions can banned'
            }
            for( let i = 0; i<loadedData.length; i++){
                arrExtName.push(loadedData[i].FW_EXT_NAME)
            }
        }

        if(arrExtName.includes(name)){
            alert('This Extension is Already Banned !')
            dupCheckFlag = 1
            throw 'This Extension is Already Banned !'
        }
    }

    try{
        dupCheck(name)

        if(dupCheckFlag == null){
            fetch('http://localhost:1401/insert', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ 
                    name : name
                })
            })
            .then(response => response.json())
            .then(data => insertRowIntoTable(data['data']))
    
            location.reload()
        }
    }catch(e) {
        location.reload()
        console.error(e)
    }
}


function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody')
    const isTableData = table.querySelector('.no-data')

    let tableHtml = "<tr>"

    for (var key in data) {
        // console.log('여기는 데이터', data)
        // console.log('여기는 키', key)
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString()
            }
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml
    } else {
        const newRow = table.insertRow()
        newRow.innerHTML = tableHtml
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody')
 
    if (data['data']?.length == 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        for(let i = 0; i < data['checkboxData']?.length; i++){
            data['checkboxData'][i]?.FIXED_EXT_VALUE == "Y" ? (document.getElementById(`${data['checkboxData'][i]?.FIXED_EXT_NAME}`).setAttribute("checked", true), document.getElementById(`${data['checkboxData'][i]?.FIXED_EXT_NAME}`).setAttribute("value", "Y")) : document.getElementById(`${data['checkboxData'][i]?.FIXED_EXT_NAME}`).setAttribute("aria-checked", false);
        }
        return
    }
  
    
    let tableHtml = ""
        ,loadedCount
    loadedData = data['data']
    loadedData?.length == undefined ? loadedCount = 0 : loadedCount = loadedData.length;

    document.getElementById("loadedCount").innerHTML = `차단된 확장자 개수: ${loadedCount}/200`

    if(data['checkboxData']){
        for(let i = 0; i < data['checkboxData']?.length; i++){
            data['checkboxData'][i]?.FIXED_EXT_VALUE == "Y" ? (document.getElementById(`${data['checkboxData'][i]?.FIXED_EXT_NAME}`).setAttribute("checked", true), document.getElementById(`${data['checkboxData'][i]?.FIXED_EXT_NAME}`).setAttribute("value", "Y")) : document.getElementById(`${data['checkboxData'][i]?.FIXED_EXT_NAME}`).setAttribute("aria-checked", false);
        }
    }

    data['data']?.forEach(function ({SYS_ID, FW_EXT_NAME, SYS_MODIFY_DATE}) {
        tableHtml += "<tr>";
        // tableHtml += `<td>${SYS_ID}</td>`;
        tableHtml += `<td>${FW_EXT_NAME}</td>`;
        // tableHtml += `<td>${SYS_MODIFY_DATE}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${SYS_ID}>Delete</td>`;
        // tableHtml += `<td><button class="edit-row-btn" data-id=${SYS_ID}>Edit</td>`;
        tableHtml += "</tr>";
    })

    table.innerHTML = tableHtml
}




// checkbox
const batBtn = document.querySelector("#bat")
const cmdBtn = document.querySelector("#cmd")
const comBtn = document.querySelector("#com")
const cplBtn = document.querySelector("#cpl")
const exeBtn = document.querySelector("#exe")
const scrBtn = document.querySelector("#scr")
const jsBtn = document.querySelector("#js")

batBtn.onclick = function () {    
    batBtn.value == 'on' ? batBtn.value = 'Y' : batBtn.value == 'Y' ? batBtn.value = 'N' : batBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : batBtn.id,
            value: batBtn.value
        })
    })
    .then(response => response.json())
}

cmdBtn.onclick = function () {    
    cmdBtn.value == 'on' ? cmdBtn.value = 'Y' : cmdBtn.value == 'Y' ? cmdBtn.value = 'N' : cmdBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : cmdBtn.id,
            value: cmdBtn.value
        })
    })
    .then(response => response.json())
}

comBtn.onclick = function () {    
    comBtn.value == 'on' ? comBtn.value = 'Y' : comBtn.value == 'Y' ? comBtn.value = 'N' : comBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : comBtn.id,
            value: comBtn.value
        })
    })
    .then(response => response.json())
}

cplBtn.onclick = function () {    
    cplBtn.value == 'on' ? cplBtn.value = 'Y' : cplBtn.value == 'Y' ? cplBtn.value = 'N' : cplBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : cplBtn.id,
            value: cplBtn.value
        })
    })
    .then(response => response.json())
}

exeBtn.onclick = function () {    
    exeBtn.value == 'on' ? exeBtn.value = 'Y' : exeBtn.value == 'Y' ? exeBtn.value = 'N' : exeBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : exeBtn.id,
            value: exeBtn.value
        })
    })
    .then(response => response.json())
}

scrBtn.onclick = function () {    
    scrBtn.value == 'on' ? scrBtn.value = 'Y' : scrBtn.value == 'Y' ? scrBtn.value = 'N' : scrBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : scrBtn.id,
            value: scrBtn.value
        })
    })
    .then(response => response.json())
}

jsBtn.onclick = function () {    
    jsBtn.value == 'on' ? jsBtn.value = 'Y' : jsBtn.value == 'Y' ? jsBtn.value = 'N' : jsBtn.value ='Y' 
    fetch('http://localhost:1401/insertFixed', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : jsBtn.id,
            value: jsBtn.value
        })
    })
    .then(response => response.json())
}