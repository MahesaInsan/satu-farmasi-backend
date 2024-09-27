import { createSeedClient, SeedClient } from "@snaplet/seed";
import { faker } from '@faker-js/faker';
import UserService from "../../src/service/UserService";

const userService: UserService = new UserService();
const getDefaultPassword = async () => await userService.encryptPassword("password123");

const main = async () => {
    const seed: SeedClient = await createSeedClient();
    console.log("Resetting database ...")
    await seed.$resetDatabase();

    console.log("Start seeding database ...")
    const MAX_DATA: number = 50;

    await seedAdmin(seed);
    await seedingDoctor(seed, MAX_DATA);
    await seedPharmacist(seed, MAX_DATA);
    await seedPatient(seed, MAX_DATA);

    await seedPrescription(seed, MAX_DATA);
    await seedGenericName(seed, MAX_DATA);
    await seedClassification(seed, MAX_DATA);
    await seedPackaging(seed, MAX_DATA);

    await seedMedicine(seed, MAX_DATA);
    await seedMedicineHasClassification(seed, MAX_DATA);
    await seedPrescriptionHasMedicine(seed, MAX_DATA);

    await seedDiagnose(seed, MAX_DATA);
    await seedingVendor(seed, MAX_DATA);
    await seedMedicineReport(seed, MAX_DATA);
    await seedReceiveMedicine(seed, MAX_DATA);
    await seedOutputMedicine(seed, MAX_DATA);

    await seedTransaction(seed, MAX_DATA);
    console.log("Database seeded successfully!");

    process.exit();
};

const seedAdmin = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding admin ...")
    const hashedPassword = await getDefaultPassword();
    await seed.admin((createMany) =>
        createMany(amount, () => ({
            nik: generateRandomNIK(),
            email: "admin@gmail.com",
            password: hashedPassword,
            firstName: "Admin",
            lastName: "Admin",
            dob: faker.date.past(),
            phoneNum: generateRandomPhoneNum(),
            role: "ADMIN",
            is_active: true,
        }))
    );
    console.log("Admin seeded successfully!")
}

const seedingDoctor = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding doctor ...")
    const hashedPassword = await getDefaultPassword();
    await seed.doctor((createMany) =>
        createMany(amount, (data) => ({
            nik: generateRandomNIK(),
            email: `doctor${data.index + 1}@gmail.com`,
            password: hashedPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            dob: faker.date.past(),
            phoneNum: generateRandomPhoneNum(),
            specialist: "Dokter Umum",
            role: "DOCTOR",
            is_active: true,
        }))
    );
    console.log("Doctor seeded successfully!")
}

const seedPharmacist = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding pharmacist ...")
    const hashedPassword = await getDefaultPassword();
    await seed.pharmacist((createMany) =>
        createMany(amount, (data) => ({
            nik: generateRandomNIK(),
            email: `pharmacist${data.index + 1}@gmail.com`,
            password: hashedPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            dob: faker.date.past(),
            phoneNum: generateRandomPhoneNum(),
            role: "PHARMACIST",
            is_active: true,
        }))
    );
    console.log("Pharmacist seeded successfully!")
}

const seedPrescription = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding prescription ...")
    await seed.prescription((createMany) =>
        createMany(amount, (data) => ({
            patientId: data.index + 1,
            is_active: true,
        }))
    );
    console.log("Prescription seeded successfully!")
}

const seedPatient = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding patient ...")
    await seed.patient((createMany) =>
        createMany(amount, () => ({
            credentialNumber: generateRandomNIK(),
            phoneNum: generateRandomPhoneNum(),
            name: faker.person.fullName(),
            is_active: true,
        }))
    );
    console.log("Patient seeded successfully!")
}

const generateRandomNIK = () => {
    let nik = "";
    while (nik.length < 16) {
        nik += Math.floor(Math.random() * 10);
    }
    return nik;
}

const seedingVendor = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding admin ...")
    await seed.vendor((createMany) =>
        createMany(amount, (data) => ({
            name: `Vendor ${data.index + 1}`,
            phoneNum: generateRandomPhoneNum(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            is_active: true,
        }))
    );
    console.log("Vendor seeded successfully!")
};

const generateRandomPhoneNum = () => {
    let phoneNum = "+62";
    while (phoneNum.length < 13) {
        phoneNum += Math.floor(Math.random() * 10);
    }
    return phoneNum;
}

const seedPackaging = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding packaging ...")
    await seed.packaging((createMany) =>
        createMany(amount, (data) => ({
            label: `Packaging ${data.index + 1}`,
            value: `Packaging ${data.index + 1}`,
            is_active: true,
        }))
    );
    console.log("Packaging seeded successfully!")
}

const seedGenericName = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding generic name ...")
    await seed.genericName((createMany) =>
        createMany(amount, (data) => ({
            label: `Generic name ${data.index + 1}`,
            value: `Generic name ${data.index + 1}`,
            is_active: true,
        }))
    );
    console.log("Generic name seeded successfully!")
}

const seedClassification = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding classification ...")
    await seed.classification((createMany) =>
        createMany(amount, (data) => ({
            label: `Classification ${data.index + 1}`,
            value: `Classification ${data.index + 1}`,
            is_active: true,
        }))
    );
    console.log("Classification seeded successfully!")
}


const seedMedicine = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding medicine ...")

    await seed.medicine((createMany) =>
        createMany(amount, (data) => ({
            code: `MED${data.index + 1}`,
            name: `Medicine ${data.index + 1}`,
            merk: `Merk ${data.index + 1}`,
            description: `Description ${data.index + 1}`,
            price: Math.floor(Math.random() * 500000) + 150000,
            expiredDate: faker.date.future(),
            currStock: Math.floor(Math.random() * 100) + 1,
            minStock: Math.floor(Math.random() * 10) + 1,
            maxStock: Math.floor(Math.random() * 100) + 1,
            sideEffect: `Side effect ${data.index + 1}`,
            is_active: true,
        }))
    );
    console.log("Medicine seeded successfully!")
}

const seedMedicineHasClassification = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding medicine has classification ...")
    await seed.medicineHasClassification((createMany) =>
        createMany(amount, (data) => ({
            medicineId: data.index + 1,
        }))
    );
    console.log("Medicine has classification seeded successfully!")
}

const seedPrescriptionHasMedicine = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding prescription has medicine ...")
    // TODO: Create a total price logic
    await seed.prescriptionHasMedicine((createMany) =>
        createMany(amount, (data) => ({
            prescriptionId: data.index + 1,
            quantity: Math.floor(Math.random() * 10) + 1,
            instruction: faker.lorem.words({ min: 1, max: 3 }),
            totalPrice: Math.floor(Math.random() * 500000) + 150000,
        }))
    );
    console.log("Prescription has medicine seeded successfully!")
}

const seedDiagnose = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding diagnose ...")
    await seed.diagnose((createMany) =>
        createMany(amount, (data) => ({
            doctorId: data.index + 1,
            title: `Diagnose ${data.index + 1}`,
            description: faker.lorem.words({ min: 1, max: 3 }),
            is_active: true,
        }))
    );
    console.log("Diagnose seeded successfully!")
}

const seedMedicineReport = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding medicine report ...")
    await seed.medicineReport((createMany) =>
        createMany(amount, () => ({
            is_active: true,
        }))
    );
    console.log("Medicine report seeded successfully!")
}

const seedReceiveMedicine = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding receive medicine ...")
    await seed.receiveMedicine((createMany) =>
        createMany(amount, (data) => ({
            documentNumber: `Receive medicine ${data.index + 1}`,
            batchCode: `Batch code ${data.index + 1}`,
            quantity: Math.floor(Math.random() * 10) + 1,
            buyingPrice: Math.floor(Math.random() * 500000) + 150000,
            deadline: faker.date.future(),
            is_active: true,
        }))
    );
    console.log("Receive medicine seeded successfully!")
}

const seedOutputMedicine = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding output medicine ...")
    await seed.outputMedicine((createMany) =>
        createMany(amount, () => ({
            quantity: Math.floor(Math.random() * 10) + 1,
            is_active: true,
        }))
    );
    console.log("Output medicine seeded successfully!")
}

// TODO: create a logic for totla price
const seedTransaction = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding transaction ...")
    await seed.transaction((createMany) =>
        createMany(amount, () => ({
            totalPrice: Math.floor(Math.random() * 500000) + 150000,
            is_active: true,
        }))
    );
    console.log("Transation seeded successfully!")
}

main();
