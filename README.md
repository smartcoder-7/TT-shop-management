# pingpod-web

Web application for PINGPOD.

User flow:

- Select sessions by id (0-1234567890) where:
  - 0 is the locationId
  - 1234567890 is the unix timestamp

- Add sessions to localStorage for cart usage.

- (If not logged in) log in or create an account.
  - Redirect back to previous page

- Checkout!
  - (If no billing info) add billing info to account.
    - Redirect back to previous page
  - Make reservations

