// Command:
// npx @snaplet/seed init prisma/seed
// npm run seed

import { createSeedClient, SeedClient } from "@snaplet/seed";
import { faker } from '@faker-js/faker';
import UserService from "../../src/service/UserService";
import {
    Classification,
    GenericName,
    Medicine,
    MedicineReport,
    Packaging,
    Patient,
    PaymentMethod,
    Prescription,
    PrescriptionHasMedicine,
    PrismaClient,
    Vendor
} from "@prisma/client";
import DoctorVO from "../../src/model/VOs/DoctorVO";

const userService: UserService = new UserService();
const getDefaultPassword = async () => await userService.encryptPassword("password123");
const prisma: PrismaClient = new PrismaClient();

const STOCK = {
    MIN: 1,
    MAX: 50
}

const main = async () => {
    const seed: SeedClient = await createSeedClient();
    console.log("Resetting database ...")
    await seed.$resetDatabase();

    console.log("Start seeding database ...")
    const MAX_DATA: number = 50;

    await seedAdmin(seed, 1);
    await seedingDoctor(seed, 3);
    await seedPharmacist(seed,3);

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
            sipaNum: "SIPA123",
            role: "PHARMACIST",
            is_active: true,
        }))
    );
    console.log("Pharmacist seeded successfully!")
}

const seedPrescription = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding prescription ...")
    const patient: Patient[] = await prisma.patient.findMany({ where: { is_active: true } });
    await seed.prescription((createMany) =>
        createMany(amount, () => ({
            is_active: true,
            patientId: patient[Math.floor(Math.random() * patient.length)].id,
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
    const codePrefix: String[] = [
        "PARACETAMOL",
        "IBUPROFEN",
        "ANALGESIK"
    ]
    const genericName: GenericName[] = await prisma.genericName.findMany({ where: { is_active: true } });
    const packaging: Packaging[] = await prisma.packaging.findMany({ where: { is_active: true } });
    await seed.medicine((createMany) =>
        createMany(amount, (data) => ({
            code: `${codePrefix[Math.floor(Math.random() * codePrefix.length)]}-${Math.floor(Math.random() * 5 + 1)}`,
            name: `Medicine ${data.index + 1}`,
            merk: `Merk ${data.index + 1}`,
            description: `Description ${data.index + 1}`,
            genericNameId: genericName[Math.floor(Math.random() * genericName.length)].id,
            packagingId: packaging[Math.floor(Math.random() * packaging.length)].id,
            price: Math.floor(Math.random() * 500000) + 150000,
            expiredDate: faker.date.future(),
            currStock: Math.floor(Math.random() * STOCK.MAX) + STOCK.MIN,
            reservedStock: 0,
            minStock: STOCK.MIN,
            maxStock: STOCK.MAX,
            sideEffect: `Side effect ${data.index + 1}`,
            is_active: true,
        }))
    );
    console.log("Medicine seeded successfully!")
}

const seedMedicineHasClassification = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding medicine has classification ...")
    const classification: Classification[] = await prisma.classification.findMany({ where: { is_active: true } });
    await seed.medicineHasClassification((createMany) =>
        createMany(amount, (data) => ({
            medicineId: data.index + 1,
            classificationId: classification[Math.floor(Math.random() * classification.length)].id,
        }))
    );
    console.log("Medicine has classification seeded successfully!")
}

const seedPrescriptionHasMedicine = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding prescription has medicine ...")
    const medicine: Medicine[] = await prisma.medicine.findMany({ where: { is_active: true } });
    await seed.prescriptionHasMedicine((createMany) =>
        createMany(amount, (data) => ({
            prescriptionId: data.index + 1,
            medicineId: medicine[data.index].id,
            medicineCode: medicine[data.index].code,
            quantity: 10,
            instruction: faker.lorem.words({ min: 5, max: 10 }),
            totalPrice: Number(medicine[data.index].price) * 10,
            draft: Math.random() < 0.5
        }))
    );
    console.log("Prescription has medicine seeded successfully!")
}

const seedDiagnose = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding diagnose ...")
    const doctor: DoctorVO[] = await prisma.user.findMany({ where: { is_active: true, role: 'DOCTOR' } });
    await seed.diagnose((createMany) =>
        createMany(amount, (data) => ({
            doctorId: doctor[Math.floor(Math.random() * doctor.length)].id,
            prescriptionId: data.index + 1,
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
    const medicine: Medicine[] = await prisma.medicine.findMany({ where: { is_active: true } });
    const vendor: Vendor[] = await prisma.vendor.findMany({ where: { is_active: true } });
    const medicineReport: MedicineReport[] = await prisma.medicineReport.findMany({ where: { is_active: true } });
    await seed.receiveMedicine((createMany) =>
        createMany(amount, (data) => ({
            documentNumber: `Receive medicine ${data.index + 1}`,
            medicineId: medicine[Math.floor(Math.random() * medicine.length)].id,
            vendorId: vendor[Math.floor(Math.random() * vendor.length)].id,
            reportId: medicineReport[Math.floor(Math.random() * medicineReport.length)].id,
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
    const medicine: Medicine[] = await prisma.medicine.findMany({ where: { is_active: true } });
    const report: MedicineReport[] = await prisma.medicineReport.findMany({ where: { is_active: true } });
    await seed.outputMedicine((createMany) =>
        createMany(amount, () => ({
            medicineId: medicine[Math.floor(Math.random() * medicine.length)].id,
            quantity: Math.floor(Math.random() * 10) + 1,
            reportId: report[Math.floor(Math.random() * report.length)].id,
            is_active: true,
        }))
    );
    console.log("Output medicine seeded successfully!")
}

const seedTransaction = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding transaction ...")
    const patient: Patient[] = await prisma.patient.findMany({ where: { is_active: true } });
    const pharmacist: DoctorVO[] = await prisma.user.findMany({ where: { is_active: true, role: 'DOCTOR' } });
    const medicineReport: MedicineReport[] = await prisma.medicineReport.findMany({ where: { is_active: true } });

    const prescription: Prescription[] = await prisma.prescription.findMany({ where: { is_active: true } });
    const paymentMethod = Object.values(PaymentMethod)
    let totalPrice: Array<number> = Array(prescription.length).fill(0);
    for (let i = 0; i < totalPrice.length; i++) {
        const prescriptionHasMedicine: PrescriptionHasMedicine[] = await prisma.prescriptionHasMedicine.findMany({ where: { prescriptionId: prescription[i].id } });
        let subTotalPrice: number  = 0;
        prescriptionHasMedicine.forEach((prescription) => {
            subTotalPrice += Number(prescription.totalPrice);
        })
        totalPrice[i] = subTotalPrice;
    }

    await seed.transaction((createMany) =>
        createMany(amount, (data) => ({
            patientId: patient[Math.floor(Math.random() * patient.length)].id,
            reportId: medicineReport[Math.floor(Math.random() * medicineReport.length)].id,
            prescriptionId: prescription[data.index].id,
            pharmacistId: pharmacist[Math.floor(Math.random() * pharmacist.length)].id,
            totalPrice: totalPrice[data.index],
            paymentMethod: paymentMethod[Math.floor(Math.random() * paymentMethod.length)],
            is_active: true,
        }))
    );
    console.log("Transation seeded successfully!")
}

main();
