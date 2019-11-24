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
To deploy to production, checkout the root directory and run:

```sh
yarn run deploy
```

This should set the heroku environment variables and deploy the latest build to production. 