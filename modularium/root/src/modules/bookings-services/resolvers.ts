import { createResolvers } from '@/src/modules/bookings-services/axolotl.js';
import AuthorizedUserQuery from '@/src/modules/bookings-services/resolvers/AuthorizedUserQuery.js';
import AuthorizedUserMutation from '@/src/modules/bookings-services/resolvers/AuthorizedUserMutation.js';
import Client from '@/src/modules/bookings-services/resolvers/Client.js';
import ClientOps from '@/src/modules/bookings-services/resolvers/ClientOps.js';
import ClientQuery from '@/src/modules/bookings-services/resolvers/ClientQuery.js';
import Message from '@/src/modules/bookings-services/resolvers/Message.js';
import MessageThread from '@/src/modules/bookings-services/resolvers/MessageThread.js';
import SalonAnalytics from '@/src/modules/bookings-services/resolvers/SalonAnalytics.js';
import SalonClient from '@/src/modules/bookings-services/resolvers/SalonClient.js';
import SalonClientOps from '@/src/modules/bookings-services/resolvers/SalonClientOps.js';
import SalonOps from '@/src/modules/bookings-services/resolvers/SalonOps.js';
import SalonProfile from '@/src/modules/bookings-services/resolvers/SalonProfile.js';
import SalonQuery from '@/src/modules/bookings-services/resolvers/SalonQuery.js';
import Service from '@/src/modules/bookings-services/resolvers/Service.js';
import ServiceOps from '@/src/modules/bookings-services/resolvers/ServiceOps.js';
import Visit from '@/src/modules/bookings-services/resolvers/Visit.js';
import VisitOps from '@/src/modules/bookings-services/resolvers/VisitOps.js';

const resolvers = createResolvers({
  ...AuthorizedUserMutation,
  ...AuthorizedUserQuery,
  ...Client,
  ...ClientOps,
  ...ClientQuery,
  ...Message,
  ...MessageThread,
  ...SalonAnalytics,
  ...SalonClient,
  ...SalonClientOps,
  ...SalonOps,
  ...SalonProfile,
  ...SalonQuery,
  ...Service,
  ...ServiceOps,
  ...Visit,
  ...VisitOps,
});

export default resolvers;
