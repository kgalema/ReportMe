

// let btnAdd = document.querySelector("#add")
let table = document.querySelector("table")
let form = document.getElementById("data")
let inputs = document.getElementById("inputs")
let tbody = document.querySelector("tbody")
let data2 = document.getElementById("data2")

let panelInput = document.querySelector("#panel")
let quantityInput = document.querySelector("#quantity")
let fieldNumber = 1


function addAnotherField(){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;

    let newField = `<tr>
                    <td class="form-row">
                        <input type="text" id="panel" name=blast[${num}][panel] placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="quantity" name=blast[${num}][quantity] placeholder=${quantityInput.placeholder} required>
                    </td>
                    </tr>`;


    // inputs.innerHTML += newField;
    table.innerHTML = table.innerHTML + newField;
    // inputs.innerHTML = inputs.innerHTML + newField; 
}

function addAnotherClean(){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;

    let newField = `<tr>
                        <td class="form-row">
                            <input type="text" id="panel" name=clean[${num}][panel] placeholder=${panelInput.placeholder} required>
                        </td>

                        <td class="form-row">
                            <input type="number" id="quantity" name=clean[${num}][quantity] placeholder=${quantityInput.placeholder} required>
                        </td>

                        <td class="form-row">
                            <input type="number" id="advance" name=clean[${num}][advance] placeholder="advance" step="0.1" required>
                        </td>
                    </tr>`;


    table.innerHTML = table.innerHTML + newField;
}

function addAnotherSupport(){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber

    let newField = `<tr>
                        <td class="form-row">
                            <input type="text" id="panel" name=support[${num}][panel] placeholder=${panelInput.placeholder} required>
                        </td>

                        <td class="form-row">
                            <input type="number" id="quantity" name=support[${num}][quantity] placeholder=${quantityInput.placeholder} required>
                        </td>
                    </tr>`


    table.innerHTML = table.innerHTML + newField;
}

function active (){
    console.log("active class")
}






