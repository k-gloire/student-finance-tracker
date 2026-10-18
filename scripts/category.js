import { getCategories, addCategory, removeCategory } from "./state.js";
import { checkCategory } from "./validators.js";

const MAX_LENGTH = 30;

let onChange = () => {};

function checkNewCategory(value) {
    const message = checkCategory(value);
    if (message) {
        return message;
    }
    if (value.length > MAX_LENGTH) {
        return "Use " + MAX_LENGTH + " characters or fewer.";
    }
    const exists = getCategories().some((name) => name.toLowerCase() === value.toLowerCase());
    return exists ? "That category already exists." : "";
}

function showError(message) {
    const input = document.getElementById("new-category");
    document.getElementById("new-category-error").textContent = message;
    if (message) {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}

function handleRemove(name) {
    const status = document.getElementById("category-status");
    const result = removeCategory(name);
    if (!result.ok) {
        status.textContent = result.reason;
        return;
    }
    onChange();
    status.textContent = "Removed category " + name + ".";
    document.getElementById("new-category").focus();
}

export function renderCategoryList() {
    const list = document.getElementById("category-list");
    list.replaceChildren();
    for ( const name of getCategories()) {
        const item = document.createElement("li");
        const label = document.createElement("span");
        label.textContent =  name;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "danger";
        button.textContent = "Remove";
        button.setAttribute = ("aria-label", "Remove category " + name);
        button.addEventListener("click", () => handleRemove(name));

        item.append(label, button);
        list.append(item);
    }
}

export function initCategories(callback) {
    onChange = callback;
    const form = document.getElementById("category-form");
    const input = document.getElementById("new-category");
    const status = document.getElementById("category-status");

    renderCategoryList();
    
    if (input && form) {
    input.addEventListener("input", () => {
        showError(input.value === "" ? "" : checkNewCategory(input.value));
        status.textContent = "";
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = input.value;
        const message = value === "" ? "Enter a category name." : checkNewCategory(value);

        showError(message);
        if (message) {
            status.textContent = "";
            input.focus();
            return;
        }
        addCategory(value);
        input.value = "";
        onChange();
        status.textContent = "Added category " + value + ".";
        input.focus();
    });
  }
}