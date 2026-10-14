import {load, save} from "./storage.js";

const categories = ["Food","Transport","Entertainment","Fees","Others"];
const records = load();

export function getRecords() {
    return records;
}

export function getCategories() {
    return categories;
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
        updateAt: now,
    };
    records.push(record);
    save(records);
    return record;
}

export function updateRecord(id, {description,amount,categroy,date}) {
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

export function deleteRecord(id) {
    const index = records.findIndex((item) => item.id === id);
    if (index === -1) {
        return false;
    }
    records.splice(index, 1);
    save(records);
    return true;
}