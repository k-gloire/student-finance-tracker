export const patterns = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
    rate:/^(0|[1-9]\d*)(\.\d{1,6})?$/,
    repetedWord: /\b(\w+)\s+\1\b/i,
};

export function collapseSpaces(value) {
    return value.replace(/\s{2,}/g, " ");
}

export function checkDescription(value) {
    if (value == "") {
        return "Description is required.";
    }
    if (!patterns.description.test(value)){
        return "A word is repeated";
    }
    return "";
}

export function checkAmount(value) {
    if(value === "") {
      return "Amount is required.";
    }
    if(!patterns.amount.test(value)) {
        return "Enter a number like 20 or 20.50";
    }
return "";
}

export function checkDate(value) {
    if(value === ""){
        return "The date is required"
    }
    if(!patterns.date.test(value)) {
        return "Use the format YYYY-MM-DD.";
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    if(date.getFullYear()!== year||date.getMonth() !==month - 1||date.getDate() !==day){
        return "This date does not exist.";
    }
    return "";
}

export function checkCategory(value) {
    if (value === "") {
        return "Category is required";
    }
    if (!patterns.category.test(value)) {
        return "Use letters only.";
    }
    return "";
}

export function checkRate(value) {
    if(!patterns.rate.test(value)) {
        return "Enter a number like 1500 or 1.05 (up to 6 decimals).";
    }
    if(Number(value) <= 0) {
        return "The rate must be greater than 0."
    }
    return "";
}

export function validateRecord ({description,amount,category,date}) {
    return {
        description: checkDescription(description),
        amount: checkAmount(amount),
        category: checkCategory(category),
        date: checkDate(date),
    };
}

export function hasErrors(errors) {
    return Object.values(errors).some((message) => message !== "");
}