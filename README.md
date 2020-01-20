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


### Deploying
Add Heroku remote targets for staging and production using the CLI.
```
heroku login
git remote add heroku-pingpod-staging https://git.heroku.com/pingpod-staging.git 
git remote add heroku-pingpod https://git.heroku.com/pingpod.git 
```

To deploy to production, checkout the root directory and run:

```sh
yarn run deploy:production
```

This should set the heroku environment variables and deploy the latest build to production. 


### Other Setup
To generate a private key file for your Firebase service account:
```
In the Firebase console, open Settings > Service Accounts.
Click Generate New Private Key, then confirm by clicking Generate Key.
Securely store the JSON file containing the key.
```
Reference: https://firebase.google.com/docs/admin/setup


Autocharging reservations is scheduled in Heroku Scheduler via:
```sh
node server/jobs/autochargeReservations.js
```
This should be run every 10 minutes.