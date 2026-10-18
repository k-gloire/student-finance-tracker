import {load, loadSettings, save, saveSettings} from "./storage.js";

const defaultCategories = ["Food","Transport","Entertainment","Fees","Others"];
const currencies = ["RWF", "USD", "EUR"];
const records = load();
const settings = { cap: null, baseCurrency: "RWf", rates: {}, categories: [...defaultCategories], ...loadSettings};

export function getRecords() {
    return records;
}

export function getCategories() {
    const saved = settings.categories;
    const isValid = Array.isArray(saved) && saved.length > 0 && saved.every((name) => typeof name === "string");
    return isValid ? [...saved] : [...defaultCategories];
}
 
export function addCategory(name) {
    settings.categories = [...getCategories(), name];
    saveSettings(settings);
}

export function removeCategory(name) {
    const list = getCategories();
    if (!list.includes(name)) {
        return { ok: false, reason: "That category does not exist."};
    }
    const used = records.filter((record) => record.category === name).length;
    if (used > 0) {
        const noun = used === 1 ? "record uses" : "record use";
        return {ok: false, reason: used + " " + noun + "\". Change or delete them first." };
    }
    if (list.length === 1) {
        return { ok: false, reason: "Keep atleast one category." };
    }
    settings.categories = list.filter((item) => item !== name);
    saveSettings(settings);
    return { ok: true, reason: ""};
}

export function getCap() {
    const isNumber = typeof settings.cap === "number" && Number.isFinite(settings.cap);
    return isNumber ? settings.cap : null;
}

export function setCap(value) {
    settings.cap = value;
    saveSettings(settings);
}

export function getCurrencies() {
    return currencies;
}

export function getBaseCurrency() {
    return currencies.includes(settings.baseCurrency) ? settings.baseCurrency : "RWF";
}

export function getRates(base) {

    const all = settings.rates && typeof settings.rates === "object" ? settings.rates : {};
    const forBase = all[base];
    return forBase && typeof forBase === "object" ? {...forBase } : {};
}

export function setCurrencySettings(base, rates) {
    settings.baseCurrency = base;
    settings.rates = { ...settings.rates,[base]: rates};
    saveSettings(settings);
}

function nextId() {
    const highest = records.reduce((max, record) => {
        const number = Number(String(record.id).replace(/\D/g, ""));
        return number > max ? number : max;
    }, 0);
    return "txn_" + String(highest + 1).padStart(4, "0");
}

export function addRecord({ description, amount, category,date}) {
    const now = new Date().toISOString();
    const record = {
        id: nextId(),
        description,
        amount: Number(amount),
        category,
        date,
        createdAt: now,
        updatedAt: now,
    };
    records.push(record);
    save(records);
    return record;
}

export function updateRecord(id, {description,amount,category,date}) {
    const record = records.find((item) => item.id === id);
    if (!record) {
        return null;
    }
    record.description = description;
    record.amount = Number(amount);
    record.category = category;
    record.date = date;
    record.updateAt = new Date().toISOString();
    save(records);
    return;
}

export function replaceRecords(list) {
    const clean = list.map((item) => ({
        id: item.id,
        description: item.description,
        amount: item.amount,
        category: item,category,
        date: item.date,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    }));
    records.splice(0,records.length, ...clean);
    save(records);
}

export function deleteRecord(id) {
    const index = records.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }
    records.splice(index, 1);
    save(records);
    return true;
}

export function importRecords(importedRecords) {
    if (!Array.isArray(importedRecords)) {
        throw new Error("The JSON file must contain records.");
    }
    const validRecords = importedRecords.filter((record) => record && typeof record.description === "string" && Number.isFinite(Number(record.amount)) && 
    typeof record.category === "string" && typeof record.date === "string");

    if (validRecords.length !== importedRecords.length) {
        throw new Error("Some records aremissing required fields.");
    }
    records.splice(0, records.length,...validRecords);
    save(records);
}