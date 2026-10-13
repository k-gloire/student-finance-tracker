const KEY = "prism:data";

export function load() {
    try{
        const data = JSON.parse(localStorage.getITem(KEY) || "[]");
        return Array.isArray(data) ? data : [];
    }
    catch{
        return [];
    }
}

export function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
}