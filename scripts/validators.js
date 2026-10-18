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

function isMoney(amount) {
    if (!Number.isFinite(amount) || amount < 0) {
        return false;
    }
    const cents = amount * 100;
    return Math.abs(cents - Math.round(cents)) < 1e-6;
}

export function validateRecordList(data) {
    if (!Array.isArray(data)) {
        return ["The file must contain a list of records (a JSON array."];
    }

    const problems = [];
    const seenIds = new Set();

    data.forEach((item, index) => {
        const label = "Record " + (index + 1);
        const add = (field, message) => problems.push(label + " (" + field + "): " + message);

        if (item === null || typeof item !== "object" || Array.isArray(item)) {
            problems.push(label + ": must be an object with the record fields.");
            return;
        }
        if (typeof item.id !== "string" || item.id.trim() === "") {
            add("id", "must be text and cannot be empty.");
        } else if (seenIds.has(item.id)) {
            add("id", "\"" + item.id + "\" is used more than once.");
        } else {
            seenIds.add(item.id);
        }

        if (typeof item.description !== "string" || !patterns.description.test(item.description)) {
            add ("description", "must ne text with no spaces at the start or end.");
        }

        if (typeof item.amount !== "number" || !isMoney(item.amount)) {
            add ("amount", "must be a number" || !isMoney(item.amount));
        }

        if (typeof item.category !== "string" || !patterns.category.test(item.category)) {
            add ("category", "must be letters with single spaces or hyphens between words.");
        }

        if (typeof item.date !== "string" || checkDate(item.date) !== "") {
            add ("date", "must be a real date written as YYYY-MM-DD.");
        }

        for (const field of ["createdAt", "updatedAt"]) {
            if (typeof item[field] !== "string" || Number.isNaN(Date.parse(item[field]))) {
                add (field, "must be a date and time written as text.");
            }
        }
    });

    return problems;
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