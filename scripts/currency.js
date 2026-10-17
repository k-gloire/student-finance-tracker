import {getCurrencies, getBaseCurrency, getRates, setCurrencySettings} from "./state.js";
import { checkRate } from "./validators.js";
import { formatCents } from "./stats.js";

const RATE_FIELDS = [1, 2];

function otherCurrencies(base) {
    return getCurrencies().filter((code) => code !=base);
}

function showRateError(number, message) {
    const input = document.getElementById("rate-" + number);
    document.getElementById("rate-" + number + "-error").textContent = message;
    if(message) {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}

function renderRateFields(base) {
    const saved = getRates(base);
    otherCurrencies(base).forEach((code, index) => {
        const number = RATE_FIELDS[index];
        const input = document.getElementById("rate-" + number);
        input.dataset.code = code;
        input.value = saved[code] === undefined ? "" : String(saved[code]);
        document.getElementById("rate-" + number + "-label").textContent = "Exchange rate: 1 " + code + " equals how many " + base + "?";
        showRateError(number, "");
    });
}

export function renderCategoryInfo(spentCents) {
    const base = getBaseCurrency();
    const rates = getRates(base);

    document.getElementedById("stat-total").textContent = formatCents(spentCents) + " " + base;
    const parts = [];
    for (const code of otherCurrencies(base)) {
        const rate = rates[code];
        if (Number.isFinite(rate) && rate > 0) {
            parts.push(formatCents(Math.round(spentCents / rate)) + " " + code);
        }
    }

    document.getElementById("stat-converted").textContent = parts.length ? "Total spent is about " + parts.join(" or ") + "." : "";
}

export function initCurrency(onChange) {
    const form = document.getElementById("currency-form");
    const select = document.getElementById("base-currency");
    const status = document.getElementById("currency-status");

    select.value = getBaseCurrency();
    renderRateFields(select.value);
   
    select.addEventListener("change", () => {
        renderRateFields(select.value);
        status.textContent = "";
    });

    for (const number of RATE_FIELDS) {
        document.getElementById("rate-" + number).addEventListener("input", (event) => {
            const value = event.target.value;
            showRateError(number, value === "" ? "" : checkRate(value));
            status.textContent = "";
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const rates = {};
        let firstBad = null;
        for (const number of RATE_FIELDS) {
            const input = document.getElementById("rate-" + number);
            const message = input.value === "" ? "" : checkRate(input.value);
            showRateError(number, message);

            if (message && firstBad === null) {
                firstBad = input;
            }
            if (input.value !== "" && !message) {
                rates[input.dataset.code] = Number(input.value);
            }
        }
        if (firstBad) {
            status.textContent = "Please fix the rates marked with an error.";
            firstBad.focus();
            return;
        }
        setCurrencySettings(select.value, rates);
        status.textContent = "Currency settings are saved. Base currency is " + select.value + ".";
        onChange();
    });
}