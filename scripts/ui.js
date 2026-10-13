import { validateRecord, hasErrors, collapseSapces } from "/validators.js";
import { getCategories, addRecord } from "./state";

const fieldNames = ["description", "amount","category","date"];
function readValues(form) {
    return {
        description: collapseSapces(form.elements.description.value),
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
        EventTarget.preventDefault();
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
    });
}
