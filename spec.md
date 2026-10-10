## PRISM Project Spec

Student Finance Tracker 

## what one transaction looks like
- id: what kind of value?, e.g."txn_001"
- description:text, e.g:lunch at cafeteria
- amount: a number, e.g: 15.50
- category: text from category list, e.g:Food
- date: textin YYYY-MM-DD format, e.g:2026-10-01
- createdAt:timestamp, set once when the record is made
- updateAt: timestamp, changed everytime the record is edited

## Categories
Food, Transport, Entertainment, Fees, Other (can be added and removed in Settings)

## Settings I will save
- Base currency: USD
- Two other currencies and their rates: RWF and EUR
- Spendig cap: amount you choose, in the base currency, compared with the total of all records
- Category list

## Accesibility plan
- Landmarks I will use: header, nav, main, section, footer, with one h1 and h2 for each section
- Skip link: the first Tab stop, jump staright to the main content
- From errors will show: inline, directly under the field that has the problem
-Keybord only: Tab and Shift+Tab to move, Enter to activate, Esc to cancel an edit; visible focus outline on everything

## Wireframe notes (details not drawn)
- Records: sort buttons (date, A to Z, amount) and an "ignore case" checkbox next to search
- Settings: Import JSON and Export JSON buttons; categories can be added and removed 
- Dashboard: "cap left" = cap - total spent
