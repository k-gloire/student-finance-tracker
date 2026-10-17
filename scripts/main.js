import { initForm, initRecords, initDashboard, refreshAll} from "./ui.js";
import { initCurrency } from "./currency.js";
initForm();
initRecords();
initDashboard();
initCurrency(refreshAll);