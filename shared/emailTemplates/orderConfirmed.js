const orderConfirmed = {
  subject: 'You\'re booked!',
  text: `Yay! Your reservations are confirmed: ${reservationIds.join(',')}`,
  html: `
    <h1>Table time confirmed.</h1>
    <p>Reservations: ${reservationIds.join(',')}</p>
  `
}