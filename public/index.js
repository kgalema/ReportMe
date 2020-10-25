

// let btnAdd = document.querySelector("#add")
// let table = document.querySelector("table")
// let form = document.getElementById("data")
// let inputs = document.getElementById("inputs")
// let tbody = document.querySelector("tbody")
// let data2 = document.getElementById("data2")

// let btnRemove = document.getElementById("out")

// let panelInput = document.querySelector("#panel")
// let quantityInput = document.querySelector("#quantity")
// let fieldNumber = 1


// function out(e){
//     // alert("It works!");
//     console.log(e);
//     table.removeChild(e);
//     // e.currentTarget.parentNode.remove();
//     fieldNumber = fieldNumber - 1;
//     console.log(fieldNumber);
//     // e.preventDefault();
// };

// function addAnotherField(){
//     fieldNumber = fieldNumber + 1;
//     let num = fieldNumber;

//     let newField = `<td class="form-row">
//                         <input type="text" id="panel" name=blast[${num}][panel] placeholder=${panelInput.placeholder} required>
//                     </td>

//                     <td class="form-row">
//                         <input type="number" id="quantity" name=blast[${num}][quantity] placeholder=${quantityInput.placeholder} required>
//                     </td>

//                     <td class="form-row">
//                     <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
//                     </td>`;

//     let tr = document.createElement("tr");
//     tr.innerHTML = newField;

    
//     table.appendChild(tr);
// }

// function addAnotherClean(){
//     fieldNumber = fieldNumber + 1;
//     let num = fieldNumber;

//     let newField = `<td class="form-row">
//                         <input type="text" id="panel" name=clean[${num}][panel] placeholder=${panelInput.placeholder} required>
//                     </td>

//                     <td class="form-row">
//                         <input type="number" id="quantity" name=clean[${num}][quantity] placeholder=${quantityInput.placeholder} required>
//                     </td>

//                     <td class="form-row">
//                         <input type="number" id="advance" name=clean[${num}][advance] placeholder="advance" step="0.1" required>
//                     </td>

//                     <td class="form-row">
//                         <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
//                     </td>`;


//     let tr = document.createElement("tr");
//     tr.innerHTML = newField;     
                    
//     table.appendChild(tr);
// }

// function addAnotherSupport(){
//     fieldNumber = fieldNumber + 1;
//     let num = fieldNumber

//     let newField = `<td class="form-row">
//                         <input type="text" id="panel" name=support[${num}][panel] placeholder=${panelInput.placeholder} required>
//                     </td>

//                     <td class="form-row">
//                         <input type="number" id="quantity" name=support[${num}][quantity] placeholder=${quantityInput.placeholder} required>
//                     </td>

//                     <td class="form-row">
//                         <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
//                     </td>`

//     let tr = document.createElement("tr");
//     tr.innerHTML = newField;     
                                    
//     table.appendChild(tr);
    
// }

// function active (){
//     console.log("active class")
// }


//======================Solution====================



//==================The Solution====================
let fieldNumber = 1;
let panelInput = document.querySelector("#panel");
let quantityInput = document.querySelector("#length");
let coyNumber = document.querySelector("#coyNumber");
let gl = document.querySelector("#LHDnumber");
let tbody = document.querySelector("tbody");

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++){
    coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

function out(e){
    e.parentNode.removeChild(e);
};

function addAnotherField(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);


    let newField = `<td class="form-row">
                      <input type="text" id="panel" name="production[blast][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                      <input type="number" id="length" name="production[blast][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                    <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;

    let tr = document.createElement("tr");
    tr.innerHTML = newField;

  
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherClean(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[clean][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="length" name="production[clean][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="advance" name="production[clean][${num}][cleanedAdvance]" placeholder="advance" step="0.1" required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;


    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                    
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherSupport(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[support][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="length" name="production[support][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`

    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                                    
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherDrilled(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[drill][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="length" name="production[drill][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`

    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                                    
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherPrepared(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[prep][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="length" name="production[prep][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`

    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                                    
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}


function addAnotherNC(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[notClean][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="length" name="production[notClean][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`

    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                                    
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}


function addAnotherLHD(e){
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body =(e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="coyNumber" name="production[LHD][${num}][coyNumber]" placeholder=${coyNumber.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="text" id="LHDnumber" name="production[LHD][${num}][LHDnumber]" placeholder=${gl.placeholder} required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`

    let tr = document.createElement("tr");
    tr.innerHTML = newField;     
                                    
    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}




