require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, Location, Hive, Inspection, IoTWeight, VetTask } = require("./src/models");

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME
  });
}

function daysAgo(days, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Location.deleteMany({}),
    Hive.deleteMany({}),
    Inspection.deleteMany({}),
    IoTWeight.deleteMany({}),
    VetTask.deleteMany({})
  ]);

  console.log("Collections cleared: User, Location, Hive, Inspection, IoTWeight, VetTask");
}

async function seedUsers() {
  const adminPassword = await bcrypt.hash("admin", 10);
  const beekeeperPassword = await bcrypt.hash("123456", 10);

  const users = await User.insertMany([
    {
      name: "Адміністратор",
      email: "admin@admin.com",
      password: adminPassword,
      role: "admin"
    },
    {
      name: "Тестовий Пасічник",
      email: "test@test.com",
      password: beekeeperPassword,
      role: "beekeeper"
    },
    {
      name: "Олена Пасічник",
      email: "olena@beesmart.com",
      password: beekeeperPassword,
      role: "beekeeper"
    },
    {
      name: "Іван Пасічник",
      email: "ivan@beesmart.com",
      password: beekeeperPassword,
      role: "beekeeper"
    },
    {
      name: "Марія Пасічник",
      email: "maria@beesmart.com",
      password: beekeeperPassword,
      role: "beekeeper"
    }
  ]);

  console.log(`Users created: ${users.length}`);
  return users;
}

async function seedLocations() {
  const locations = await Location.insertMany([
    {
      name: "Лісова точка",
      region: "Київська область",
      coordinates: { lat: 50.4501, lng: 30.5234 },
      max_capacity: 20,
      status: "active"
    },
    {
      name: "Степова точка",
      region: "Одеська область",
      coordinates: { lat: 46.4825, lng: 30.7233 },
      max_capacity: 15,
      status: "active"
    },
    {
      name: "Річкова точка",
      region: "Черкаська область",
      coordinates: { lat: 49.4444, lng: 32.0598 },
      max_capacity: 18,
      status: "active"
    },
    {
      name: "Гірська точка",
      region: "Львівська область",
      coordinates: { lat: 49.8397, lng: 24.0297 },
      max_capacity: 22,
      status: "active"
    }
  ]);

  console.log(`Locations created: ${locations.length}`);
  return locations;
}

async function seedHives(locations) {
  const [forestLocation, steppeLocation, riverLocation, mountainLocation] = locations;

  const hivesPayload = [
    {
      qr_code: "HIVE-001",
      location_id: forestLocation._id,
      type: "Dadan 10-frame",
      status: "healthy",
      queen: { breed: "Карніка", year: 2024, color_mark: "зелена" },
      installed_at: daysAgo(120)
    },
    {
      qr_code: "HIVE-002",
      location_id: forestLocation._id,
      type: "Langstroth",
      status: "healthy",
      queen: { breed: "Бакфаст", year: 2023, color_mark: "червона" },
      installed_at: daysAgo(100)
    },
    {
      qr_code: "HIVE-003",
      location_id: forestLocation._id,
      type: "Український лежак",
      status: "weak",
      queen: { breed: "Українська степова", year: 2022, color_mark: "жовта" },
      installed_at: daysAgo(90)
    },
    {
      qr_code: "HIVE-004",
      location_id: steppeLocation._id,
      type: "Dadan 12-frame",
      status: "healthy",
      queen: { breed: "Карніка", year: 2024, color_mark: "зелена" },
      installed_at: daysAgo(80)
    },
    {
      qr_code: "HIVE-005",
      location_id: steppeLocation._id,
      type: "Langstroth",
      status: "needs_attention",
      queen: { breed: "Бакфаст", year: 2021, color_mark: "біла" },
      installed_at: daysAgo(70)
    },
    {
      qr_code: "HIVE-006",
      location_id: steppeLocation._id,
      type: "Рут",
      status: "healthy",
      queen: { breed: "Карпатка", year: 2023, color_mark: "червона" },
      installed_at: daysAgo(60)
    },
    {
      qr_code: "HIVE-007",
      location_id: riverLocation._id,
      type: "Dadan 10-frame",
      status: "healthy",
      queen: { breed: "Карніка", year: 2024, color_mark: "синя" },
      installed_at: daysAgo(55)
    },
    {
      qr_code: "HIVE-008",
      location_id: riverLocation._id,
      type: "Langstroth",
      status: "weak",
      queen: { breed: "Бакфаст", year: 2022, color_mark: "жовта" },
      installed_at: daysAgo(52)
    },
    {
      qr_code: "HIVE-009",
      location_id: mountainLocation._id,
      type: "Український лежак",
      status: "healthy",
      queen: { breed: "Карпатка", year: 2023, color_mark: "червона" },
      installed_at: daysAgo(48)
    },
    {
      qr_code: "HIVE-010",
      location_id: mountainLocation._id,
      type: "Dadan 12-frame",
      status: "sick",
      queen: { breed: "Карніка", year: 2021, color_mark: "біла" },
      installed_at: daysAgo(44)
    },
    {
      qr_code: "HIVE-011",
      location_id: forestLocation._id,
      type: "Langstroth",
      status: "healthy",
      queen: { breed: "Бакфаст", year: 2024, color_mark: "зелена" },
      installed_at: daysAgo(40)
    },
    {
      qr_code: "HIVE-012",
      location_id: steppeLocation._id,
      type: "Рут",
      status: "needs_attention",
      queen: { breed: "Українська степова", year: 2022, color_mark: "червона" },
      installed_at: daysAgo(35)
    }
  ];

  const hives = await Hive.insertMany(hivesPayload);
  console.log(`Hives created: ${hives.length}`);
  return hives;
}

async function seedInspections(hives, beekeepers) {
  const temperament = ["спокійні", "помірно активні", "збуджені"];
  const inspectionsPayload = [];

  hives.forEach((hive, hiveIndex) => {
    for (let i = 0; i < 6; i += 1) {
      const beekeeper = beekeepers[(hiveIndex + i) % beekeepers.length];
      inspectionsPayload.push({
        hive_id: hive._id,
        user_id: beekeeper._id,
        date: daysAgo(12 - i * 2, 9 + (i % 6)),
        details: {
          brood_frames: Math.max(1, 4 + ((hiveIndex + i) % 6)),
          honey_frames: Math.max(1, 2 + ((hiveIndex + i * 2) % 7)),
          temper: temperament[(hiveIndex + i) % temperament.length],
          notes: `Плановий огляд #${i + 1} для ${hive.qr_code}`
        }
      });
    }
  });

  const inspections = await Inspection.insertMany(inspectionsPayload);

  console.log(`Inspections created: ${inspections.length}`);
  return inspections;
}

async function seedIoTWeights(hives) {
  const payload = [];

  hives.forEach((hive, hiveIndex) => {
    for (let i = 0; i < 14; i += 1) {
      payload.push({
        hive_id: hive._id,
        weight_kg: Number((42 + hiveIndex * 0.9 + i * 0.25).toFixed(2)),
        battery_level: Math.max(40, 98 - i * 2),
        timestamp: daysAgo(14 - i, 8)
      });
    }
  });

  const weights = await IoTWeight.insertMany(payload);

  console.log(`IoT weights created: ${weights.length}`);
  return weights;
}

async function seedVetTasks(hives, beekeepers) {
  const taskTypes = [
    { task_type: "Обробка від кліща", medication: "Біпін-Т" },
    { task_type: "Лікування нозематозу", medication: "Нозевіт" },
    { task_type: "Санація вулика", medication: "Щавлева кислота" }
  ];

  const payload = [];
  hives.forEach((hive, hiveIndex) => {
    for (let i = 0; i < 3; i += 1) {
      const beekeeper = beekeepers[(hiveIndex + i) % beekeepers.length];
      const type = taskTypes[(hiveIndex + i) % taskTypes.length];
      payload.push({
        hive_id: hive._id,
        assigned_to: beekeeper._id,
        task_type: type.task_type,
        medication: type.medication,
        status: i === 0 ? "pending" : "completed",
        due_date: daysAgo(i - 2, 10 + i)
      });
    }
  });

  const tasks = await VetTask.insertMany(payload);

  console.log(`Vet tasks created: ${tasks.length}`);
  return tasks;
}

async function runSeed() {
  try {
    await connectToDatabase();
    console.log("MongoDB connected for seeding");

    await clearCollections();

    const users = await seedUsers();
    const locations = await seedLocations();
    const hives = await seedHives(locations);
    const beekeepers = users.filter((user) => user.role === "beekeeper");
    await seedInspections(hives, beekeepers);
    await seedIoTWeights(hives);
    await seedVetTasks(hives, beekeepers);

    console.log("Seeding completed successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

runSeed();
