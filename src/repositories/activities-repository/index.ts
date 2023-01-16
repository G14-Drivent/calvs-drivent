import { cache, prisma } from "@/config";

async function findActivitiesDays() {
  const daysCache = await cache.get("days");
  if(daysCache) return JSON.parse(daysCache);

  const days = await prisma.activitiesDate.findMany();
  
  await cache.set("days", JSON.stringify(days));
  return days;
}

async function findActivitiesDayById(dateId: number) {
  const dayCache = await cache.get(`day/date:${dateId}`);
  if(dayCache) return JSON.parse(dayCache);

  const day = await prisma.activitiesDate.findFirst({
    where: {
      id: dateId,
    }
  });

  await cache.set(`day/date:${dateId}`, JSON.stringify(day));
  return day;
}

async function findActivitiesSpace() {
  const spacesCache = await cache.get("spaces");
  if(spacesCache) return JSON.parse(spacesCache);

  const spaces = await prisma.activitiesSpace.findMany();

  await cache.set("spaces", JSON.stringify(spaces));
  return spaces;
}

async function findActivitiesSpaceById(spaceId: number) {
  const spaceCache = await cache.get(`space/space:${spaceId}`);
  if(spaceCache) return JSON.parse(spaceCache);

  const space = await prisma.activitiesSpace.findFirst({
    where: {
      id: spaceId,
    }
  });

  await cache.set(`space/space:${spaceId}`, JSON.stringify(space));
  return space;
}

async function findActivities(dateId: number, spaceId: number) {
  const activitiesCache = await cache.get(`activities/date:${dateId}/space:${spaceId}`);
  if(activitiesCache) return JSON.parse(activitiesCache);

  const activities = await prisma.activities.findMany({
    where: {
      dateId: dateId,
      spaceId: spaceId,
    }
  });

  await cache.set(`activities/date:${dateId}/space:${spaceId}`, JSON.stringify(activities));
  return activities;
}

async function findActivitiesBookingCount(activitieId: number) {
  const countCache = await cache.get(`activityBookCount/activity:${activitieId}`);
  if(countCache) return JSON.parse(countCache);

  const count = await prisma.activitiesBooking.count({
    where: {
      activitieId: activitieId,
    }
  });

  await cache.set(`activityBookCount/activity:${activitieId}`, JSON.stringify(count));
  return count;
}

async function findActivitieBookedByUser(activitieId: number, userId: number) {
  return prisma.activitiesBooking.findFirst({
    where: {
      activitieId,
      Ticket: {
        Enrollment: {
          userId,
        }
      }
    }
  });
}

async function findActivitieById(activitieId: number) {
  return prisma.activities.findFirst({
    where: {
      id: activitieId,
    }
  });
}

async function findActivitiesBookingByUser(ticketId: number) {
  return prisma.activitiesBooking.findMany({
    where: {
      ticketId: ticketId,
    },
    include: {
      Activities: true,
    }
  });  
}

async function createActivityBooking(ticketId: number, activitieId: number) {
  await prisma.activitiesBooking.create({
    data: {
      ticketId,
      activitieId,
    }
  });

  await cache.flushAll();
  return;
}

const activitiesRepository = {
  findActivitiesDays,
  findActivitiesDayById,
  findActivitiesSpace,
  findActivitiesSpaceById,
  findActivities,
  findActivitiesBookingCount,
  findActivitieById,
  findActivitiesBookingByUser,
  createActivityBooking,
  findActivitieBookedByUser,
};

export default activitiesRepository;
