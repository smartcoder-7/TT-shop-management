# Table management

Web application for Table management.

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


Session Ids:
0-123456789


### Development
Watch the frontend code via webpack-dev-server in one tab:

```sh
yarn install
yarn run watch:dev
```

And run the Node server in another:
```sh
yarn run start:dev
```

Open http://localhost:8000/ in your browser, et voila!

### Other Setup
To generate a private key file for your Firebase service account:
```
In the Firebase console, open Settings > Service Accounts.
Click Generate New Private Key, then confirm by clicking Generate Key.
Securely store the JSON file containing the key.
```
Reference: https://firebase.google.com/docs/admin/setup
