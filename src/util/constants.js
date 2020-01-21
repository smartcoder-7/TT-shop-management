export const STRIPE_PUBLISHABLE_KEY = process.env.NODE_ENV === 'production'
  ? "pk_live_8xV5aHeoCWn7ytn2oVafTEXO00jzfM8SyH"
  : "pk_test_bSBO5XP4O4ZDNFrPuA9KIcj700gbXATm49"
export const INTERVAL_MS = 1000 * 60 * 30
