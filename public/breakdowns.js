function breakdownFilter(date) {
    const data1 = document.getElementById("allBreakdowns").innerText;
    const data1Parsed = JSON.parse(data1);

    const closedData1 = document.getElementById("closedBreakdowns").innerText;
    const closedData1Parsed = JSON.parse(closedData1);

    const shiftData = document.getElementById('shiftData').innerText;
    const shiftDataParsed = JSON.parse(shiftData)
    const overlappingShift = shiftDataParsed.filter(e => e.overlap)
    const overlappingShiftName = (overlappingShift[0].name).toLowerCase();
    const overlappingShiftEndTime = overlappingShift[0].end;
    const overlappingShiftStartTime = overlappingShift[0].start;
    
    const section = document.getElementById("all-breakdowns");
    const shift = document.getElementsByClassName("breakdownShift");
    const shiftArr = [...shift]
    const shiftSelected = shiftArr.filter(e => e.checked)
    const openShiftFilteredBreakdowns = data1Parsed.filter((e) => e.shift === shiftSelected[0].value);
    
    const closedShiftFilteredBreakdowns = closedData1Parsed.filter((e) => e.breakdown.shift === shiftSelected[0].value);
    
    section.innerHTML = "";

    let allBreakdowns = openShiftFilteredBreakdowns.filter(e => moment(e.startTime).format('YYYY-MM-DD') === date);
    let closedBreakdowns = closedShiftFilteredBreakdowns.filter(e => moment(e.breakdown.startTime).format('YYYY-MM-DD') === date);
    

    // Sort out dates for overlaps
    const today = new Date(date + "T" + overlappingShiftEndTime);
    const nightShiftStart2 = new Date(date + "T" + overlappingShiftStartTime);
    const tomorrowSec2 = today.setDate(today.getDate() + 1);
    const nightShiftEnd2 = new Date(tomorrowSec2);

    if(shiftSelected[0].value === overlappingShiftName){
        allBreakdowns = openShiftFilteredBreakdowns.filter((e) => (new Date(e.startTime)) >= nightShiftStart2 && (new Date(e.startTime)) <= nightShiftEnd2);
    }

    if(shiftSelected[0].value === overlappingShiftName){
        closedBreakdowns = closedShiftFilteredBreakdowns.filter((e) => (new Date(e.breakdown.startTime)) >= nightShiftStart2 && (new Date(e.breakdown.startTime)) <= nightShiftEnd2);
    }

    const LHDs = allBreakdowns.filter((e) => e.category === "LHDs");
    const drillRigs = allBreakdowns.filter((e) => e.category === "drillRigs");
    const bolters = allBreakdowns.filter((e) => e.category === "bolters");
    const LDVs = allBreakdowns.filter((e) => e.category === "LDV");
    const UVs = allBreakdowns.filter((e) => e.category === "UV");
    const belts = allBreakdowns.filter((e) => e.category === "UGBelts");
    const electrical = allBreakdowns.filter((e) => e.category === "electrical");
    const mechanical = allBreakdowns.filter((e) => e.category === "mechanical");
    const other = allBreakdowns.filter((e) => e.category === "other");

    const closedLHDs = closedBreakdowns.filter((e) => e.breakdown.category === "LHDs");
    const closedDrillRigs = closedBreakdowns.filter((e) => e.breakdown.category === "drillRigs");
    const closedBolters = closedBreakdowns.filter((e) => e.breakdown.category === "bolters");
    const closedLDVs = closedBreakdowns.filter((e) => e.breakdown.category === "LDV");
    const closedUVs = closedBreakdowns.filter((e) => e.breakdown.category === "UV");
    const closedBelts = closedBreakdowns.filter((e) => e.breakdown.category === "UGBelts");
    const closedElectrical = closedBreakdowns.filter((e) => e.breakdown.category === "electrical");
    const closedMechanical = closedBreakdowns.filter((e) => e.breakdown.category === "mechanical");
    const closedOther = closedBreakdowns.filter((e) => e.breakdown.category === "other");

    const allBreakdownsLength = [LHDs.length, drillRigs.length, bolters.length, LDVs.length, UVs.length, belts.length, electrical.length, mechanical.length, other.length ];
    const openBdownsLength = allBreakdownsLength.reduce((i, j) => i + j, 0);

    const closedBreakdownsLength = [closedLHDs.length, closedDrillRigs.length, closedBolters.length, closedLDVs.length, closedUVs.length, closedBelts.length, closedElectrical.length, closedMechanical.length, closedOther.length ];
    const closedBdownsLength = closedBreakdownsLength.reduce((i, j) => i + j, 0);


    const table = `
                <table>
                    <thead>
                        <tr>
                            <th colspan="5">Open Breakdowns (${openBdownsLength})</th>
                        </tr>
                        <tr>
                            <th>CAT</th>
                            <th>ID</th>
                            <th>Section</th>
                            <th>Description</th>
                            <th>Start Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            ${LHDs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LHDs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                            
                        
                            ${drillRigs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Drill Rigs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${bolters.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Roof Bolters</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${LDVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LDVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${UVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${belts.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UG Belts</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${electrical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Electrical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${mechanical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Mechanical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}

                            ${other.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Other</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/breakdown/"+ e._id + "'>"+ e.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.section.name + "</td>" + 
                                                "<td>" + e.description + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                    </tbody>
                </table>
    `;

    const table2 = `<table>
                    <thead>
                        <tr>
                            <th colspan="8">Closed Breakdowns (${closedBdownsLength})</th>
                        </tr>
                        <tr>
                            <th>CAT</th>
                            <th>ID</th>
                            <th>Section</th>
                            <th>Description</th>
                            <th>Artisan Desc</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Downtime</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                            ${closedLHDs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LHDs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                            
                        
                            ${closedDrillRigs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Drill Rigs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${closedBolters.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Roof Bolters</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${closedLDVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">LDVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        

                        
                            ${closedUVs.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UVs</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${closedBelts.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">UG Belts</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${closedElectrical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Electrical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                        
                            ${closedMechanical.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Mechanical</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}

                            ${closedOther.map((e, i, arr) => {
                                if (i === 0) {
                                    return ("<tr><th rowspan=" + (arr.length) + ">Other</th>" +
                                            "" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "");
                                } else if (i === arr.length - 1){
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr></tr>");
                                } else {
                                    return ("<tr>" +
                                                "<td>" +
                                                    "<a href='/closedBreakdowns/"+ e._id + "'>"+ e.breakdown.equipment + "<a/>" +
                                                "</td>" + 
                                                "<td>" + e.breakdown.section.name + "</td>" + 
                                                "<td>" + e.breakdown.description + "</td>" + 
                                                "<td>" + e.comments + "</td>" + 
                                                "<td>" + e.start + "</td>" + 
                                                "<td>" + e.end + "</td>" + 
                                                "<td>" + e.downtime + "</td>" + 
                                            "</tr>")};
                            }).join("")}
                        
                    </tbody>
                </table>`


    section.innerHTML = table + "<hr>" + table2
}

if (document.getElementById("breakdown-date")) {
  document.getElementById("breakdown-date").oninput();
}

if (document.getElementById("todayDate")) {
  document.getElementById("todayDate").value = htmlDate;
}

//Filters Item/TMMID based on what catergory is selected
function filterItem(el){ //triggered by onchange listener
    //el is the select tag category
    // const tmms = document.getElementById("allAssets").innerText
    // const allTMMs = JSON.parse(tmms);

    const cat = el.value
    const assetsToUse = selectEngAssets();
    if (assetsToUse.length <= 0){
        alert(`No ${cat || "TMMs"} allocated for this section on selected shift for selected date`); 
    }

    const itemsSelect = document.getElementById("equipment"); //This is a select tag for items
    const itemsInput = document.getElementById("equipment2"); //This is an input tag for other items
    // const selectedCatItems = allTMMs.filter(e => e.category === el.value);
    
    

    const selectedCatItems = assetsToUse.map(e => e[cat]);
    // const selectedCatItems2 = ;
    const items = []
    const sele2 = selectedCatItems.map((e) => {
        if(!e) return
        e.forEach(i => {
            items.push(i)
        })
    })

    if(el.value !== "other"){
        itemsSelect.disabled = false;
        itemsSelect.hidden = false;
        const fragment = document.createDocumentFragment();
        // for (let i = 0; i < selectedCatItems.length; i++) {
        for (let i = 0; i < items.length; i++) {
            const option = document.createElement("option");
            // option.value = selectedCatItems[i].name;
            option.value = items[i];
            // option.innerText = selectedCatItems[i].name;
            option.innerText = items[i];
            fragment.append(option);
        }
       
        itemsSelect.innerHTML = "";
        itemsSelect.setAttribute("name", "breakdown[equipment]");
        itemsSelect.append(fragment);
		itemsInput.hidden = true;
		itemsInput.required = false;
        itemsInput.name = "";
        itemsInput.disabled = true;
        itemsSelect.onchange();
        return;
    }
    
    itemsSelect.setAttribute("name", "")
    itemsSelect.hidden = true;
    itemsSelect.required = true;
    itemsInput.disabled = false;    //Look at this line
    itemsInput.hidden = false;
    itemsSelect.onchange();
}


//Creating text input for other
function filterItemID(e) {
	if (e.value === "other") {
        e.hidden = true; // e is the select tag for items
        e.required = false;
        e.setAttribute("name", ""); // removing name attribute from the name tag
        e.disabled = true;

        const itemsInput = document.getElementById("equipment2"); //This is an input tag for other items
        itemsInput.disabled = false;
        itemsInput.hidden = false;
        itemsInput.setAttribute("name", "breakdown[equipment]");
        itemsInput.required = true;
        return;
	}

}

// Now dealing with breakdown availabilities, utilisation and reliability
if (document.getElementById("foundBreakdowns")) {
	// document.getElementById("startdate").value = htmlStartDate;
	document.getElementById("enddate").value = htmlDate;
	document.getElementById("enddate").max = htmlDate;
    filterBreakdowns()
}

// Filter machine availability
function filterBreakdowns(){
    filterBreakdowns2()
	const foundBreakdowns = document.getElementById("foundBreakdowns").innerText;
	const parsedFoundBreakdowns = JSON.parse(foundBreakdowns);

	const foundShifts = document.getElementById("foundShifts").innerText;
	const parsedFoundShifts = JSON.parse(foundShifts);


	const end = document.getElementById("enddate").value;
	const start = document.getElementById("startdate").value;

    // Constrcuting start date for overlapping shift
	const overlaps = parsedFoundShifts.filter((e) => e.overlap === true);
	const nameOfShift = overlaps[0].name;
	const startOfShift = overlaps[0].start;
	const endOfShift = overlaps[0].end;
    const startDateNS = new Date(end);
    startDateNS.setHours(startOfShift.split(":")[0])
    startDateNS.setMinutes(startOfShift.split(":")[1])

    // Constructing end date for overlapping shift
    const endDateNS = new Date(end);
	endDateNS.setDate(endDateNS.getDate() + 1);
    endDateNS.setHours(endOfShift.split(":")[0]);
    endDateNS.setMinutes(endOfShift.split(":")[1]);

    const dateForNS = new Date(end);
    dateForNS.setDate(dateForNS.getDate() + 1);

    
	const data = parsedFoundBreakdowns.filter((e) => moment(e.breakdown.startTime).format("YYYY-MM-DD") === end);
	const dataNight = parsedFoundBreakdowns.filter((e) => new Date(e.breakdown.startTime) >= startDateNS && new Date(e.breakdown.startTime) <= endDateNS);


	// Breakdowns. These will be used to calculate availability
	const MORNING = data.filter((e) => e.breakdown.shift === "morning");
	const AFTERNOON = data.filter((e) => e.breakdown.shift === "afternoon");
	// const NIGHT = data.filter((e) => e.breakdown.shift === "night");
	const NIGHT = dataNight.filter((e) => e.breakdown.shift === "night");

	// Getting shift objects
	const morningShift = parsedFoundShifts.filter((e) => e.name === "MORNING");
	const afternoonShift = parsedFoundShifts.filter((e) => e.name === "AFTERNOON");
	const nightShift = parsedFoundShifts.filter((e) => e.name === "NIGHT");

	// Getting availabilty
	const availFinalMorning = getAvailabilityForMorning(MORNING, morningShift);
	const availFinalANoon = getAvailabilityForANoon(AFTERNOON, afternoonShift);
	const availFinalNight = getAvailabilityForNight(NIGHT, nightShift);

	document.getElementById("morning-availability").innerText = availFinalMorning;
	document.getElementById("afternoon-availability").innerText = availFinalANoon;
	document.getElementById("night-availability").innerText = availFinalNight;

	document.getElementById("enddate").oninput;
}

function convertTimesToSeconds(str){
    const DT = str.split(":");
	const hours = Number(DT[0]) * 60 * 60;
	const minutes = Number(DT[1]) * 60;
    const DTinSeconds = hours + minutes;
    return DTinSeconds;
}

// Availabilty Functions
// 1. Getting availability for morning shift
function getAvailabilityForMorning(arr, shift){
    // If no breakdowns, availability is 100%
    if(arr.length === 0 || !arr){
        return 100
    }
    
    const shiftDuration = shift[0].duration
    const dates = [];
    arr.forEach(e => {
        if (dates.indexOf(new Date(e.breakdown.startTime).toDateString()) === -1) {
            dates.push(new Date(e.breakdown.startTime).toDateString());
		}
    })

    const groupedArr = [];
    dates.forEach((e) => {
       const filtered = arr.filter(el => new Date(el.breakdown.startTime).toDateString() === e)
       groupedArr.push(filtered)
	});


    const avails = [];
    groupedArr.forEach(e => {
        const DTs = e.map(dt => dt.downtime);
        const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
        const DTs3 = DTs2.reduce((i, j) => i + j, 0);
        const avail = ((shiftDuration * 60 * 60 - DTs3) / (shiftDuration * 60 * 60)) * 100;
        avails.push(avail)
    })
    const sumAvails = avails.reduce((i, j) => i + j, 0);
    const averageAvail = Number((sumAvails / avails.length).toFixed(0));

    return averageAvail;
}

// 2.Getting availability for afternoon shift
function getAvailabilityForANoon(arr, shift){
	// If no breakdowns, availability is 100%
	if (arr.length === 0 || !arr) {
		return 100;
	}

	const shiftDuration = shift[0].duration;
	const dates = [];
	arr.forEach((e) => {
		if (dates.indexOf(new Date(e.breakdown.startTime).toDateString()) === -1) {
			dates.push(new Date(e.breakdown.startTime).toDateString());
		}
	});

	const groupedArr = [];
	dates.forEach((e) => {
		const filtered = arr.filter((el) => new Date(el.breakdown.startTime).toDateString() === e);
		groupedArr.push(filtered);
	});

	const avails = [];
	groupedArr.forEach((e) => {
		const DTs = e.map((dt) => dt.downtime);
		const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
		const DTs3 = DTs2.reduce((i, j) => i + j, 0);
		const avail = ((shiftDuration * 60 * 60 - DTs3) / (shiftDuration * 60 * 60)) * 100;
		avails.push(avail);
	});
	const sumAvails = avails.reduce((i, j) => i + j, 0);
	const averageAvail = Number((sumAvails / avails.length).toFixed(0));

	return averageAvail;
}

// 3. Getting availability for night shift
function getAvailabilityForNight(arr, shift){
	// If no breakdowns, availability is 100%
	if (arr.length === 0 || !arr) {
		return 100;
	}

    // if (shiftSelected[0].value === overlappingShiftName) {
    //     console.log("Shift selected is night shift for open breakdowns");
    //     arr = arr.filter((e) => new Date(e.startTime) >= nightShiftStart2 && new Date(e.startTime) <= nightShiftEnd2);
    // }


	const shiftDuration = shift[0].duration;
	const dates = [];
	arr.forEach((e) => {
		if (dates.indexOf(new Date(e.breakdown.startTime).toDateString()) === -1) {
			dates.push(new Date(e.breakdown.startTime).toDateString());
		}
	});

	const groupedArr = [];
	dates.forEach((e) => {
		const filtered = arr.filter((el) => new Date(el.breakdown.startTime).toDateString() === e);
		groupedArr.push(filtered);
	});

	const avails = [];
	groupedArr.forEach((e) => {
		const DTs = e.map((dt) => dt.downtime);
		const DTs2 = DTs.map((e) => convertTimesToSeconds(e));
		const DTs3 = DTs2.reduce((i, j) => i + j, 0);
		const avail = ((shiftDuration * 60 * 60 - DTs3) / (shiftDuration * 60 * 60)) * 100;
		avails.push(avail);
	});
	const sumAvails = avails.reduce((i, j) => i + j, 0);
	const averageAvail = Number((sumAvails / avails.length).toFixed(0));

	return averageAvail;
}


function selectEngAssets(cat){
    // Get section name, date and shift. NAd then contruct tmms allowed. Return none if no allocation made
    const allocations = document.getElementById("allocations").innerText;
    const parsedAllocations = JSON.parse(allocations)

    const shifts = document.getElementById("shifts").innerText;
    const parsedShifts = JSON.parse(shifts)

    const overlapingShift = parsedShifts.filter(s => s.overlap);
    let overlapingShiftName
    let overlapsEnd = 0;
    
    if(overlapingShift.length > 0){
        overlapingShiftName = overlapingShift[0].name.toLowerCase();
        overlapsEnd = Number(overlapingShift[0].end.split(':')[0]);
    }
    
    
    const section = document.getElementById("section")
    const sectionName = section.options[section.selectedIndex].text;
    
    const data2 = document.getElementById("todayDate").value;
    const data21 = document.getElementById("todayDate").value;
    const hours = document.getElementById("startTime").value;
    const date2 = new Date(data2)
    const date = new Date(data21)
    
    // Yesterday
    const yesterday = date.setDate(date.getDate() - 1)
    
    const hrStart = Number(hours.split(":")[0])

    const shift = document.querySelectorAll("input[name='breakdown[shift]']")

    let selectedShift;
    shift.forEach(e => {
        if(e.checked){
            selectedShift = e.value
        }
    })

    let selectorCode = sectionName + date2.toLocaleDateString("en-GB") + selectedShift;
    // if (selectedShift === "night" && hrStart >= 0 && hrStart <= 6) {
    if (selectedShift === overlapingShiftName && hrStart >= 0 && hrStart <= overlapsEnd) {
		selectorCode = sectionName + date.toLocaleDateString("en-GB") + selectedShift;
	}

    const engAssets = [];
    parsedAllocations.forEach(e => {
        const selectorCode2 = e.section + new Date(e.date).toLocaleDateString("en-GB") + e.shift;
        if(selectorCode2 === selectorCode){
            engAssets.push(e)
        }
    })

    return engAssets;
}

function toogleTMMCategory(){
    const cat = document.getElementById("category");
    const catValue = cat.options[cat.selectedIndex].text;

    if(catValue !== "select section first"){
        cat.onchange()
    }

    const section = document.getElementById("section");
    const sectionName = section.options[section.selectedIndex].text;

    if(sectionName !== "select section"){
        cat.disabled = false;
    } else {
        cat.disabled = true;
        cat.selectedIndex = cat.options[0]
    }
}


function filterBreakdowns2(){
    const shifts = document.getElementById("shifts");
	const shift = shifts.options[shifts.selectedIndex].text.toLowerCase();

    const end = new Date(document.getElementById("enddate").value);
    const start = new Date(document.getElementById("startdate").value);

    const foundBreakdowns = document.getElementById("foundBreakdowns").innerText;
	const parsedFoundBreakdowns = JSON.parse(foundBreakdowns);
    const shiftFilteredBDowns = parsedFoundBreakdowns.filter(e => e.breakdown.shift === shift);
    const filteredByDates = shiftFilteredBDowns.filter((e) => new Date(e.breakdown.startTime.split("T")[0]) >= start && new Date(e.breakdown.startTime.split("T")[0]) <= end);
    
	const foundShifts = document.getElementById("foundShifts").innerText;
	const parsedFoundShifts = JSON.parse(foundShifts);
    const shiftObjToUse = parsedFoundShifts.filter(e => e.name === shift.toUpperCase())

	const foundAllocations = document.getElementById("allocations").innerText;
	const parsedAllocations = JSON.parse(foundAllocations);

    const options = { day: "2-digit", month: "short", year: "2-digit" };
    const filtered = parsedAllocations.filter(e => e.shift === shift)
    const filtered2 = filtered.filter((e) => new Date(e.date) >= start && new Date(e.date) <= end);
    const lables2 = filtered2.map((e) => `${new Date(e.date).toLocaleDateString("en-GB", options)}`);

    const obj = {};

    for (const key of lables2) {
        obj[key] = filteredByDates.filter((e) => new Date(key).toLocaleDateString("en-GB") === new Date(e.breakdown.shiftStartTime).toLocaleDateString("en-GB")).map((e) => e.downtime);
    }

    const vals = Object.values(obj);
    const hello = vals.map(e => {
        const hi = getAvailability(e, shiftObjToUse)
        return hi
    })

    createTable(lables2, hello)
}


function getAvailability(arr, shift) {
	// If no breakdowns, availability is 100%
	if (arr.length === 0 || !arr) {
		return 100;
	}

	const shiftDuration = shift[0].duration;
    const DTs = arr.map((e) => convertTimesToSeconds(e));
    const DTs2 = DTs.reduce((i, j) => i + j, 0);

    const avail = ((shiftDuration * 60 * 60 - DTs2) / (shiftDuration * 60 * 60)) * 100;

	return Number(avail.toFixed(0));
}

// Create a table and graph
function createTable(lables, data){
    const table = `<table>
                    <tbody>
                        <tr>
                            <th>
                                <small>Date</small>
                            </th>
                            ${
                                lables.map(e => {
                                    return ('<td><small class=date>'+ e + '</small></td>')
                                }).join("")
                            }
                        </tr>
                        <tr>
                            <th>
                                <small>Avail</small>
                            </th>
                            ${
                                data.map(e => {
                                    return ('<td><small class=avail>'+ e + '</small></td>')
                                }).join("")
                            }
                        </tr>
                    </tbody>
                </table>`

    const tableDiv = document.getElementById("table");
    tableDiv.innerHTML = table
}

function resetItems(){
    const  sections = document.getElementById("section")
    const section = sections.options[sections.selectedIndex].text;
    if(section === "select section"){
        return
    }
    document.getElementById("category").onchange()
}