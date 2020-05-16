import { Dimensions } from 'react-native';

// export const BACKEND_IP = 'http://10.0.2.2:3000';
// export const BACKEND_IP = 'http://192.168.0.2:3000';
export const BACKEND_IP = 'https://adocferrybooking.herokuapp.com';
const DEVICE_WIDTH = Dimensions.get('window').width;
export const FONT_SCALE_FACTOR = 0.000005 * (DEVICE_WIDTH ** 2.15);

export const trip = {
  typeWeight: {
    Scheduled: 0,
    Additional: 1,
  },
  types: {
    SCHEDULED: 'Scheduled',
    ADDITIONAL: 'Additional',
  },
  statuses: {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  },
  estTime: {
    1: '0700 - 0715',
    2: '0715 - 0730',
    3: '0730 - 0745',
    4: '0745 - 0800',
  },
};

export const ticket = {
  statuses: {
    VALID: 'Valid',
    REDEEMED: 'Redeemed',
    EXPIRED: 'Expired',
    CANCELLED: 'Cancelled',
  },
};

export const socketRoutes = {
  TICKET_BOOKED: 'ticket.booked',
  TICKET_APPROVE: 'ticket.approve',
  TRIP_START: 'trip.start',
  TRIP_END: 'trip.end',
  TRIPS_INITIALIZE: 'trip.initialize',
};

export const REQUEST_TIMEOUT_MS = 20000;
