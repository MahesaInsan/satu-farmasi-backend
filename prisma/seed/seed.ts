// Command:
// npx @snaplet/seed init prisma/seed
// npm run seed

import { createSeedClient, SeedClient } from "@snaplet/seed";
import { faker } from '@faker-js/faker';
import UserService from "../../src/service/UserService";
import VendorList from "./vendor.json"
import MedicineList from "./medicine.json"
import PatientList from "./patient.json"
import MedicineService from "../../src/service/MedicineService"

const userService: UserService = new UserService();
const getDefaultPassword = async () => await userService.encryptPassword("password123");

const VENDOR_SIZE: number = VendorList.length
const PATIENT_SIZE: number = PatientList.length

const STOCK = {
    MIN: 1,
    MAX: 50
}

let packagingList: Map<string, number> = new Map<string, number>();
let genericNameList: Map<string, number> = new Map<string, number>();
let classificationList: Map<string, number> = new Map<string, number>();

const medicineService = new MedicineService()

const main = async () => {
    const seed: SeedClient = await createSeedClient();
    console.info("Resetting database ...")
    await seed.$resetDatabase();

    console.log("Start seeding database ...")
    const MAX_DATA: number = 50;

    // Seed User
    await seedAdmin(seed)
    await seedingDoctor(seed, 3)
    await seedPharmacist(seed, 3)
    await seedPatient(seed);
    await seedPharmacy(seed);

    // Seed Medicine
    initMedicine()
    await seedGenericName(seed);
    await seedPackaging(seed);
    await seedingVendor(seed);
    await seedClassification(seed);
    await seedMedicine(seed);
    await seedMedicineHasClassification(seed);

    console.info("Database seeded successfully!");

    process.exit();
};

const seedAdmin = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding admin ...")
    const hashedPassword = await getDefaultPassword();
    await seed.user((createMany) =>
        createMany(amount, () => ({
            nik: generateRandomNIK(),
            email: "admin@gmail.com",
            password: hashedPassword,
            firstName: "Admin",
            lastName: "Admin",
            dob: faker.date.past(),
            phoneNum: generateRandomPhoneNum(),
            specialist: null,
            sipaNum: null,
            role: "ADMIN",
            is_active: true,
        }))
    );
    console.log("Admin seeded successfully!")
}

const seedingDoctor = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding doctor ...")
    const hashedPassword = await getDefaultPassword();
    await seed.user((createMany) =>
        createMany(amount, (data) => ({
            nik: generateRandomNIK(),
            email: `doctor${data.index + 1}@gmail.com`,
            password: hashedPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            dob: faker.date.past(),
            phoneNum: generateRandomPhoneNum(),
            specialist: "Dokter Umum",
            sipaNum: null,
            role: "DOCTOR",
            is_active: true,
        }))
    );
    console.log("Doctor seeded successfully!")
}

const seedPharmacist = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding pharmacist ...")
    const hashedPassword = await getDefaultPassword();
    await seed.user((createMany) =>
        createMany(amount, (data) => ({
            nik: generateRandomNIK(),
            email: `pharmacist${data.index + 1}@gmail.com`,
            password: hashedPassword,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            dob: faker.date.past(),
            phoneNum: generateRandomPhoneNum(),
            specialist: null,
            sipaNum: "001/001/001",
            role: "PHARMACIST",
            is_active: true,
        }))
    );
    console.log("Pharmacist seeded successfully!")
}

const seedPatient = async (seed: SeedClient) => {
    console.info("Seeding patient ...")
    await seed.patient((createMany) =>
        createMany(PATIENT_SIZE, (data) => ({
            credentialNumber: PatientList[data.index].credentialNumber,
            phoneNum: generateRandomPhoneNum(),
            name: PatientList[data.index].name,
            is_active: true,
        }))
    );
    console.info("Patient seeded successfully!")
}

const generateRandomNIK = () => {
    let nik = "";
    while (nik.length < 16) {
        nik += Math.floor(Math.random() * 10);
    }
    return nik;
}

const seedingVendor = async (seed: SeedClient) => {
    console.info("Seeding vendor ...")
    await seed.vendor((createMany) =>
        createMany(VENDOR_SIZE, (data) => ({
            name: VendorList[data.index].name,
            phoneNum: generateRandomPhoneNum(),
            address: VendorList[data.index].address,
            city: VendorList[data.index].city,
            is_active: true,
        }))
    );
    console.info("Vendor seeded successfully!")
};

const generateRandomPhoneNum = () => {
    let phoneNum = "62";
    while (phoneNum.length < 13) {
        phoneNum += Math.floor(Math.random() * 10);
    }
    return phoneNum;
}

const seedPackaging = async (seed: SeedClient) => {
    console.info("Seeding packaging ...")
    for (const [key] of packagingList.entries()) {
         await seed.packaging((createMany) =>
            createMany(1, () => ({
                label: key,
                value: key,
                is_active: true,
            }))
        )
    }
    console.info("Packaging seeded successfully!")
}

const seedGenericName = async (seed: SeedClient) => {
    console.info("Seeding generic name ...")
    for (const [key] of genericNameList.entries()) {
         await seed.genericName((createMany) =>
            createMany(1, () => ({
                label: key,
                value: key,
                is_active: true,
            }))
        )
    }
    console.info("Generic name seeded successfully!")
}

const seedClassification = async (seed: SeedClient) => {
    console.info("Seeding classification ...")
    for (const [key] of classificationList.entries()) {
         await seed.classification((createMany) =>
            createMany(1, () => ({
                label: key,
                value: key,
                is_active: true,
            }))
        )
    }
    console.info("Classification seeded successfully!")
}

const seedMedicine = async (seed: SeedClient) => {
    console.info("Seeding medicine ...")
    for (const item of MedicineList) {
        const { medicine, merk, packaging, genericName } = item
        const genericNameId = genericNameList.get(genericName)
        const packagingId = packagingList.get(packaging)

        if (genericNameId && packagingId) {
            const medicineCode = await medicineService.generateMedicineCode(genericNameId)
            await seed.medicine((createMany) =>
                createMany(1, () => ({
                    code: medicineCode,
                    name: medicine,
                    merk: merk,
                    description: "Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.",
                    genericNameId: genericNameId,
                    packagingId: packagingId,
                    price: Math.floor(Math.random() * 500000) + 150000,
                    expiredDate: faker.date.future(),
                    currStock: Math.floor(Math.random() * STOCK.MAX) + STOCK.MIN,
                    reservedStock: 0,
                    minStock: STOCK.MIN,
                    maxStock: STOCK.MAX,
                    sideEffect: "Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.",
                    is_active: true,
                }))
            );
        }
    }
    console.info("Medicine seeded successfully!")
}

const initMedicine = () => {
    MedicineList.forEach(medicine => {
        const { packaging, genericName, classification } = medicine
        addNewPackaging(packaging)
        addNewGenericName(genericName)
        addNewClassification(classification)
    })
}

const addNewPackaging = (key: string): void => {
    if (packagingList.has(key)) return
    const lastIndex: number = packagingList.size
    packagingList.set(key, lastIndex + 1)
}


const addNewGenericName = (key: string): void => {
    if (genericNameList.has(key)) return
    const lastIndex: number = genericNameList.size
    genericNameList.set(key, lastIndex + 1)
}

const addNewClassification = (classifications: string[]): void => {
    classifications.forEach(classification => {
        if (classificationList.has(classification)) return
        const lastIndex: number = classificationList.size
        classificationList.set(classification, lastIndex + 1)
    })
}

const seedMedicineHasClassification = async (seed: SeedClient) => {
    console.info("Seeding medicine has classification...")
    for (const medicine of MedicineList) {
        const { id, classification } = medicine
        for ( const item of classification ) {
            const classificationId = classificationList.get(item)
            if (classificationId) {
                await seed.medicineHasClassification((createMany) =>
                    createMany(1, () => ({
                        medicineId: id,
                        classificationId: classificationId
                    }))
                );
            }
        }
    }
    console.info("Medicine has classification seeded successfully!")
}


const seedPharmacy = async (seed: SeedClient) => {
    console.info("Seeding pharmacy ...")
     await seed.pharmacy((createMany) =>
        createMany(1, () => ({
            name: "Satu Farmasi",
            pharmacyNum: "Farmasi123",
            phoneNum: generateRandomPhoneNum(),
            address: "Jl Imam Bonjol",
            email: "satufarmasi@gmail.com",
        }))
    )
    console.info("Pharmacy seeded successfully!")
}
main();
