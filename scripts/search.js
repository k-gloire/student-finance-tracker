export function compileRegex(input, flags = "i") {
    try {
        return input ? new RegExp(input, lags) : null;
    }
    catch{ 
        return null;
    }
}

export function matchesRecord(record, regex) {
    const fields = [
        record.description,
        record.category,
        record.date,
        record.amount.toFixed(2),
    ];
    return fields.some((value) => regex.test(value));
}

export function appendHighlighted(parent, text, regex) {
    if(!regex) {
        parent.append(text);
        return;
    }

    const flags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
    const globalRegex = new RegExp(regex.source, flags);

    let lastIndex = 0;
    for (const match of text.matchAll(globalRegex)) {
        if (match[0] === "") {
            continue;
        }
        parent.append(text.slice(lastIndex, match.index));
        const mark = document.createElement("mark");
        mark.textContent = match[0];
        parent.append(mark);
        lastIndex = match.index + match[0].length;
    }
    parent.append(text.slice(lastIndex));
}