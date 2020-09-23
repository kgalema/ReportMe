

// let btnAdd = document.querySelector("#add")
let table = document.querySelector("table")
let form = document.getElementById("data")
let inputs = document.getElementById("inputs")
let tbody = document.querySelector("tbody")
let data2 = document.getElementById("data2")

let btnRemove = document.getElementById("out")

let panelInput = document.querySelector("#panel")
let quantityInput = document.querySelector("#quantity")
let fieldNumber = 1


function out(e){
    // alert("It works!");
    console.log(e);
    table.removeChild(e);
    // e.currentTarget.parentNode.remove();
    fieldNumber = fieldNumber - 1;
    console.log(fieldNumber);
    // e.preventDefault();
};

function addAnotherField(){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name=blast[${num}][panel] placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="quantity" name=blast[${num}][quantity] placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                    <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    
    table.appendChild(tr);
}

function addAnotherClean(){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name=clean[${num}][panel] placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="quantity" name=clean[${num}][quantity] placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="advance" name=clean[${num}][advance] placeholder="advance" step="0.1" required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;


    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                    
    table.appendChild(tr);
}

function addAnotherSupport(){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name=support[${num}][panel] placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="quantity" name=support[${num}][quantity] placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`

    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                                    
    table.appendChild(tr);
    
}

function active (){
    console.log("active class")
}






