//==================The Solution to Dynamic form====================
let fieldNumber = 1;
let panelInput = document.querySelector("#panel");
let quantityInput = document.querySelector("#length");
let coyNumber = document.querySelector("#coyNumber");
let gl = document.querySelector("#LHDnumber");
let tbody = document.querySelector("tbody");

const coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    });
}

function out(e) {
    e.parentNode.removeChild(e);
};

function addAnotherField(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);


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

function addAnotherClean(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

    let newField = `<td class="form-row">
                        <input type="text" id="panel" name="production[clean][${num}][panel]" placeholder=${panelInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="length" name="production[clean][${num}][length]" placeholder=${quantityInput.placeholder} required>
                    </td>

                    <td class="form-row">
                        <input type="number" id="advance" name="production[clean][${num}][advance]" placeholder="advance" step="0.1" required>
                    </td>

                    <td class="form-row">
                        <a href="#" onclick="out(this.parentNode.parentNode)" id="out">Delete</a>
                    </td>`;


    let tr = document.createElement("tr");
    tr.innerHTML = newField;

    body.appendChild(tr);
    e.style.maxHeight = e.scrollHeight + "px";
}

function addAnotherSupport(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

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

function addAnotherDrilled(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

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

function addAnotherPrepared(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

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


function addAnotherNC(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

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


function addAnotherLHD(e) {
    fieldNumber = fieldNumber + 1;
    let num = fieldNumber;
    let body = (e.childNodes[1].childNodes[1]);

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


//==================Side/Menu Bar=========

// let sidebarItems = document.getElementById("sidebar-items");

// if (sidebarItems) {
//     let navItems = sidebarItems.getElementsByTagName('li');
//     let i;
//     for (i = 0; i < navItems.length; i++) {
//         navItems[i].addEventListener("click", function () {
//             if (!this.classList.contains('active')) {
//                 clearActives(navItems);
//                 this.classList.toggle('active');
//             }
//         });
//     }
// }

// function clearActives(classlist) {
//     if (classlist) {
//         for (i = 0; i < classlist.length; i++) {
//             classlist[i].classList.remove('active');
//         }
//     }
// }
// ===============================filtering====================


// let all = document.getElementById("all-shift")
// let morning = document.getElementById("day-shift")
// let backshift = document.getElementById("night-shift")
// let filters = document.getElementsByName("shift")



// function handleClick(e) {
//     let item = document.getElementById(e.value)
//     if (item.checked = true) {
//         item.classList.add("hidden")
//         item.classList.remove("hidden")
//     }
// }

// ================solution from w3=======
filter("all")
function filter(c) {
    let all = document.getElementsByClassName("filterDiv");
    if (c == "all") c = "";
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (let i = 0; i < all.length; i++) {
        hideItem(all[i], "show");
        if (all[i].className.indexOf(c) > -1) showItem(all[i], "show");
    }
}

// Show filtered elements
function showItem(element, name) {
    // var i, arr1, arr2;
    let arr1 = element.className.split(" ");
    let arr2 = name.split(" ");
    for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
}

// Hide elements that are not selected
function hideItem(element, name) {
    // var i, arr1, arr2;
    let arr1 = element.className.split(" ");
    let arr2 = name.split(" ");
    for (let i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
if (document.getElementById("myBtnContainer")) {
    const btnContainer = document.getElementById("myBtnContainer");
    const btns = btnContainer.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            let current = document.getElementsByClassName("selected");
            current[0].className = current[0].className.replace(" selected", "");
            this.className += " selected";
        });
    }
}
// const btnContainer = document.getElementById("myBtnContainer");
// const btns = btnContainer.getElementsByClassName("btn");
// for (let i = 0; i < btns.length; i++) {
//     btns[i].addEventListener("click", function () {
//         let current = document.getElementsByClassName("selected");
//         current[0].className = current[0].className.replace(" selected", "");
//         this.className += " selected";
//     });
// }

// ===============date filtering=========

async function dateChange(e, f) {
    selectedDate = e.value
    // console.log(selectedDate)
    let main = document.getElementById("tables")
    main.innerHTML = ""
    // console.log(f[0].created)
    let prodFiltered = f.filter(prod => moment(prod.created).format('YYYY-MM-DD') === selectedDate)
    let dayshift = prodFiltered.filter(prod => prod.general[0].shift === "morning")
    let backshift = prodFiltered.filter(prod => prod.general[0].shift === "backshift")
    // console.log(prodFiltered)
    let content = `
    <table id="all-shift" class="filterDiv all show">
                    <thead>
                        <tr>

                        </tr>
                        <tr>
                            <th>All</th>
                            <th>Blasted (m)</th>
                            <th>Cleaned (m)</th>
                            <th>Supported (m)</th>
                            <th>Drilled (m)</th>
                            <th>Prep'd (m)</th>
                            <th>Not Cleaned (m)</th>
                            <th>LHDs</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${prodFiltered.map(function (e) {
        return "<tr><td><a href='/sections/" + e.section.id + "/production/" + e._id + "'>" + e.section.name + "</a></td><td>" + e.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.clean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.support.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.drill.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.prep.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.notClean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.LHD.length + "</td></tr>"
    }).join("")}


        <tr>
            <th>Totals</th>
            <td>
                ${prodFiltered.map(b => b.blast).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${prodFiltered.map(b => b.clean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${prodFiltered.map(b => b.support).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${prodFiltered.map(b => b.drill).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${prodFiltered.map(b => b.prep).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${prodFiltered.map(b => b.notClean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${prodFiltered.map(b => b.LHD).map(sub1 => sub1.length).reduce((i, j) => i + j, 0)}
            </td>
        </tr>

                    </tbody >
    </table>
    <br>
    <table id="day-shift" class="filterDiv day show">
                    <thead>
                        <tr>

                        </tr>
                        <tr>
                            <th>Day</th>
                            <th>Blasted (m)</th>
                            <th>Cleaned (m)</th>
                            <th>Supported (m)</th>
                            <th>Drilled (m)</th>
                            <th>Prep'd (m)</th>
                            <th>Not Cleaned (m)</th>
                            <th>LHDs</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${dayshift.map(function (e) {
        return "<tr><td><a href='/sections/" + e.section.id + "/production/" + e._id + "'>" + e.section.name + "</a></td><td>" + e.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.clean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.support.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.drill.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.prep.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.notClean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.LHD.length + "</td></tr>"
    }).join("")}


        <tr>
            <th>Totals</th>
            <td>
                ${dayshift.map(b => b.blast).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${dayshift.map(b => b.clean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${dayshift.map(b => b.support).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${dayshift.map(b => b.drill).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${dayshift.map(b => b.prep).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${dayshift.map(b => b.notClean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${dayshift.map(b => b.LHD).map(sub1 => sub1.length).reduce((i, j) => i + j, 0)}
            </td>
        </tr>

                    </tbody >
    </table>
    <br>
    <table id="night-shift" class="filterDiv night show">
                    <thead>
                        <tr>

                        </tr>
                        <tr>
                            <th>Night</th>
                            <th>Blasted (m)</th>
                            <th>Cleaned (m)</th>
                            <th>Supported (m)</th>
                            <th>Drilled (m)</th>
                            <th>Prep'd (m)</th>
                            <th>Not Cleaned (m)</th>
                            <th>LHDs</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${backshift.map(function (e) {
        return "<tr><td><a href='/sections/" + e.section.id + "/production/" + e._id + "'>" + e.section.name + "</a></td><td>" + e.blast.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.clean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.support.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.drill.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.prep.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.notClean.map(sub1 => sub1.length).reduce((i, j) => i + j, 0) + "</td><td>" + e.LHD.length + "</td></tr>"
    }).join("")}


        <tr>
            <th>Totals</th>
            <td>
                ${backshift.map(b => b.blast).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${backshift.map(b => b.clean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${backshift.map(b => b.support).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${backshift.map(b => b.drill).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${backshift.map(b => b.prep).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${backshift.map(b => b.notClean).map(sub1 => sub1.map(sub2 => sub2.length).reduce((i, j) => i + j, 0)).reduce((x, y) => x + y, 0)}
            </td>
            <td>
                ${backshift.map(b => b.LHD).map(sub1 => sub1.length).reduce((i, j) => i + j, 0)}
            </td>
        </tr>

                    </tbody >
    </table>
`

    let all = document.createElement("section");
    all.innerHTML = content
    main.appendChild(all)
    document.getElementById('all').click()


    // const tableAll = document.createElement("table")
    // const tableDay = document.createElement("table")
    // const tableNight = document.createElement("table")
    // tableAll.className = "filterDiv all"
    // tableAll.id = "all-shift"
    // tableDay.className = "filterDiv day"
    // tableDay.id = "day-shift"
    // tableNight.className = "filterDiv night"
    // tableNight.id = "night-shift"
    // console.log(tableNight, tableAll, tableDay)

}


// =============== We will try make a Fecth API call =========
// const ron = fetch("http://localhost:4000/api/production")
//     .then(res => {
//         // console.log("SUCCESS, RESPONSE WAITING TO PARSE", res)
//         return res.json()
//     })
//     .then(data => {
//         console.log(data)
//         let output = `< h2 > Info</h2 > `
//         // data.forEach(c => {
//         //     output += `${ c.section.name } `
//         // })
//         let filtered = data.filter(prod => prod.created === "2020-11-11T11:05:37.061Z")
//         document.getElementById("fromAPI").innerHTML = output + filtered[0].section.name
//         // console.log("DATA PARSED...", data.filter(prod => prod.created === "2020-11-12T08:39:05.843Z"))
//         // return data.filter(prod => prod.created === "2020-11-12T08:39:05.843Z")
//     })
//     .catch(err => {
//         console.log("ON NO! ERROR", err)
//     })


//======================sidebar logic========


// const sideNav = document.getElementById("side-list");
// const sideNavItems = sideNav.getElementsByClassName("side-item");
// // console.log(sideNavItems[0].firstElementChild)
// for (let i = 0; i < sideNavItems.length; i++) {
//     // sideNavItems[i].firstElementChild.addEventListener("click", function () {
//     sideNavItems[i].addEventListener("click", function () {
//         console.log(this.parentNode)
//         let current = document.getElementsByClassName("selected-side");
//         current[0].className = current[0].className.replace(" selected", "");
//         this.parentNode.className += " selected";
//         this.className += " selected";
//     });
// }