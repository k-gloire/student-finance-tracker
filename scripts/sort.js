function compareDate(a, b) {
    return a.date.localeCompare(b.date);
}

function compareAmount(a, b) {
   return a.amount - b.amount;
}

function compareDescription(a, b) {
    return String (a.description || "").localeCompare(String(b.description || ""));
}

const comparers = {
    date: compareDate,
    description: compareDescription,
    amount: compareAmount,
};

export function sortRecords(records, key, direction) {
    const sign = direction === "asc" ? 1 : -1;
    return [...records].sort((a, b) => sign * comparers[key](a,b));
}