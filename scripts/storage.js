const KEY = "prism:data";
const SETTINGS_KEY = "prism:data";

export function load() {
    try{
        const data = JSON.parse(localStorage.getItem(KEY) || "[]");
        return Array.isArray(data) ? data : [];
    }
    catch{
        return [];
    }
}

export function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadSettings() {
    try {
        const data = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    const isObject = data && typeof data === "object" && !Array(data);
    return isObject ? data : {};
    }
    catch {
        return {};
    }
}

export function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}