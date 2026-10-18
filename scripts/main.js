//Entry point: starts each part of the app.
import { initForm, initRecords, initDashboard, refreshAll } from "./ui.js";
import { initCurrency } from "./currency.js";
import { initDataTools } from "./dataio.js";
import { initCategories, renderCategoryList } from "./category.js";

//Anything that changes the category list or the records redraws all of these.
function refreshEverything() {
    refreshCategories();
    renderCategoryList();
    refreshAll();
}

initForm();
initRecords();
initDashboard();
initCurrency(refreshAll);
initCategories(refreshEverything);
initDataTools(refreshAll);