import { initForm, initRecords, initDashboard, refreshAll, initImport} from "./ui.js";
import { initCurrency } from "./currency.js";
import { initDataTools } from "./dataio.js";
import { initCategories, renderCategoryList } from "./category.js";

function refreshEverything() {
    refreshCategories();
    renderCategoryList();
    refreshAll();
}

initForm();
initRecords();
initDashboard();
initImport();
initCurrency(refreshAll);
initCategories(refreshEverything);
initDataTools(refreshAll);