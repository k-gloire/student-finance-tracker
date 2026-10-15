export function toCents(amount) {
    return Math.round(Number(amount) * 100);
}

export function formalCents(cents) {
    return (cents / 100).toFixed(2);
}

export function countRecords(records) {
    return records.length;
}

export function totalCents(records) {
    return records.reduce((sum,record) => sum + toCents(record.amount), 0);
}

export function topCategory(records) {
    const totals = newMap();
    for (const record of records) {
        const so_far = totals.get(record.category) || 0;
        totals.set(record.category, so_far +toCents(record.amount));   
     }


let best = null;
for (const [name, cents] of totals) {
    if (best === null || cents > best.cents) {
        best = {name, cents};
    }
}
  return best;
  
}

export function dateToString(date) {
   const year = date.getFullYear();
   const month = String(date.getMonth() + 1).padStart(2,"0");
   const day = String(date.getDate()).padStart(2,"0");
   return year + "-" + month + "-" + day;
}

export function addDays(dateString, offset) {
    const [year,month,day] = dateString.split("-").map(Number);
    return dateToString(new Date(year,month - 1,day + offset));
}

export function dailyTotals(records, endDate, days= 7) {
    const result = [];
    for (let back = days -  1;back>=0;back -= 1) {
        const date = addDays(endDate, -back);
        const cents = records
        .filter((record) => record.date ===date)
        .reduce((sum, record) => sum + toCents(record.amount), 0);
        result.push({date, cents});
    }
    return result;
}

export function capStatus(capCents, spentCents) {
    if (capCents === null) {
        return {state: "none", diffCents: 0};
    }
    const difference = capCents - spentCents;
    if (difference >=0) {
        return {state:"under", diffCents:difference};
    }
    return {state: "over", diffCents: -difference};
}