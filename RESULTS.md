# Test Results

## Test Run Info

- **Date:** 24/11/2026
- **Tester:** Sanjay
- **Browser / OS:** Google Chrome / Windows 11
- **Command used:** `npm test`

## Automated Test Run (`tests/checkout.spec.js`)

| ID | Test Name | Status | Actual Result / Notes |
|---|---|---|---|
| TC-01 | Successful checkout produces a confirmation | PASS | After entering the customer name and placing an order, the confirmation message appeared: "Thank you, kumar. Your order has been placed." |
| TC-02 | Missing name blocks checkout | PASS | Checkout was prevented when the name field was left empty. The validation message "Please enter your name to place the order." was displayed. |
| TC-03 | Quantity change updates the exact total | PASS | The quantity was changed and the line total and order total were verified against the expected values. The checkout test completed successfully. |

- **HTML report checked:** Yes
- **Screenshots folder (`test-results/`) checked:** [Yes / No]

## Manual Tests

### Empty Cart Checkout (TC-04)

- **Status:** PASS
- **Actual Result:** When Place Order was clicked with an empty cart, the application displayed: "Your cart is empty. Please add at least one item." No order confirmation was generated.
- **Notes / Evidence:** Tested checkout without adding any products to the cart. The application correctly prevented the order from being placed and displayed an appropriate validation message.

### Rapid Double-Click / Double Enter (TC-05)

- **Status:** PASS
- **Actual Result:** Only one order confirmation was generated when the Place Order button was clicked rapidly twice.
- **Notes / Evidence:**Tested by clicking the Place Order button twice quickly after entering the customer name and adding a product. The application processed the order only once and did not generate duplicate confirmations.

### Whitespace-Only Name (TC-06)

- **Status:** PASS
- **Actual Result:** When the name field contained only spaces, checkout was prevented and the message "Please enter your name to place the order." was displayed.
- **Notes / Evidence:** Entered blank spaces instead of a valid customer name and attempted to place the order. The application correctly rejected the input.

### Quantity Boundaries & Invalid Input (TC-07)

- **Status:**PASS
- **Actual Result:** The quantity controls handled minimum quantity limits and invalid quantity inputs correctly. Invalid quantities were not accepted.
- **Notes / Evidence:** Tested the quantity controls by changing product quantities and checking the permitted quantity limits. The application prevented invalid quantity values and maintained the correct order total.

### Place Another Order Reset (TC-08)

- **Status:** PASS
- **Actual Result:**After completing an order, the cart was cleared, the customer name field was reset, and the previous confirmation message disappeared.
- **Notes / Evidence:**Placed an order and checked the checkout page afterward. The application reset the checkout interface and allowed a new order to be started.

## Overall Test Summary

- **Automated tests:** 3
- **Automated tests passed:** 3
- **Automated tests failed:** 0
- **Manual tests performed:** 5
- **Manual tests passed:** 5
- **Manual tests failed:** 0

## Defects Observed

No defects were observed during the tests performed.

## Conclusion

The checkout application was tested using automated Playwright tests and manual browser testing. The tests covered successful checkout, required-name validation, quantity and total updates, empty-cart validation, rapid repeated submission, whitespace-only input, and starting another order.

The results above reflect the tests performed and the behaviour observed during testing.