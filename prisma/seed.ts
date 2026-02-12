import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create default admin
  const passwordHash = await hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@juuksur.ee" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@juuksur.ee",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // Create salon settings
  await prisma.salonSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      salonName: "Hair Salon",
      salonNameEt: "Juuksurisalong",
      address: "Tallinn, Estonia",
      phone: "+372 5555 5555",
      email: "info@juuksur.ee",
      timeSlotInterval: 15,
      bookingLeadTime: 60,
      maxAdvanceDays: 30,
    },
  });

  // Create barbers
  const barber1 = await prisma.barber.upsert({
    where: { email: "mari@juuksur.ee" },
    update: {},
    create: {
      name: "Mari Tamm",
      email: "mari@juuksur.ee",
      phone: "+372 5111 1111",
      bio: "Experienced hair stylist with 10 years of experience.",
      bioEt: "Kogenud juuksur 10-aastase kogemusega.",
      isActive: true,
      sortOrder: 1,
    },
  });

  const barber2 = await prisma.barber.upsert({
    where: { email: "kati@juuksur.ee" },
    update: {},
    create: {
      name: "Kati Kask",
      email: "kati@juuksur.ee",
      phone: "+372 5222 2222",
      bio: "Specialist in coloring and modern haircuts.",
      bioEt: "Spetsialiseerunud värvimisele ja moodsatele soengutele.",
      isActive: true,
      sortOrder: 2,
    },
  });

  const barber3 = await prisma.barber.upsert({
    where: { email: "jaan@juuksur.ee" },
    update: {},
    create: {
      name: "Jaan Mets",
      email: "jaan@juuksur.ee",
      phone: "+372 5333 3333",
      bio: "Barber specializing in men's cuts and beard grooming.",
      bioEt: "Meeste lõikuste ja habemehoolduse spetsialist.",
      isActive: true,
      sortOrder: 3,
    },
  });

  // Create services
  const haircut = await prisma.service.create({
    data: {
      name: "Haircut",
      nameEt: "Juukselõikus",
      description: "Classic haircut with wash and styling",
      descriptionEt: "Klassikaline juukselõikus pesemise ja viimistlusega",
      category: "Haircut",
      categoryEt: "Lõikus",
      sortOrder: 1,
    },
  });

  const coloring = await prisma.service.create({
    data: {
      name: "Hair Coloring",
      nameEt: "Juuste värvimine",
      description: "Full hair coloring with premium products",
      descriptionEt: "Juuste täisvärvimine kvaliteettoodetega",
      category: "Coloring",
      categoryEt: "Värvimine",
      sortOrder: 2,
    },
  });

  const beardTrim = await prisma.service.create({
    data: {
      name: "Beard Trim",
      nameEt: "Habeme trimmerdamine",
      description: "Professional beard shaping and trimming",
      descriptionEt: "Professionaalne habeme kujundamine ja trimmerdamine",
      category: "Beard",
      categoryEt: "Habe",
      sortOrder: 3,
    },
  });

  const styling = await prisma.service.create({
    data: {
      name: "Blow Dry & Styling",
      nameEt: "Föönamine ja soeng",
      description: "Wash, blow dry and styling",
      descriptionEt: "Pesemine, föönamine ja soengu tegemine",
      category: "Styling",
      categoryEt: "Soeng",
      sortOrder: 4,
    },
  });

  const highlights = await prisma.service.create({
    data: {
      name: "Highlights",
      nameEt: "Kiharad / Highlights",
      description: "Partial or full highlights",
      descriptionEt: "Osaline või täis kiharad",
      category: "Coloring",
      categoryEt: "Värvimine",
      sortOrder: 5,
    },
  });

  // Assign services to barbers with individual pricing
  const barberServiceData = [
    { barberId: barber1.id, serviceId: haircut.id, price: 25, duration: 30 },
    { barberId: barber1.id, serviceId: coloring.id, price: 60, duration: 90 },
    { barberId: barber1.id, serviceId: styling.id, price: 20, duration: 30 },
    { barberId: barber1.id, serviceId: highlights.id, price: 80, duration: 120 },
    { barberId: barber2.id, serviceId: haircut.id, price: 30, duration: 30 },
    { barberId: barber2.id, serviceId: coloring.id, price: 65, duration: 90 },
    { barberId: barber2.id, serviceId: styling.id, price: 25, duration: 30 },
    { barberId: barber2.id, serviceId: highlights.id, price: 85, duration: 120 },
    { barberId: barber3.id, serviceId: haircut.id, price: 20, duration: 25 },
    { barberId: barber3.id, serviceId: beardTrim.id, price: 15, duration: 20 },
  ];

  for (const data of barberServiceData) {
    await prisma.barberService.create({ data });
  }

  // Create work schedules (Mon-Fri 9:00-18:00, Sat 10:00-16:00)
  const barbers = [barber1, barber2, barber3];
  for (const barber of barbers) {
    // Monday to Friday
    for (let day = 1; day <= 5; day++) {
      await prisma.workSchedule.create({
        data: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          isWorking: true,
        },
      });
    }
    // Saturday
    await prisma.workSchedule.create({
      data: {
        barberId: barber.id,
        dayOfWeek: 6,
        startTime: "10:00",
        endTime: "16:00",
        isWorking: true,
      },
    });
    // Sunday - off
    await prisma.workSchedule.create({
      data: {
        barberId: barber.id,
        dayOfWeek: 0,
        startTime: "00:00",
        endTime: "00:00",
        isWorking: false,
      },
    });
    // Lunch break Mon-Fri
    for (let day = 1; day <= 5; day++) {
      await prisma.scheduleBreak.create({
        data: {
          barberId: barber.id,
          dayOfWeek: day,
          startTime: "12:00",
          endTime: "13:00",
          label: "Lunch",
        },
      });
    }
  }

  console.log("Seed complete!");
  console.log("Admin login: admin@juuksur.ee / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
