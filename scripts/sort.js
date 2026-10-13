function compareDate(a, b) {
    return 0;
}

function compareAmount(a, b) {
    return 0;
}

const comparers = {
    date: compareDate,
    description: compareDescription,
    amount: compareAmount,
};

export function sortRecords(records, key, direction) {
    const sign = direction === "asc" ? 1 : -1;
    return [...records].sort((a, b) => sign * comparers[key](a.b));
}