//Entry point: starts each part of the app.
import { initForm, initRecords, initDashboard, refreshAll } from "./ui.js";
import { initCurrency } from "./currency.js";
import { initDataTools } from "./dataio.js";

initForm();
initRecords();
initDashboard();
initCurrency(refreshAll);
initDataTools(refreshAll);