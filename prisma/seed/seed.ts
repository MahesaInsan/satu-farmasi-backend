// Command:
// npx @snaplet/seed init prisma/seed
// npm run seed

import { createSeedClient, SeedClient } from "@snaplet/seed";
import { faker } from "@faker-js/faker";
import UserService from "../../src/service/UserService";
import MedicineService from "../../src/service/MedicineService";
import VendorList from "./vendor.json";
import MedicineList from "./medicine.json";
import PatientList from "./patient.json";
import PrescriptionList from "./prescirption.json";
import BaseResponse from "../../src/model/response/BaseResponse";
import PrescriptionSumaryVO from "../../src/model/VOs/PrescriptionSummaryVO";
import ConfirmPayRequest from "../../src/model/request/ConfirmPayRequest";
import PaginataionRequest from "../../src/model/request/PaginationRequest";
import { Pharmacy, Prisma, User } from "@prisma/client";
import AddPhysicalReportRequest from "../../src/model/request/AddPhysicalReportRequest";
import PaginationRequest from "../../src/model/request/PaginationRequest";

const userService: UserService = new UserService();
const getDefaultPassword = async () =>
    await userService.encryptPassword("password123");

const VENDOR_SIZE: number = VendorList.length;
const PATIENT_SIZE: number = PatientList.length;
const DOMAIN = "http://localhost:8000";

const STOCK = {
    MIN: 1,
    MAX: 300,
};

let packagingList: Map<string, number> = new Map<string, number>();
let genericNameList: Map<string, number> = new Map<string, number>();
let classificationList: Map<string, number> = new Map<string, number>();

const medicineService = new MedicineService();
const baseResponse = new BaseResponse();

const main = async () => {
    const seed: SeedClient = await createSeedClient();
    console.info("Resetting database ...");
    await seed.$resetDatabase();

    console.log("Start seeding database ...");
    const MAX_DATA: number = 50;

    // Seed User
    await seedAdmin(seed);
    await seedingDoctor(seed, 3);
    await seedPharmacist(seed, 3);
    await seedPatient(seed);
    await seedPharmacy(seed);

    // Seed Medicine
    initMedicine();
    await seedGenericName(seed);
    await seedPackaging(seed);
    await seedingVendor(seed);
    await seedClassification(seed);
    await seedMedicine(seed);
    await seedMedicineHasClassification(seed);

    await seedPrescription();
    await seedTransaction();

    console.info("Database seeded successfully!");

    process.exit();
};

const seedAdmin = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding admin ...");
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
        })),
    );
    console.log("Admin seeded successfully!");
};

const seedingDoctor = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding doctor ...");
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
        })),
    );
    console.log("Doctor seeded successfully!");
};

const seedPharmacist = async (seed: SeedClient, amount: number = 1) => {
    console.log("Seeding pharmacist ...");
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
        })),
    );
    console.log("Pharmacist seeded successfully!");
};

const seedPatient = async (seed: SeedClient) => {
    console.info("Seeding patient ...");
    await seed.patient((createMany) =>
        createMany(PATIENT_SIZE, (data) => ({
            credentialNumber: PatientList[data.index].credentialNumber,
            phoneNum: generateRandomPhoneNum(),
            name: PatientList[data.index].name,
            is_active: true,
        })),
    );
    console.info("Patient seeded successfully!");
};

const generateRandomNIK = () => {
    let nik = "";
    while (nik.length < 16) {
        nik += Math.floor(Math.random() * 10);
    }
    return nik;
};

const seedingVendor = async (seed: SeedClient) => {
    console.info("Seeding vendor ...");
    await seed.vendor((createMany) =>
        createMany(VENDOR_SIZE, (data) => ({
            name: VendorList[data.index].name,
            phoneNum: generateRandomPhoneNum(),
            address: VendorList[data.index].address,
            city: VendorList[data.index].city,
            is_active: true,
        })),
    );
    console.info("Vendor seeded successfully!");
};

const generateRandomPhoneNum = () => {
    let phoneNum = "628";
    while (phoneNum.length <= 13) {
        phoneNum += Math.floor(Math.random() * 10);
    }
    return phoneNum;
};

const seedPackaging = async (seed: SeedClient) => {
    console.info("Seeding packaging ...");
    for (const [key] of packagingList.entries()) {
        await seed.packaging((createMany) =>
            createMany(1, () => ({
                label: key,
                value: key,
                is_active: true,
            })),
        );
    }
    console.info("Packaging seeded successfully!");
};

const seedGenericName = async (seed: SeedClient) => {
    console.info("Seeding generic name ...");
    for (const [key] of genericNameList.entries()) {
        await seed.genericName((createMany) =>
            createMany(1, () => ({
                label: key,
                value: key,
                is_active: true,
            })),
        );
    }
    console.info("Generic name seeded successfully!");
};

const seedClassification = async (seed: SeedClient) => {
    console.info("Seeding classification ...");
    for (const [key] of classificationList.entries()) {
        await seed.classification((createMany) =>
            createMany(1, () => ({
                label: key,
                value: key,
                is_active: true,
            })),
        );
    }
    console.info("Classification seeded successfully!");
};

const seedPrescription = async () => {
    console.info("Seeding prescription ...");
    const ENDPOINT: string = "/api/v1/prescriptions";
    const URL: string = `${DOMAIN}${ENDPOINT}`;
    for (const prescription of PrescriptionList) {
        await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prescription),
        }).catch((error) => {
            console.error(error);
            throw new Error("Failed to seed prescription!");
        });
    }
    console.info("Prescription seeded successfully!");
};

const seedTransaction = async () => {
    console.info("Seeding transactions ...");
    const PRESCRIPTION_SIZE: number = PrescriptionList.length;

    const getAllPrescriptions = async (): Promise<PaginationRequest | undefined> => {
        try {
            const ENDPOINT: string = "/api/v1/prescriptions";
            const QUERY: string = `?name=&status=&limit=${PRESCRIPTION_SIZE}&page=1`;
            const URL: string = `${DOMAIN}${ENDPOINT}${QUERY}`;
            let response: Response = await fetch(URL, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const responseJson: BaseResponse<PaginationRequest> =
                await response.json();
            return responseJson.data;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get all prescriptions!");
        }
    };

    const getPharmacyInfo = async (): Promise<Pharmacy | undefined> => {
        try {
            const ENDPOINT: string = "/api/v1/pharmacy";
            const URL: string = `${DOMAIN}${ENDPOINT}`;
            let response: Response = await fetch(URL, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const responseJson: BaseResponse<Pharmacy> = await response.json();
            return responseJson.data;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get all prescriptions!");
        }
    }

    // Unprocessed -> Waiting for payment
    const proceseedToTransaction = async (
        patientId: number,
        prescriptionId: number,
        user_token: string,
        pharmacistId: number,
        created_at: Date,
    ) => {
        try {
            const ENDPOINT: string = "/api/v1/transactions";
            const URL: string = `${DOMAIN}${ENDPOINT}`;
            const BODY = {
                patientId: patientId,
                prescriptionId: prescriptionId,
                pharmacistId: pharmacistId,
                created_at: created_at
            };

            let response: Response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user_token}`,
                },
                body: JSON.stringify({data: BODY}),
            });
            await response.json();
        } catch (error) {
            console.error(error);
            throw new Error("Failed to processed prescriptions!");
        }
    };

    // Waiting for payment -> On Progress
    const payTransaction = async (
        user_token: string,
        request: ConfirmPayRequest,
    ) => {
        try {
            const ENDPOINT: string = "/api/v1/transactions";
            const PARAMS : string = "/_pay"
            const URL: string = `${DOMAIN}${ENDPOINT}${PARAMS}`;
            const BODY = {request};

            let response: Response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user_token}`,
                },
                body: JSON.stringify({data: BODY}),
            });
            const responseJson = await response.json();
            console.log("responseJSON: ", responseJson);
        } catch (error) {
            console.error(error);
            throw new Error("Failed to get processed prescriptions!");
        }
    };


    const initialPharmacist: User | null = await userService.getUserByEmail( "pharmacist1@gmail.com");
    if (!initialPharmacist) throw new Error("Pharmacist not found!");

    const USER_TOKEN = userService.generateToken(
        initialPharmacist.email,
        initialPharmacist.role,
    );

    // Load all prescriptions
    const prescriptions: PaginationRequest | undefined = await getAllPrescriptions();
    if (!prescriptions?.results) throw new Error("Prescriptions not found!");
    const prescriptionSumaryList: PrescriptionSumaryVO[] = prescriptions.results as PrescriptionSumaryVO[];
    console.log("Prescriptions: ", prescriptionSumaryList);

    // Proceed to payment (Waiting for payment status)
    for (const prescription of prescriptionSumaryList) {
        const { id, patient, created_at } = prescription;
        await proceseedToTransaction(patient.id, id, USER_TOKEN, initialPharmacist.id, created_at);
    }

    // Confirm payment (On Progress status)
    const pharmacyInfo: Pharmacy | undefined = await getPharmacyInfo();
    if (!pharmacyInfo) throw new Error("Pharmacy not found!");

    let index: number = 0
    for (const prescription of prescriptionSumaryList) {
        const { id, patient, created_at } = prescription;
        // TODO: Fix json value problem
       
        //const newPhysicalReportData: AddPhysicalReportRequest = {
        //    id: 0,
        //    data: `{
        //        pharmacy: ${pharmacyInfo},
        //        pharmacist: ${initialPharmacist},
        //        patient: ${patient},
        //        medicine: ${PrescriptionList[index].data.medicineList},
        //        totalPrice: "100000"
        //    }`
        //}
        index++;
    }


    console.info("Transactions seeded successfully!");
};

const seedMedicine = async (seed: SeedClient) => {
    console.info("Seeding medicine ...");
    for (const item of MedicineList) {
        const { medicine, merk, packaging, genericName } = item;
        const genericNameId = genericNameList.get(genericName);
        const packagingId = packagingList.get(packaging);

        if (genericNameId && packagingId) {
            const medicineCode =
                await medicineService.generateMedicineCode(genericNameId);
            await seed.medicine((createMany) =>
                createMany(1, () => ({
                    code: medicineCode,
                    name: medicine,
                    merk: merk,
                    description:
                        "Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.",
                    genericNameId: genericNameId,
                    packagingId: packagingId,
                    price: 100000,
                    expiredDate: "2025-01-01T00:00:00Z",
                    currStock: Math.floor(Math.random() * STOCK.MAX) + 125,
                    reservedStock: 0,
                    minStock: STOCK.MIN,
                    maxStock: STOCK.MAX,
                    sideEffect:
                        "Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.",
                    is_active: true,
                })),
            );
        }
    }
    console.info("Medicine seeded successfully!");
};

const initMedicine = () => {
    MedicineList.forEach((medicine) => {
        const { packaging, genericName, classification } = medicine;
        addNewPackaging(packaging);
        addNewGenericName(genericName);
        addNewClassification(classification);
    });
};

const addNewPackaging = (key: string): void => {
    if (packagingList.has(key)) return;
    const lastIndex: number = packagingList.size;
    packagingList.set(key, lastIndex + 1);
};

const addNewGenericName = (key: string): void => {
    if (genericNameList.has(key)) return;
    const lastIndex: number = genericNameList.size;
    genericNameList.set(key, lastIndex + 1);
};

const addNewClassification = (classifications: string[]): void => {
    classifications.forEach((classification) => {
        if (classificationList.has(classification)) return;
        const lastIndex: number = classificationList.size;
        classificationList.set(classification, lastIndex + 1);
    });
};

const seedMedicineHasClassification = async (seed: SeedClient) => {
    console.info("Seeding medicine has classification...");
    for (const medicine of MedicineList) {
        const { id, classification } = medicine;
        for (const item of classification) {
            const classificationId = classificationList.get(item);
            if (classificationId) {
                await seed.medicineHasClassification((createMany) =>
                    createMany(1, () => ({
                        medicineId: id,
                        classificationId: classificationId,
                    })),
                );
            }
        }
    }
    console.info("Medicine has classification seeded successfully!");
};

const seedPharmacy = async (seed: SeedClient) => {
    console.info("Seeding pharmacy ...");
    await seed.pharmacy((createMany) =>
        createMany(1, () => ({
            name: "Satu Farmasi",
            pharmacyNum: "Farmasi123",
            phoneNum: generateRandomPhoneNum(),
            address: "Jl Imam Bonjol",
            email: "satufarmasi@gmail.com",
        })),
    );
    console.info("Pharmacy seeded successfully!");
};
main();
