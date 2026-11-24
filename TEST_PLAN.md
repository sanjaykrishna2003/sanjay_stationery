# Test Plan

This is my test plan for the Sanjay Stationery mini checkout page. It focuses on the parts most likely to break or cause wrong totals or duplicate orders.

## Scope

**In scope:**
- Adding and removing the two store products
- Updating item quantities with `-`, `+`, and keyboard input (limits 1 to 99)
- INR (`₹`) formatting with `en-IN` digit grouping and two decimal places
- Required Customer Name validation (including whitespace-only names)
- Empty cart blocking on submit
- Single confirmation display, order reference format (`SS-XXXXX`), and double-click protection
- Resetting back to a clean state with "Place another order"

**Out of scope:**
- GST, shipping fees, promo codes, or payment gateways
- Backend APIs, databases, or persistence across page reloads
- Multi-currency support

## Risk Table

| Risk | Why it matters | Priority |
| :--- | :--- | :--- |
| Wrong line or order total calculation | Customers see or confirm the wrong rupee amount due to rounding or stale state. | High |
| Double-click or double-Enter creates two confirmations | A customer could think they placed two orders, or the UI breaks. | High |
| Blank or whitespace-only name passes validation | Orders go through without knowing who placed them. | High |
| Empty cart allows checkout | Customer gets an order confirmation for ₹0.00 with no items. | High |
| Invalid quantity (0, negative, 100+, text) breaks totals | Produces `NaN`, negative totals, or items stuck at zero quantity. | Medium |
| Failed validation wipes cart or entered name | Forces the customer to re-enter everything after a small mistake. | Medium |

## Test Cases

| ID | Scenario | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- |
| TC-01 | Successful checkout produces a confirmation | 1. Open page.;2. Add Pen.;3. Enter Customer Name `Asha Rao`.;4. Click Place Order. | One confirmation appears beside the checkout panel with `Asha Rao`, a reference matching `SS-` + 5 digits, and total `₹20.00`. Place Order button becomes disabled. | Automated |
| TC-02 | Missing name blocks checkout | 1. Open page.;2. Add Notebook.;3. Leave Customer Name empty.;4. Click Place Order. | Error `"Please enter your name to place the order."` appears next to the name field, focus returns to the field, no confirmation exists, and the cart still has 1 notebook at `₹60.00`. | Automated |
| TC-03 | Quantity change updates exact totals | 1. Open page.;2. Add Pen and Notebook.;3. Click `+` on Pen.;4. Type `20` in Notebook quantity input. | After `+`: pen line total is `₹40.00` and order total is `₹100.00`. After typing `20`: notebook line total is `₹1,200.00` and order total is `₹1,240.00`. | Automated |
| TC-04 | Empty cart blocks checkout | 1. Open page with empty cart.;2. Optionally type a name.;3. Click Place Order. | Message `"Your cart is empty. Please add at least one item."` is shown, no confirmation appears, and any entered name stays in the input. | Manual |
| TC-05 | Rapid double-click or double Enter | 1. Add an item and enter a valid name.;2. Double-click Place Order quickly (or press Enter twice rapidly). | Only one confirmation box is shown, with one `SS-` reference, and Place Order stays disabled. | Manual |
| TC-06 | Whitespace-only name is rejected | 1. Add an item.;2. Type spaces only (`   `) in Customer Name.;3. Click Place Order. | Treated as blank; error `"Please enter your name to place the order."` shows and focus moves back to the field. | Manual |
| TC-07 | Quantity boundaries and invalid inputs | 1. Add an item.;2. Click `-` at qty 1.;3. Type `0`, `150`, and `abc`.;4. Click Remove. | Qty stays within 1–99 with a clear message for invalid values. Remove deletes the item and sets order total to `₹0.00`. | Manual |
| TC-08 | Place another order resets state | 1. Complete a valid order.;2. Click "Place another order". | Confirmation disappears, cart is empty, name is cleared, order total is `₹0.00`, and Place Order is enabled again. | Manual |
