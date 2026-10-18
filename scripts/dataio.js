import { getRecords, replaceRecords } from "./state.js";
import { validateRecordList } from "./validators.js";
import { todayString } from "./stats.js";

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_SHOWN = 5;

export function exportRecords() {
    const records = getRecords();
    const json = JSON.stringify(records, null, 2);
    const blob = new Blob([json], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prism-records-" + todayString() + ".json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    return records.length;
}

function showProblems(problems) {
    const list = document.getElementById("import-error");
    if (!list) return;

    list.replaceChildren();
    for (const problem of problems.slice(0, MAX_SHOWN)) {
        const item = document.createElement("li");
        item.textContent = problem;
        list.append(more);
    }

    if (problems.length > MAX_SHOWN) {
        const more = document.createElement("li");
        more.textContent = "...and " + (problems.length - MAX_SHOWN) + "more.";
        list.append(more);
    }
}

function plural(count, word) {
    return count + " " + word + (count === 1 ? "" : "s");
}

export function initDataTools(onChange) {
    const exportButton = document.getElementById("export-button");
    const fileInput = document.getElementById("import-file");
    const status = document.getElementById("data-status");

    function fail(problems) {
      status.textContent = "Import failed: " + plural(problems.length, "problem") + " found. Nothing was changed.";
      showProblems(problems);
      fileInput.value = "";
    }

    exportButton.addEventListener("click", () => {
        showProblems([]);
        const count = exportRecords();
        status.textContent = "Exported " + plural(count, "record") + ".";
    });

    fileInput.addEventListener("change", async () => {
        showProblems([]);
        const file = fileInput.files[0];
        if (!file) {
            return;
        }
        if (file.size > MAX_BYTES) {
            fail(["The file is larger than 2 MB."]);
            return;
        }
        let data;
        try {
            data = JSON.parse(await file.text());
        } catch {
            fail(["That file is not valid JSON."]);
            return;
        }

        const problems = validateRecordList(data);
        if (problems.length > 0) {
            fail(problems);
            return;
        }

        const question = "Replace your " + plural(getRecords().length, "current record") + " with the " + plural(data.length, "record") + " in this file?";
        if (!window.confirm(question)) {
            status.textContent = "Import cancelled. Nothing was changed.";
            fileInput.value = "";
            return;
        }
        replaceRecords(data);
        onChange();
        status.textContent = "Imported " + plural(data.length, "record") + ".";
        fileInput.value = "";
    });
}