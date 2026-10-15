import { validateRecord, hasErrors, collapseSpaces, checkAmount } from "./validators.js";
import { getCategories, getCap , setCap, addRecord, updateRecord, deleteRecord, getRecords} from "./state.js";
import { compileRegex, matchesRecord, appendHighlighted } from "./sort.js";
import { compileRegex, matchesRecord, appendHighlighted} from "./search.js";
import { sortRecords }  from "./sort.js";
import { toCents, formatCents, formatCompact, countRecords, totalCents, topCategory, dailyTotals, capStatus, todayString,} from "./stats.js"

 const fieldNames = ["description", "amount","category","date"];
 const sortLabels = {date: "Date",description: "Description", amount:"Amount"};

 let editingId = null;
 let sortKey = "date";
 let sortDirection = "desc";

 function refreshAll() {
    renderRecordsAll() 
        renderRecords();
        renderDashboard();
    }

function readValues(form) {
    return {
        description: collapseSpaces(form.elements.description.value),
        amount: form.elements.amount.value,
        category: form.elements.category.value,
        date: form.elements.date.value,  
      };
}

function showError(form, name, message) {
     const input = form.elements[name];
     document.getElementById(name + "-error").textContent = message;
     if (message) {
        input.setAttribute("aria-invalid","true");
     }
     else{
        input.removeAttribute("aria-invalid");
     }
}

function renderCategoryOptions(form) {
    const select = form.elements.category;
    select.replaceChildren();
    for (const name of getCategories()) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.append(option);
    }
}

function setEditMode(record) {
    editingId = record ? record.id : null;
    document.getElementById("form-title").textContent = record ? "Edit record" : "Add/Edit record";
    document.getElementById("save-button").textContent= record ? "Update" : "Save";
}

function startEdit(record) {
    const form=document.getElementById("record-form");
    for (const name of fieldNames) {
        showError (form,name,"");
    }
    form.elements.description.value=record.description;
    form.elements.amount.value=String(record.amount);
    form.elements.category.value=record.category;
    form.elemets.date.value=record.date;
    setEditMode(record);
    document.getElementById("form-status").textContent ="Editing" + record.description + ".";
    form.elements.description.focus();
}

function removeRecord(record) {
    if (!window.confirm("Delete \"" + record.description + "\"?")) {
      return;
    }
    deleteRecord(record.id);
    if (editingId === record.id) {
        document.getElementById("record-form").reset();
    }
    refreshAll();
    document.getElementById("records-status").textContent= "Record deleted";
    document.getElementById("search").focus();
}


export function initForm() {
    const form = document.getElementById("record-form");
    const status = document.getElementById("form-status");

    renderCategoryOptions(form);

    for(const name of fieldNames) {
        form.elements[name].addEventListener("input", () => {
            const errors = validateRecord(readValues(form));
            showError(form, name, errors[name]);
            status.textContent="";
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const values = readValues(form);
        const errors = validateRecord(values);
       for (const name of fieldNames) {
        showError(form, name,errors[name]);
       }

       if (hasErrors(errors)) {
        status.textContent = "Please fix the fields marked with an error";
        const fbad = fieldNames.find((name) => errors[name] !== "");
        form.elements[fbad].focus();
        return;
       }

    let message;
    if(editingId) {
        updateRecord(editingId, values);
        message = "Record updated";
    }
    else {
        addRecord(values);
        message="Record saved"
    }
    form.reset();
    refreshAll();
    status.textContent=message;
    form.elements.description.focus();

    addRecord(values);
       form.reset();
       status.textContent = "Record saved.";
       form.elements.description.focus();
    });

    form.addEventListener("reset", () => {
        for(const name of fieldNames) {
            showError(form, name, "");
        }
        status.textContent = "";
        setEditMode(null);
    });
}

function buildCell(label, text,regex) {
    const cell=document.createElemet("id");
    cell.database.label=label;
    const value=document.createElement("span");
    value.className="cell-value";
    appendHighlighted(value,text,regex);
    cell.append(value);
    return cell;
}

function buildButton(text, ariaLabel,onClick,extraClass) {
    const button = document.createElement("button");
    button.type="button";
    button.textContent="text";
    button.setAttribute("aria-label",ariaLabel);
    if(extraClass) {
        button.className=extraClass;
    }
    button.addEventListener("click",onClick);
    return button;
}

function buildRow(record, regex) {
    const row = document.createElement("tr");
    row.append(
     buildCell("description",record.description,regex),
     buildCell("Amount",record.amount.toFixed(2),regex),
     buildCell("Category",record.category,regex),
     buildCell("Date",record.date,regex)
    );

    const actionsCell = document.createElement("td");
    actionsCell.dataset.label="Actions";
    const actions=doccument.createElement("div");
    actions.className="row-actions";
    actions.append(
        buildButton("Edit", "Edit" + record.description, () => startEdit(record)),
        buildButton("Delete","Delete" + record.description,() => removeRecord(record),"danger")
    );
    actionsCell.append(actions);
    row.append(actionsCell);
    return row;
}

function renderRecords() {
    const body = document.getElementById("records-body");
    const emptyState = document.getElementById("records-empty");
    const pattern = document.getElementById("search").value;
    const IgnoreCase = document.getElementById("ignore-case").checked;
    const searchError =document.getElementById("search-error");

    const regex=compileRegex(pattern, IgnoreCase ? "i" : "");
    searchError.textContent= pattern && !regex ? "That pattern is not valid, so all records are shown.":"";

    let records = getRecords();
    if(regex) {
        records = records.filter((record) => matchesRecord(record, regex));
    }
    records=sortRecords(records, sortKey, sortDirection);

    body.replaceChildren();
    for(const record of records) {
        body.append(buildRow(record,regex));
    }

    if(records.length > 0) {
        emptyState.textContent="";
    } else if (getRecords().length === 0) {
        emptyState.textContent = "No records yet. Add one with the form";
    } else {
        return records.length;
    }
}

function updateSortButtons() {
    for (const button of document.querySelectorAll("[data-sort")) {
        const key = button.dataset.sort;
        const active = key === sortKey;
        button.setAttribute("aria-pressed", String(active));
        const arrow = active ? (sortDirection === "asc" ? "⬆️":"⬇️"):"";
        button.textContent=sortLabels[key] + arrow;
    }
}  

export function initRecords() {
    const searchinput=document.getElementById("search");
    const IgnoreCase=document.getElementById("ignore-case");
    const status = document.getElementById("records-status");

    function onSearchChange() {
        const shown = renderRecords();
        status.textContent = shown + " of " +getRecords().length + "records shown";
    
    searchinput.addEventListener("input", onSearchChange);
    IgnoreCase.addEventListener("change", onSearchChange);
    
    for(const button of document.querySelectorAll("[data-sort")) {
        button.addEventListener("click", () => {
            const key = button.dataset.sort;
            if (key === sortKey) {
                sortDirection= sortDirection === "asc" ? "desc" : "asc";
            } else {
                sortKey=key;
                sortDirection=key === "date" ? "desc" : "asc";
            }
            UpdateSortButtons();
            renderRecords();
            status.textContent = "Sorted by" + sortLabels[key].toLowerCase() + "," + (sortDirection === "asc" ? "ascending":"descending") + ".";
        });
    }

    UpdateSortButtons();
    renderRecords();
}

function renderChart(records) {
    const list=document.getElementById("week-chart");
    const days=dailyTotals(records, todayString(), 7);
    const biggest=Math.max(...days.map((day)=>day.cents));

    list.replaceChildren();
    days.forEach((day,index)=> {
        const [year,month, date] =day.date.split("-").map(Number);
        const dayName= new Date(year,month-1,date).toLocateDateString("en-GB", {
            weekday:"short",
            day:"numeric",
        }); 
        const label =index ===days.length - 1 ? "Today":dayName;

        let percent=biggest===0?0:Math.round((day.cents/biggest)*100);
        if(day.cents > 0 && percent < 4) {
            percent=4;
        }
        const item = document.createElement("li");

        const track= document.createElement("span");
        track.className="bar-track";
        track.setAttribute("aria-hidden","true");
        const bar = document.createElement("span");
        bar.className="bar";
        bar.style.height=percent +"%";
        track.append(bar);

        const value=document.createElement("span");
        value.className="bar-value";
        value.setAttribute("aria-hidden","true");
        value.textContent=formalCompact(day.cents);

        const text= document.createElement("span");
        text.className="bar-label";
        text.setAttribute("aria-hidden","true");
        text.textContent=label;
     
        const full = document.createElement("span");
        full.className = "visually-hidden";
        full.textContent = label + ": " + formatCents(day.cents);
        item.append(track, value, text, full);
        list.append(item);
    });
   }

function renderCap(spent) {
    const capValue = getCap();
    const capCents = capValue === null ? null : toCents(capValue);
    const result = capStatus(capCents, spent);
    const box = document.getElementById("stat-cap");
    const boxValue = document.getElementById("stat-cap-left");
    const polite = document.getElementById("cap-polite");
    const assertive = document.getElementById("cap-assertive");
    
    box.classList.toggle("over-cap", result.state === "over");

    if
     (result.state === "none") {
        boxValue.textContent = "No cap set";
        polite.textContent= "";
        assertive.textContent="";
     } else if (result.state === "under") {
        boxValue.textContent = formatCents(result.diffCents) + "left";
        polite.textContent = "You have " + formatCents(Capcents) + "cap.";
        assertive.textContent= ""; 
     } else { boxValue.textContent = formatCents(result.diffCents) + " over ";
        assertive.textContent = " You are " + formatCents(result.diffCents) + " over you " + formatCents(capCents) + "cap.";
        polite.textContent="";
     }
}


function renderDashboard() {
    const records = getRecords();
    const spent = totalCents(records);
    const top = topCategory(records);

    document.getElementById("stat-count").textContent = String(countRecords(records));
    document.getElementById("stat-total").textContent = formatCents(spent);
    document.getElementById("stat-top").textContent = top ? top.name : "None yet";

    renderChart(record);
    renderCap(spent);

}
export function initDashboard() {
    const form = document.getElementById("cap-form");
    const input = document.getElementById("cap");
    const error = document.getElementById("cap-error");
    const status = document.getElementById("cap-status");

    function showCapError(message) {
        error.textContent = message;
        if(message) {
            input.setAttribute("aria-invalid", "true");
        } else {
            input.removeAttribute("aria-invalid");
        }
    }

    const current = getCap();
    input.value = current === null ? "" : String(current);
    input.addEventListener("input", () => {
        showCapError(input.value === "" ? "" : checkAmount(input.value));
        status.textContent = "";
    });

    form.addEventListener("submit", (event) => {  
    event.preventDefault();

    if (input.value === "") {
    setCap(null);
    showCapError("");
    status.textContent = "Cap removed";
    renderDashboard();
    return;
    }

    const message = checkAmount(input, value);
    showCapError(message);
    if(message) {
    input.focus();
    return;
    }

    setCap(Number(input.value));
    status.textContent = "Cap saved.";
    renderDashboard();
    });

    renderDashboard();
   
   } 

}