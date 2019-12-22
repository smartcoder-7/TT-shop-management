const reservationId = '04346467-5325-4038-8259-16cee1f418b5'

const mockReservation = {
  id: reservationId,
  locationId: "0",
  reservationTime: 1575457200000,
  userId: "12345"
}

const mockUser = {
  firstName: 'Testy',
  lastName: 'McTesterson',
  id: '12345',
  createdAt: 1577049269567,
  email: 'test@test.com',
  hasActiveCard: true,
  stripeId: 'stripe12345',
}

const mockOrder = {
  id: 'test-order',
  createdAt: 1577049269567,
  userId: '12345',
  reservations: [reservationId],
}


module.exports = {
  mockUser,
  mockOrder,
  mockReservation,
}
