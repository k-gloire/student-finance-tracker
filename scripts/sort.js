// Sorting for the records list

// A compare function gets two records (a and b) and returns:
// a negative number if a should come first,
// a positive number if b should come first,
// 0 if they are equal.
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