--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-1.pgdg24.04+1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'DEBIT',
    'CREDIT',
    'QRIS',
    'PAYPAL',
    'CASH'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: ReasonOfDispose; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReasonOfDispose" AS ENUM (
    'EXPIRED',
    'BROKEN',
    'LOST'
);


ALTER TYPE public."ReasonOfDispose" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'DOCTOR',
    'PHARMACIST'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'UNPROCESSED',
    'WAITING_FOR_PAYMENT',
    'ON_PROGRESS',
    'DONE',
    'CANCELED'
);


ALTER TYPE public."Status" OWNER TO postgres;

--
-- Name: UnitOfMeasure; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UnitOfMeasure" AS ENUM (
    'MILLILITER',
    'MILLIGRAM',
    'GRAM',
    'LITER',
    'GROS',
    'KODI',
    'RIM',
    'PCS'
);


ALTER TYPE public."UnitOfMeasure" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Classification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Classification" (
    id integer NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Classification" OWNER TO postgres;

--
-- Name: Classification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Classification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Classification_id_seq" OWNER TO postgres;

--
-- Name: Classification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Classification_id_seq" OWNED BY public."Classification".id;


--
-- Name: Diagnose; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Diagnose" (
    id integer NOT NULL,
    "doctorId" integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "prescriptionId" integer NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Diagnose" OWNER TO postgres;

--
-- Name: Diagnose_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Diagnose_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Diagnose_id_seq" OWNER TO postgres;

--
-- Name: Diagnose_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Diagnose_id_seq" OWNED BY public."Diagnose".id;


--
-- Name: GenericName; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GenericName" (
    id integer NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."GenericName" OWNER TO postgres;

--
-- Name: GenericName_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GenericName_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GenericName_id_seq" OWNER TO postgres;

--
-- Name: GenericName_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GenericName_id_seq" OWNED BY public."GenericName".id;


--
-- Name: Medicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Medicine" (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    "batchCode" text NOT NULL,
    "genericNameId" integer NOT NULL,
    merk text NOT NULL,
    description text NOT NULL,
    "unitOfMeasure" public."UnitOfMeasure" NOT NULL,
    price numeric(65,30) NOT NULL,
    "expiredDate" timestamp(3) without time zone NOT NULL,
    "packagingId" integer NOT NULL,
    "currStock" integer NOT NULL,
    "minStock" integer NOT NULL,
    "maxStock" integer NOT NULL,
    "reservedStock" integer DEFAULT 0 NOT NULL,
    "sideEffect" text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Medicine" OWNER TO postgres;

--
-- Name: MedicineHasClassification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MedicineHasClassification" (
    "medicineId" integer NOT NULL,
    "classificationId" integer NOT NULL
);


ALTER TABLE public."MedicineHasClassification" OWNER TO postgres;

--
-- Name: MedicineReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MedicineReport" (
    id integer NOT NULL,
    "isFinalized" boolean NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."MedicineReport" OWNER TO postgres;

--
-- Name: MedicineReport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MedicineReport_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MedicineReport_id_seq" OWNER TO postgres;

--
-- Name: MedicineReport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MedicineReport_id_seq" OWNED BY public."MedicineReport".id;


--
-- Name: Medicine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Medicine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Medicine_id_seq" OWNER TO postgres;

--
-- Name: Medicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Medicine_id_seq" OWNED BY public."Medicine".id;


--
-- Name: OutputMedicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OutputMedicine" (
    id integer NOT NULL,
    "medicineId" integer NOT NULL,
    quantity integer NOT NULL,
    "reasonOfDispose" public."ReasonOfDispose" NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reportId" integer,
    "physicalReportId" integer
);


ALTER TABLE public."OutputMedicine" OWNER TO postgres;

--
-- Name: OutputMedicine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."OutputMedicine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."OutputMedicine_id_seq" OWNER TO postgres;

--
-- Name: OutputMedicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."OutputMedicine_id_seq" OWNED BY public."OutputMedicine".id;


--
-- Name: Packaging; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Packaging" (
    id integer NOT NULL,
    label text NOT NULL,
    value text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Packaging" OWNER TO postgres;

--
-- Name: Packaging_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Packaging_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Packaging_id_seq" OWNER TO postgres;

--
-- Name: Packaging_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Packaging_id_seq" OWNED BY public."Packaging".id;


--
-- Name: Patient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Patient" (
    id integer NOT NULL,
    "credentialNumber" text NOT NULL,
    "phoneNum" text NOT NULL,
    name text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Patient" OWNER TO postgres;

--
-- Name: Patient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Patient_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Patient_id_seq" OWNER TO postgres;

--
-- Name: Patient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Patient_id_seq" OWNED BY public."Patient".id;


--
-- Name: Pharmacy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pharmacy" (
    id integer NOT NULL,
    name text NOT NULL,
    "pharmacyNum" text NOT NULL,
    address text NOT NULL,
    "phoneNum" text NOT NULL,
    email text NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Pharmacy" OWNER TO postgres;

--
-- Name: Pharmacy_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pharmacy_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pharmacy_id_seq" OWNER TO postgres;

--
-- Name: Pharmacy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pharmacy_id_seq" OWNED BY public."Pharmacy".id;


--
-- Name: PhysicalReport; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PhysicalReport" (
    id integer NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PhysicalReport" OWNER TO postgres;

--
-- Name: PhysicalReport_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PhysicalReport_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PhysicalReport_id_seq" OWNER TO postgres;

--
-- Name: PhysicalReport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PhysicalReport_id_seq" OWNED BY public."PhysicalReport".id;


--
-- Name: Prescription; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Prescription" (
    id integer NOT NULL,
    "patientId" integer NOT NULL,
    status public."Status" NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Prescription" OWNER TO postgres;

--
-- Name: PrescriptionHasMedicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PrescriptionHasMedicine" (
    id integer NOT NULL,
    "prescriptionId" integer NOT NULL,
    "medicineId" integer,
    "medicineCode" text NOT NULL,
    quantity integer NOT NULL,
    instruction text NOT NULL,
    "totalPrice" numeric(65,30) NOT NULL,
    draft boolean NOT NULL
);


ALTER TABLE public."PrescriptionHasMedicine" OWNER TO postgres;

--
-- Name: PrescriptionHasMedicine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PrescriptionHasMedicine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PrescriptionHasMedicine_id_seq" OWNER TO postgres;

--
-- Name: PrescriptionHasMedicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PrescriptionHasMedicine_id_seq" OWNED BY public."PrescriptionHasMedicine".id;


--
-- Name: Prescription_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Prescription_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Prescription_id_seq" OWNER TO postgres;

--
-- Name: Prescription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Prescription_id_seq" OWNED BY public."Prescription".id;


--
-- Name: ReceiveMedicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReceiveMedicine" (
    id integer NOT NULL,
    "documentNumber" text NOT NULL,
    "batchCode" text NOT NULL,
    "medicineId" integer NOT NULL,
    quantity integer NOT NULL,
    "vendorId" integer NOT NULL,
    "buyingPrice" numeric(65,30) NOT NULL,
    "paymentMethod" public."PaymentMethod" NOT NULL,
    deadline timestamp(3) without time zone NOT NULL,
    "isPaid" boolean NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reportId" integer
);


ALTER TABLE public."ReceiveMedicine" OWNER TO postgres;

--
-- Name: ReceiveMedicine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ReceiveMedicine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReceiveMedicine_id_seq" OWNER TO postgres;

--
-- Name: ReceiveMedicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ReceiveMedicine_id_seq" OWNED BY public."ReceiveMedicine".id;


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Transaction" (
    id integer NOT NULL,
    "patientId" integer NOT NULL,
    "prescriptionId" integer NOT NULL,
    "pharmacistId" integer NOT NULL,
    "paymentMethod" public."PaymentMethod",
    "totalPrice" numeric(65,30) NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reportId" integer,
    "physicalReportId" integer
);


ALTER TABLE public."Transaction" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Transaction_id_seq" OWNER TO postgres;

--
-- Name: Transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Transaction_id_seq" OWNED BY public."Transaction".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    nik text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    dob timestamp(3) without time zone NOT NULL,
    "phoneNum" text NOT NULL,
    role public."Role" NOT NULL,
    is_active boolean NOT NULL,
    specialist text,
    "sipaNum" text,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Vendor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vendor" (
    id integer NOT NULL,
    name text NOT NULL,
    "phoneNum" text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp(3) without time zone NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Vendor" OWNER TO postgres;

--
-- Name: Vendor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vendor_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vendor_id_seq" OWNER TO postgres;

--
-- Name: Vendor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vendor_id_seq" OWNED BY public."Vendor".id;


--
-- Name: Classification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Classification" ALTER COLUMN id SET DEFAULT nextval('public."Classification_id_seq"'::regclass);


--
-- Name: Diagnose id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnose" ALTER COLUMN id SET DEFAULT nextval('public."Diagnose_id_seq"'::regclass);


--
-- Name: GenericName id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GenericName" ALTER COLUMN id SET DEFAULT nextval('public."GenericName_id_seq"'::regclass);


--
-- Name: Medicine id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Medicine" ALTER COLUMN id SET DEFAULT nextval('public."Medicine_id_seq"'::regclass);


--
-- Name: MedicineReport id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicineReport" ALTER COLUMN id SET DEFAULT nextval('public."MedicineReport_id_seq"'::regclass);


--
-- Name: OutputMedicine id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutputMedicine" ALTER COLUMN id SET DEFAULT nextval('public."OutputMedicine_id_seq"'::regclass);


--
-- Name: Packaging id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Packaging" ALTER COLUMN id SET DEFAULT nextval('public."Packaging_id_seq"'::regclass);


--
-- Name: Patient id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patient" ALTER COLUMN id SET DEFAULT nextval('public."Patient_id_seq"'::regclass);


--
-- Name: Pharmacy id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacy" ALTER COLUMN id SET DEFAULT nextval('public."Pharmacy_id_seq"'::regclass);


--
-- Name: PhysicalReport id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhysicalReport" ALTER COLUMN id SET DEFAULT nextval('public."PhysicalReport_id_seq"'::regclass);


--
-- Name: Prescription id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescription" ALTER COLUMN id SET DEFAULT nextval('public."Prescription_id_seq"'::regclass);


--
-- Name: PrescriptionHasMedicine id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PrescriptionHasMedicine" ALTER COLUMN id SET DEFAULT nextval('public."PrescriptionHasMedicine_id_seq"'::regclass);


--
-- Name: ReceiveMedicine id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiveMedicine" ALTER COLUMN id SET DEFAULT nextval('public."ReceiveMedicine_id_seq"'::regclass);


--
-- Name: Transaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction" ALTER COLUMN id SET DEFAULT nextval('public."Transaction_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Name: Vendor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vendor" ALTER COLUMN id SET DEFAULT nextval('public."Vendor_id_seq"'::regclass);


--
-- Data for Name: Classification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Classification" (id, label, value, is_active, created_at, updated_at) FROM stdin;
1	Antiinflamasi	Antiinflamasi	t	2020-10-26 21:46:36	2024-12-12 14:57:04.763
2	Antipiretik	Antipiretik	t	2020-04-12 15:18:07	2024-12-12 14:57:04.77
3	Antimikroba	Antimikroba	t	2020-04-28 15:14:11	2024-12-12 14:57:04.776
4	Antibakteri	Antibakteri	t	2020-09-13 08:54:42	2024-12-12 14:57:04.782
5	Diphenhydramine	Diphenhydramine	t	2020-05-21 04:58:10	2024-12-12 14:57:04.788
6	Dimenhydrinate	Dimenhydrinate	t	2020-06-22 17:43:48	2024-12-12 14:57:04.795
7	Chlorpromazine	Chlorpromazine	t	2020-06-02 05:12:43	2024-12-12 14:57:04.801
8	Antipsikotik	Antipsikotik	t	2020-09-17 20:56:52	2024-12-12 14:57:04.805
9	Antihistamin	Antihistamin	t	2020-11-15 22:33:40	2024-12-12 14:57:04.812
10	Antiinflamasi Analgesik	Antiinflamasi Analgesik	t	2020-09-09 20:12:48	2024-12-12 14:57:04.818
11	Opioid Analgesik	Opioid Analgesik	t	2020-04-04 03:45:35	2024-12-12 14:57:04.825
12	Compound Analgesics	Compound Analgesics	t	2020-07-27 06:32:12	2024-12-12 14:57:04.833
13	Sefalosporin	Sefalosporin	t	2020-06-06 05:16:52	2024-12-12 14:57:04.838
14	Suplemen	Suplemen	t	2020-06-26 05:30:28	2024-12-12 14:57:04.845
15	Antialergi	Antialergi	t	2020-07-15 06:28:02	2024-12-12 14:57:04.851
16	Imunomodulator	Imunomodulator	t	2020-03-11 02:27:49	2024-12-12 14:57:04.857
17	Antidiare	Antidiare	t	2020-10-14 21:25:11	2024-12-12 14:57:04.865
18	Antispasmodik	Antispasmodik	t	2020-08-12 07:15:07	2024-12-12 14:57:04.87
19	Infus	Infus	t	2020-06-22 05:40:33	2024-12-12 14:57:04.878
20	Psikostimulan	Psikostimulan	t	2020-04-08 03:42:23	2024-12-12 14:57:04.884
21	Analgesik	Analgesik	t	2020-04-12 03:48:38	2024-12-12 14:57:04.889
22	Antitusif	Antitusif	t	2020-07-07 18:07:30	2024-12-12 14:57:04.897
23	Analgesik topikal	Analgesik topikal	t	2020-12-24 11:29:55	2024-12-12 14:57:04.904
\.


--
-- Data for Name: Diagnose; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Diagnose" (id, "doctorId", title, description, "prescriptionId", is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: GenericName; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GenericName" (id, label, value, is_active, created_at, updated_at) FROM stdin;
1	Ibuprofen	Ibuprofen	t	2020-01-17 12:25:40	2024-12-12 14:57:04.582
2	Amoxicillin	Amoxicillin	t	2020-12-24 23:35:52	2024-12-12 14:57:04.589
3	Domperidone	Domperidone	t	2020-12-20 12:02:50	2024-12-12 14:57:04.594
4	Valproat	Valproat	t	2020-06-10 17:09:21	2024-12-12 14:57:04.598
5	phenylpropanolamine	phenylpropanolamine	t	2020-03-15 02:54:54	2024-12-12 14:57:04.622
6	Analgesik	Analgesik	t	2020-11-23 22:16:33	2024-12-12 14:57:04.63
7	Cefalosporin	Cefalosporin	t	2020-11-15 10:34:22	2024-12-12 14:57:04.635
8	Suplemen vitamin	Suplemen vitamin	t	2020-06-06 17:31:40	2024-12-12 14:57:04.641
9	Antihistamin	Antihistamin	t	2020-08-16 19:35:13	2024-12-12 14:57:04.649
10	imunostimulan	imunostimulan	t	2020-02-10 01:39:15	2024-12-12 14:57:04.654
11	Loperamide	Loperamide	t	2020-03-23 14:53:24	2024-12-12 14:57:04.661
12	kortikosteroid	kortikosteroid	t	2020-11-23 22:37:39	2024-12-12 14:57:04.668
13	Kafein	Kafein	t	2020-09-13 20:44:34	2024-12-12 14:57:04.676
14	Parasetamol	Parasetamol	t	2020-03-27 03:05:57	2024-12-12 14:57:04.683
15	Propyphenazone	Propyphenazone	t	2020-03-23 02:33:22	2024-12-12 14:57:04.689
16	Prokain	Prokain	t	2020-07-03 18:41:07	2024-12-12 14:57:04.697
\.


--
-- Data for Name: Medicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Medicine" (id, code, name, "batchCode", "genericNameId", merk, description, "unitOfMeasure", price, "expiredDate", "packagingId", "currStock", "minStock", "maxStock", "reservedStock", "sideEffect", is_active, created_at, updated_at) FROM stdin;
10	Antihistamin-000002	Histigo	T ut manus efficerin est.	9	Cetirizine	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	MILLIGRAM	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	264	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-06-18 17:13:13	2024-12-12 14:57:05.22
3	Domperidone-000001	Antiemetik	Deorumque veri desid dolorate inimpertur.	3	Praxis	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	LITER	100000.000000000000000000000000000000	2025-01-01 00:00:00	3	229	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-08-12 19:32:42	2024-12-12 14:57:05.123
9	Antihistamin-000001	Histigen	Fuisse et titudinfim sit pendetractis facille hoc corporista, ab rem orat patientia putem praetersas qui.	9	Allerin	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	RIM	100000.000000000000000000000000000000	2025-01-01 00:00:00	4	381	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-10-02 21:47:28	2024-12-12 14:57:05.207
14	kortikosteroid-000001	Icodextrin	Amicarchit litterum aut doloram ut nobisfacian.	12	Extraneal	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	GROS	100000.000000000000000000000000000000	2025-01-01 00:00:00	6	177	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-10-06 21:33:41	2024-12-12 14:57:05.273
15	Kafein-000001	Kafein	Iudice ex alios causae aequitat ulla.	13	Stimuno	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	GRAM	100000.000000000000000000000000000000	2025-01-01 00:00:00	2	171	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-03-07 02:10:02	2024-12-12 14:57:05.286
1	Ibuprofen-000001	Anafen	Esse graecis in mediocriter extremo quid qui quae, ades non sine leviustior illa.	1	Bodrex	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	PCS	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	154	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-02-22 01:56:35	2024-12-12 14:57:05.091
13	Loperamide-000001	Imodium	Tria quibus doctrina in putaverem legamus foris ut, dicerenim sit molesse eius probatomnem.	11	Loperal	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	MILLILITER	100000.000000000000000000000000000000	2025-01-01 00:00:00	2	273	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-11-03 10:59:41	2024-12-12 14:57:05.26
11	Amoxicillin-000002	Holimox	Eae im voluptat quasi dicerrorib, quae perspicuum ut causa praetoratib sedito.	2	Amoxicillin	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	KODI	100000.000000000000000000000000000000	2025-01-01 00:00:00	2	334	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-05-09 16:54:01	2024-12-12 14:57:05.233
6	Analgesik-000001	Analgetik	Quam endum quin dolore eum.	6	Aspirin	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	KODI	100000.000000000000000000000000000000	2025-01-01 00:00:00	4	167	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-10-14 09:33:14	2024-12-12 14:57:05.167
7	Cefalosporin-000001	Cefadroxil	Praeteret et cordans carum delicurus de nobisset saepti.	7	Methimazole	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	PCS	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	343	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-09-13 08:24:10	2024-12-12 14:57:05.182
4	Valproat-000001	Antimania	Etiam cum tibi quidem anim hocles.	4	Depakene	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	LITER	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	176	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-08-04 19:14:52	2024-12-12 14:57:05.137
5	phenylpropanolamine-000001	Antiza	Philos qui et voluptat quae aut fieri quidem, quietem quod qui aliquo alem nihilla.	5	Reactine	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	KODI	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	156	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-06-22 05:56:58	2024-12-12 14:57:05.152
2	Amoxicillin-000001	Antibiotik	Quod ut motum sima ne.	2	Flemox	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	GRAM	100000.000000000000000000000000000000	2025-01-01 00:00:00	2	110	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-01-13 00:10:07	2024-12-12 14:57:05.108
8	Suplemen vitamin-000001	Caviplex	Quia autem auctorem est quae.	8	Neurotropik	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	KODI	100000.000000000000000000000000000000	2025-01-01 00:00:00	5	351	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-05-17 17:03:56	2024-12-12 14:57:05.193
17	Propyphenazone-000001	Paramex	Us aeque quid aut intuemur.	15	Panadol	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	GROS	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	276	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-09-17 09:00:42	2024-12-12 14:57:05.315
18	Parasetamol-000002	Paratusin	Quod natur se peranim corrupti numquam, vera liber quid meliuste igat rerum facero.	14	Vicks	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	PCS	100000.000000000000000000000000000000	2025-01-01 00:00:00	4	104	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-03-11 14:15:55	2024-12-12 14:57:05.332
16	Parasetamol-000001	Panadol	Inem se deorsumer discenda sit.	14	Pamol	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	MILLILITER	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	405	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-01-13 12:39:29	2024-12-12 14:57:05.301
19	Prokain-000001	Palenox	Et entempore iudicium am ego efficer quidem gymnasia.	16	Procaine	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	MILLIGRAM	100000.000000000000000000000000000000	2025-01-01 00:00:00	1	170	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-11-11 22:26:02	2024-12-12 14:57:05.344
12	imunostimulan-000001	Imboost	Laboris et utincidan mihi eitamicur.	10	Elkana	Cursus, morbi a pellentesque eu neque augue tempor id ipsum. Morbi, velit elementum id luctus parturient porttitor adipiscing sed faucibus. Tristique posuere, vitae eleifend, sit vitae eget tristique bibendum faucibus.	MILLILITER	100000.000000000000000000000000000000	2025-01-01 00:00:00	5	156	1	300	0	Sit euismod, sed tincidunt molestie arcu malesuada nulla non ullamcorper. Enim, pretium, tristique eu arcu.	t	2020-10-26 21:35:25	2024-12-12 14:57:05.246
\.


--
-- Data for Name: MedicineHasClassification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MedicineHasClassification" ("medicineId", "classificationId") FROM stdin;
1	1
1	2
2	3
2	4
3	5
3	6
3	7
4	8
5	9
6	10
6	11
6	12
7	13
8	14
9	9
9	15
10	9
10	15
11	4
12	16
13	17
13	18
14	19
15	20
16	21
16	2
17	21
17	2
18	22
18	23
19	9
\.


--
-- Data for Name: MedicineReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MedicineReport" (id, "isFinalized", is_active, created_at, updated_at) FROM stdin;
1	f	t	2024-12-12 07:57:08.553	2024-12-12 07:57:08.555
\.


--
-- Data for Name: OutputMedicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OutputMedicine" (id, "medicineId", quantity, "reasonOfDispose", is_active, created_at, updated_at, "reportId", "physicalReportId") FROM stdin;
\.


--
-- Data for Name: Packaging; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Packaging" (id, label, value, is_active, created_at, updated_at) FROM stdin;
1	Tablet	Tablet	t	2020-11-03 10:17:30	2024-12-12 14:57:04.704
2	Kapsul	Kapsul	t	2020-01-09 12:29:58	2024-12-12 14:57:04.712
3	Kaplet	Kaplet	t	2020-03-19 14:51:15	2024-12-12 14:57:04.718
4	Sirup	Sirup	t	2020-11-15 10:57:54	2024-12-12 14:57:04.725
5	Botol	Botol	t	2020-05-13 16:36:29	2024-12-12 14:57:04.733
6	Kantong Infus	Kantong Infus	t	2020-01-25 12:49:48	2024-12-12 14:57:04.739
\.


--
-- Data for Name: Patient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Patient" (id, "credentialNumber", "phoneNum", name, is_active, created_at, updated_at) FROM stdin;
1	1234567890123456	62842128775761	Budi Santoso	t	2020-08-16 19:37:47	2024-12-12 14:57:04.563
2	2345678901234567	62824619623404	Siti Nurhaliza	t	2020-08-08 07:59:26	2024-12-12 14:57:04.563
3	3456789012345678	62813359030368	Andi Pratama	t	2020-05-13 04:05:43	2024-12-12 14:57:04.563
4	4567890123456789	62871332256172	Dewi Kartika	t	2020-03-07 14:58:30	2024-12-12 14:57:04.563
5	5678901234567890	62807824153510	Ahmad Fauzan	t	2020-09-13 08:22:39	2024-12-12 14:57:04.563
6	6789012345678901	62879662649175	Fitri Handayani	t	2020-11-15 23:09:12	2024-12-12 14:57:04.563
7	7890123456789012	62885910647593	Joko Widodo	t	2020-04-04 15:18:55	2024-12-12 14:57:04.563
8	8901234567890123	62860125366470	Intan Permatasari	t	2020-11-19 10:59:22	2024-12-12 14:57:04.563
9	9012345678901234	62880818297810	Rahmat Hidayat	t	2020-07-07 18:58:40	2024-12-12 14:57:04.563
10	0123456789012345	62846979478008	Maya Anggraini	t	2020-06-14 17:49:44	2024-12-12 14:57:04.563
11	3172010101010001	6281234567890	Setyo Ridwan	t	2024-12-12 07:57:05.7	2024-12-12 07:57:05.7
12	3172020202020002	6281234567891	Ridwan Hidayat	t	2024-12-12 07:57:05.861	2024-12-12 07:57:05.861
13	3172080808080008	6283123456789	Anisa Safitri	t	2024-12-12 07:57:05.903	2024-12-12 07:57:05.903
14	3172070707070007	6282345678912	Rizky Kurniawan	t	2024-12-12 07:57:06.067	2024-12-12 07:57:06.067
15	3172050505050005	081512345678	Hendra Wijaya	t	2024-12-12 07:57:06.681	2024-12-12 07:57:06.681
16	3172040404040004	6285712345678	Dewi Anggraini	t	2024-12-12 07:57:07	2024-12-12 07:57:07
17	3172060606060006	6281987654321	Lia Putri	t	2024-12-12 07:57:07.14	2024-12-12 07:57:07.14
\.


--
-- Data for Name: Pharmacy; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Pharmacy" (id, name, "pharmacyNum", address, "phoneNum", email, created_at, updated_at) FROM stdin;
1	Satu Farmasi	Farmasi123	Jl Imam Bonjol	62839522311068	satufarmasi@gmail.com	2020-03-15 02:25:54	2024-12-12 14:57:04.573
\.


--
-- Data for Name: PhysicalReport; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PhysicalReport" (id, data, created_at) FROM stdin;
\.


--
-- Data for Name: Prescription; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Prescription" (id, "patientId", status, is_active, created_at, updated_at) FROM stdin;
1	11	WAITING_FOR_PAYMENT	t	2024-01-01 03:28:18.411	2024-12-12 07:57:08.388
2	12	WAITING_FOR_PAYMENT	t	2024-01-02 03:28:18.411	2024-12-12 07:57:08.702
3	13	WAITING_FOR_PAYMENT	t	2024-01-03 03:28:18.411	2024-12-12 07:57:08.78
4	1	WAITING_FOR_PAYMENT	t	2024-01-03 03:28:18.411	2024-12-12 07:57:08.842
5	1	WAITING_FOR_PAYMENT	t	2024-01-05 03:28:18.411	2024-12-12 07:57:08.905
6	2	WAITING_FOR_PAYMENT	t	2024-02-01 03:28:18.411	2024-12-12 07:57:08.977
7	14	WAITING_FOR_PAYMENT	t	2024-02-02 03:28:18.411	2024-12-12 07:57:09.05
8	2	WAITING_FOR_PAYMENT	t	2024-02-03 03:28:18.411	2024-12-12 07:57:09.135
9	6	WAITING_FOR_PAYMENT	t	2024-02-04 03:28:18.411	2024-12-12 07:57:09.2
10	4	WAITING_FOR_PAYMENT	t	2024-02-05 03:28:18.411	2024-12-12 07:57:09.265
11	2	WAITING_FOR_PAYMENT	t	2024-03-01 03:28:18.411	2024-12-12 07:57:09.328
12	5	WAITING_FOR_PAYMENT	t	2024-03-02 03:28:18.411	2024-12-12 07:57:09.386
13	6	WAITING_FOR_PAYMENT	t	2024-03-03 03:28:18.411	2024-12-12 07:57:09.453
14	6	WAITING_FOR_PAYMENT	t	2024-03-04 03:28:18.411	2024-12-12 07:57:09.519
15	7	WAITING_FOR_PAYMENT	t	2024-03-05 03:28:18.411	2024-12-12 07:57:09.585
16	10	WAITING_FOR_PAYMENT	t	2024-04-01 03:28:18.411	2024-12-12 07:57:09.657
17	8	WAITING_FOR_PAYMENT	t	2024-04-02 03:28:18.411	2024-12-12 07:57:09.728
18	12	WAITING_FOR_PAYMENT	t	2024-04-03 03:28:18.411	2024-12-12 07:57:09.897
19	2	WAITING_FOR_PAYMENT	t	2024-04-04 03:28:18.411	2024-12-12 07:57:09.973
20	1	WAITING_FOR_PAYMENT	t	2024-04-05 03:28:18.411	2024-12-12 07:57:10.039
21	10	WAITING_FOR_PAYMENT	t	2024-05-01 03:28:18.411	2024-12-12 07:57:10.121
22	10	WAITING_FOR_PAYMENT	t	2024-05-02 03:28:18.411	2024-12-12 07:57:10.203
23	11	WAITING_FOR_PAYMENT	t	2024-05-03 03:28:18.411	2024-12-12 07:57:10.285
24	11	WAITING_FOR_PAYMENT	t	2024-05-04 03:28:18.411	2024-12-12 07:57:10.353
25	13	WAITING_FOR_PAYMENT	t	2024-05-05 03:28:18.411	2024-12-12 07:57:10.43
26	10	WAITING_FOR_PAYMENT	t	2024-06-01 03:28:18.411	2024-12-12 07:57:10.507
27	15	WAITING_FOR_PAYMENT	t	2024-06-02 03:28:18.411	2024-12-12 07:57:10.581
28	11	WAITING_FOR_PAYMENT	t	2024-06-03 03:28:18.411	2024-12-12 07:57:10.658
29	11	WAITING_FOR_PAYMENT	t	2024-06-04 03:28:18.411	2024-12-12 07:57:10.731
30	7	WAITING_FOR_PAYMENT	t	2024-06-05 03:28:18.411	2024-12-12 07:57:10.799
31	1	WAITING_FOR_PAYMENT	t	2024-07-01 03:28:18.411	2024-12-12 07:57:10.849
32	1	WAITING_FOR_PAYMENT	t	2024-07-02 03:28:18.411	2024-12-12 07:57:10.911
33	11	WAITING_FOR_PAYMENT	t	2024-07-03 03:28:18.411	2024-12-12 07:57:10.971
34	1	WAITING_FOR_PAYMENT	t	2024-07-04 03:28:18.411	2024-12-12 07:57:11.039
35	1	WAITING_FOR_PAYMENT	t	2024-07-05 03:28:18.411	2024-12-12 07:57:11.117
36	1	WAITING_FOR_PAYMENT	t	2024-08-01 03:28:18.411	2024-12-12 07:57:11.191
37	9	WAITING_FOR_PAYMENT	t	2024-08-02 03:28:18.411	2024-12-12 07:57:11.259
38	10	WAITING_FOR_PAYMENT	t	2024-08-03 03:28:18.411	2024-12-12 07:57:11.332
39	11	WAITING_FOR_PAYMENT	t	2024-08-04 03:28:18.411	2024-12-12 07:57:11.406
40	8	WAITING_FOR_PAYMENT	t	2024-08-05 03:28:18.411	2024-12-12 07:57:11.452
41	16	WAITING_FOR_PAYMENT	t	2024-09-01 03:28:18.411	2024-12-12 07:57:11.491
42	10	WAITING_FOR_PAYMENT	t	2024-09-02 03:28:18.411	2024-12-12 07:57:11.542
43	11	WAITING_FOR_PAYMENT	t	2024-09-03 03:28:18.411	2024-12-12 07:57:11.583
44	15	WAITING_FOR_PAYMENT	t	2024-09-04 03:28:18.411	2024-12-12 07:57:11.639
45	17	WAITING_FOR_PAYMENT	t	2024-09-05 03:28:18.411	2024-12-12 07:57:11.68
46	10	WAITING_FOR_PAYMENT	t	2024-10-01 03:28:18.411	2024-12-12 07:57:11.725
47	17	WAITING_FOR_PAYMENT	t	2024-10-02 03:28:18.411	2024-12-12 07:57:11.76
48	15	WAITING_FOR_PAYMENT	t	2024-10-03 03:28:18.411	2024-12-12 07:57:11.795
49	13	WAITING_FOR_PAYMENT	t	2024-10-04 03:28:18.411	2024-12-12 07:57:11.829
50	8	WAITING_FOR_PAYMENT	t	2024-10-05 03:28:18.411	2024-12-12 07:57:11.894
51	17	WAITING_FOR_PAYMENT	t	2024-11-01 03:28:18.411	2024-12-12 07:57:11.96
52	5	WAITING_FOR_PAYMENT	t	2024-11-02 03:28:18.411	2024-12-12 07:57:12.025
53	10	WAITING_FOR_PAYMENT	t	2024-11-03 03:28:18.411	2024-12-12 07:57:12.098
54	8	WAITING_FOR_PAYMENT	t	2024-11-04 03:28:18.411	2024-12-12 07:57:12.187
55	2	WAITING_FOR_PAYMENT	t	2024-11-05 03:28:18.411	2024-12-12 07:57:12.254
56	2	WAITING_FOR_PAYMENT	t	2024-12-01 03:28:18.411	2024-12-12 07:57:12.33
57	7	WAITING_FOR_PAYMENT	t	2024-12-02 03:28:18.411	2024-12-12 07:57:12.408
58	1	WAITING_FOR_PAYMENT	t	2024-12-03 03:28:18.411	2024-12-12 07:57:12.485
59	2	WAITING_FOR_PAYMENT	t	2024-12-04 03:28:18.411	2024-12-12 07:57:12.56
60	1	WAITING_FOR_PAYMENT	t	2024-12-05 03:28:18.411	2024-12-12 07:57:12.628
\.


--
-- Data for Name: PrescriptionHasMedicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PrescriptionHasMedicine" (id, "prescriptionId", "medicineId", "medicineCode", quantity, instruction, "totalPrice", draft) FROM stdin;
178	36	5	phenylpropanolamine-000001	13	instruksi	1300000.000000000000000000000000000000	f
179	36	3	Domperidone-000001	7	instruksi	700000.000000000000000000000000000000	f
183	39	3	Domperidone-000001	5	instruksi	500000.000000000000000000000000000000	f
184	39	1	Ibuprofen-000001	3	instruksi	300000.000000000000000000000000000000	f
189	42	3	Domperidone-000001	8	instruksi baru	800000.000000000000000000000000000000	f
190	42	19	Prokain-000001	3	instruksi baru	300000.000000000000000000000000000000	f
195	45	19	Prokain-000001	2	instruksi	200000.000000000000000000000000000000	f
196	45	13	Loperamide-000001	3	instruksi	300000.000000000000000000000000000000	f
197	46	4	Valproat-000001	5	instruksi baru	500000.000000000000000000000000000000	f
198	46	8	Suplemen vitamin-000001	10	instruksi baru	1000000.000000000000000000000000000000	f
199	46	11	Amoxicillin-000002	3	instruksi	300000.000000000000000000000000000000	f
200	46	17	Propyphenazone-000001	7	insturksi	700000.000000000000000000000000000000	f
203	48	4	Valproat-000001	7	instruksi	700000.000000000000000000000000000000	f
204	49	8	Suplemen vitamin-000001	5	instruksi	500000.000000000000000000000000000000	f
210	52	2	Amoxicillin-000001	3	instruksi	300000.000000000000000000000000000000	f
211	52	19	Prokain-000001	10	instruksi	1000000.000000000000000000000000000000	f
215	54	2	Amoxicillin-000001	3	instruksi	300000.000000000000000000000000000000	f
216	55	17	Propyphenazone-000001	7	insturksi	700000.000000000000000000000000000000	f
217	56	11	Amoxicillin-000002	3	instruksi	300000.000000000000000000000000000000	f
218	56	17	Propyphenazone-000001	7	insturksi	700000.000000000000000000000000000000	f
219	57	11	Amoxicillin-000002	18	instruksi	1800000.000000000000000000000000000000	f
220	57	5	phenylpropanolamine-000001	10	instruksi	1000000.000000000000000000000000000000	f
221	58	13	Loperamide-000001	3	instruksi	300000.000000000000000000000000000000	f
222	59	13	Loperamide-000001	5	instruksi	500000.000000000000000000000000000000	f
223	60	18	Parasetamol-000002	12	instruksi	1200000.000000000000000000000000000000	f
224	60	1	Ibuprofen-000001	6	insturksi	600000.000000000000000000000000000000	f
113	1	2	Amoxicillin-000001	10	instruksi 1	1000000.000000000000000000000000000000	f
114	1	18	Parasetamol-000002	3	Instruksi 2	300000.000000000000000000000000000000	f
115	1	11	Amoxicillin-000002	4	instruksi 3	400000.000000000000000000000000000000	f
116	2	5	phenylpropanolamine-000001	10	instruksi	1000000.000000000000000000000000000000	f
117	3	5	phenylpropanolamine-000001	10	instruksi	1000000.000000000000000000000000000000	f
118	3	1	Ibuprofen-000001	10	instruksi	1000000.000000000000000000000000000000	f
119	3	8	Suplemen vitamin-000001	10	instruksi	1000000.000000000000000000000000000000	f
120	4	7	Cefalosporin-000001	8	instruksi	800000.000000000000000000000000000000	f
121	5	7	Cefalosporin-000001	8	instruksi	800000.000000000000000000000000000000	f
122	6	13	Loperamide-000001	5	instruksi 1	500000.000000000000000000000000000000	f
123	6	4	Valproat-000001	8	Instruksi 2	800000.000000000000000000000000000000	f
124	7	12	imunostimulan-000001	16	instruksi	1600000.000000000000000000000000000000	f
125	7	6	Analgesik-000001	4	instruksi	400000.000000000000000000000000000000	f
126	8	12	imunostimulan-000001	16	instruksi	1600000.000000000000000000000000000000	f
127	8	6	Analgesik-000001	4	instruksi	400000.000000000000000000000000000000	f
128	8	1	Ibuprofen-000001	3	instruksi	300000.000000000000000000000000000000	f
129	9	6	Analgesik-000001	4	instruksi	400000.000000000000000000000000000000	f
130	10	6	Analgesik-000001	4	instruksi	400000.000000000000000000000000000000	f
131	10	12	imunostimulan-000001	3	instruksi	300000.000000000000000000000000000000	f
132	11	12	imunostimulan-000001	3	instruksi 1	300000.000000000000000000000000000000	f
133	12	13	Loperamide-000001	6	instruksi	600000.000000000000000000000000000000	f
134	13	18	Parasetamol-000002	12	instruksi	1200000.000000000000000000000000000000	f
135	13	15	Kafein-000001	8	instruksi	800000.000000000000000000000000000000	f
136	14	15	Kafein-000001	8	instruksi	800000.000000000000000000000000000000	f
137	15	8	Suplemen vitamin-000001	1	instruksi	100000.000000000000000000000000000000	f
138	16	11	Amoxicillin-000002	13	instruksi	1300000.000000000000000000000000000000	f
139	16	13	Loperamide-000001	12	test instruksi	1200000.000000000000000000000000000000	f
140	17	8	Suplemen vitamin-000001	1	instruksi	100000.000000000000000000000000000000	f
141	17	15	Kafein-000001	12	instruksi	1200000.000000000000000000000000000000	f
142	17	12	imunostimulan-000001	8	instruksi	800000.000000000000000000000000000000	f
143	18	8	Suplemen vitamin-000001	1	instruksi	100000.000000000000000000000000000000	f
144	18	15	Kafein-000001	12	instruksi	1200000.000000000000000000000000000000	f
145	18	12	imunostimulan-000001	8	instruksi	800000.000000000000000000000000000000	f
146	18	18	Parasetamol-000002	3	instruksi	300000.000000000000000000000000000000	f
147	19	15	Kafein-000001	12	instruksi	1200000.000000000000000000000000000000	f
148	19	12	imunostimulan-000001	8	instruksi	800000.000000000000000000000000000000	f
149	20	12	imunostimulan-000001	8	instruksi	800000.000000000000000000000000000000	f
150	21	1	Ibuprofen-000001	12	instruksi	1200000.000000000000000000000000000000	f
151	21	16	Parasetamol-000001	8	instruksi	800000.000000000000000000000000000000	f
152	21	12	imunostimulan-000001	10	instruksi	1000000.000000000000000000000000000000	f
153	21	14	kortikosteroid-000001	3	test	300000.000000000000000000000000000000	f
154	22	5	phenylpropanolamine-000001	8	instruksi	800000.000000000000000000000000000000	f
155	22	12	imunostimulan-000001	8	instruksi	800000.000000000000000000000000000000	f
156	23	5	phenylpropanolamine-000001	8	instruksi	800000.000000000000000000000000000000	f
157	23	12	imunostimulan-000001	8	instruksi	800000.000000000000000000000000000000	f
158	24	12	imunostimulan-000001	4	instruksi	400000.000000000000000000000000000000	f
159	25	17	Propyphenazone-000001	7	instruksi	700000.000000000000000000000000000000	f
160	25	5	phenylpropanolamine-000001	9	instruksi	900000.000000000000000000000000000000	f
161	26	1	Ibuprofen-000001	12	instruksi	1200000.000000000000000000000000000000	f
162	26	12	imunostimulan-000001	10	instruksi	1000000.000000000000000000000000000000	f
163	26	14	kortikosteroid-000001	3	test	300000.000000000000000000000000000000	f
164	27	8	Suplemen vitamin-000001	12	instruksi	1200000.000000000000000000000000000000	f
165	27	4	Valproat-000001	15	instruksi	1500000.000000000000000000000000000000	f
166	28	8	Suplemen vitamin-000001	3	instruksi	300000.000000000000000000000000000000	f
167	28	4	Valproat-000001	15	instruksi	1500000.000000000000000000000000000000	f
168	28	5	phenylpropanolamine-000001	2	instruksi	200000.000000000000000000000000000000	f
169	29	8	Suplemen vitamin-000001	3	instruksi	300000.000000000000000000000000000000	f
170	29	5	phenylpropanolamine-000001	2	instruksi	200000.000000000000000000000000000000	f
171	30	5	phenylpropanolamine-000001	2	instruksi	200000.000000000000000000000000000000	f
172	30	16	Parasetamol-000001	10	instruksi	1000000.000000000000000000000000000000	f
173	31	12	imunostimulan-000001	10	instruksi	1000000.000000000000000000000000000000	f
174	32	11	Amoxicillin-000002	3	instruksi	300000.000000000000000000000000000000	f
175	33	4	Valproat-000001	3	instruksi	300000.000000000000000000000000000000	f
176	34	5	phenylpropanolamine-000001	13	instruksi	1300000.000000000000000000000000000000	f
177	35	5	phenylpropanolamine-000001	13	instruksi	1300000.000000000000000000000000000000	f
180	37	9	Antihistamin-000001	10	instruksi	1000000.000000000000000000000000000000	f
181	38	12	imunostimulan-000001	6	instruksi	600000.000000000000000000000000000000	f
182	38	1	Ibuprofen-000001	3	instruksi	300000.000000000000000000000000000000	f
185	40	3	Domperidone-000001	5	instruksi	500000.000000000000000000000000000000	f
186	40	8	Suplemen vitamin-000001	6	instruksi	600000.000000000000000000000000000000	f
187	41	3	Domperidone-000001	20	instruksi baru	2000000.000000000000000000000000000000	f
188	41	19	Prokain-000001	16	instruksi baru	1600000.000000000000000000000000000000	f
191	43	8	Suplemen vitamin-000001	6	instruksi	600000.000000000000000000000000000000	f
192	44	8	Suplemen vitamin-000001	6	instruksi	600000.000000000000000000000000000000	f
193	44	4	Valproat-000001	7	instruksi	700000.000000000000000000000000000000	f
194	44	19	Prokain-000001	1	instruksi	100000.000000000000000000000000000000	f
201	47	11	Amoxicillin-000002	2	instruksi	200000.000000000000000000000000000000	f
202	47	17	Propyphenazone-000001	1	insturksi	100000.000000000000000000000000000000	f
205	50	14	kortikosteroid-000001	10	instruksi	1000000.000000000000000000000000000000	f
206	50	19	Prokain-000001	6	instruksi	600000.000000000000000000000000000000	f
207	51	4	Valproat-000001	5	instruksi baru	500000.000000000000000000000000000000	f
208	51	11	Amoxicillin-000002	3	instruksi	300000.000000000000000000000000000000	f
209	51	17	Propyphenazone-000001	7	insturksi	700000.000000000000000000000000000000	f
212	53	3	Domperidone-000001	5	instruksi	500000.000000000000000000000000000000	f
213	54	9	Antihistamin-000001	15	instruksi	1500000.000000000000000000000000000000	f
214	54	7	Cefalosporin-000001	8	instruksi	800000.000000000000000000000000000000	f
\.


--
-- Data for Name: ReceiveMedicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReceiveMedicine" (id, "documentNumber", "batchCode", "medicineId", quantity, "vendorId", "buyingPrice", "paymentMethod", deadline, "isPaid", is_active, created_at, updated_at, "reportId") FROM stdin;
\.


--
-- Data for Name: Transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Transaction" (id, "patientId", "prescriptionId", "pharmacistId", "paymentMethod", "totalPrice", is_active, created_at, updated_at, "reportId", "physicalReportId") FROM stdin;
1	11	1	5	\N	1700000.000000000000000000000000000000	t	2024-01-01 03:28:18.411	2024-12-12 07:57:08.305	1	\N
2	12	2	5	\N	1000000.000000000000000000000000000000	t	2024-01-02 03:28:18.411	2024-12-12 07:57:08.678	1	\N
3	13	3	5	\N	3000000.000000000000000000000000000000	t	2024-01-03 03:28:18.411	2024-12-12 07:57:08.752	1	\N
4	1	4	5	\N	800000.000000000000000000000000000000	t	2024-01-03 03:28:18.411	2024-12-12 07:57:08.821	1	\N
5	1	5	5	\N	800000.000000000000000000000000000000	t	2024-01-05 03:28:18.411	2024-12-12 07:57:08.884	1	\N
6	2	6	5	\N	1300000.000000000000000000000000000000	t	2024-02-01 03:28:18.411	2024-12-12 07:57:08.949	1	\N
7	14	7	5	\N	2000000.000000000000000000000000000000	t	2024-02-02 03:28:18.411	2024-12-12 07:57:09.025	1	\N
8	2	8	5	\N	2300000.000000000000000000000000000000	t	2024-02-03 03:28:18.411	2024-12-12 07:57:09.101	1	\N
9	6	9	5	\N	400000.000000000000000000000000000000	t	2024-02-04 03:28:18.411	2024-12-12 07:57:09.18	1	\N
10	4	10	5	\N	700000.000000000000000000000000000000	t	2024-02-05 03:28:18.411	2024-12-12 07:57:09.243	1	\N
11	2	11	5	\N	300000.000000000000000000000000000000	t	2024-03-01 03:28:18.411	2024-12-12 07:57:09.309	1	\N
12	5	12	5	\N	600000.000000000000000000000000000000	t	2024-03-02 03:28:18.411	2024-12-12 07:57:09.369	1	\N
13	6	13	5	\N	2000000.000000000000000000000000000000	t	2024-03-03 03:28:18.411	2024-12-12 07:57:09.428	1	\N
14	6	14	5	\N	800000.000000000000000000000000000000	t	2024-03-04 03:28:18.411	2024-12-12 07:57:09.499	1	\N
15	7	15	5	\N	100000.000000000000000000000000000000	t	2024-03-05 03:28:18.411	2024-12-12 07:57:09.566	1	\N
16	10	16	5	\N	2500000.000000000000000000000000000000	t	2024-04-01 03:28:18.411	2024-12-12 07:57:09.635	1	\N
17	8	17	5	\N	2100000.000000000000000000000000000000	t	2024-04-02 03:28:18.411	2024-12-12 07:57:09.703	1	\N
18	12	18	5	\N	2400000.000000000000000000000000000000	t	2024-04-03 03:28:18.411	2024-12-12 07:57:09.864	1	\N
19	2	19	5	\N	2000000.000000000000000000000000000000	t	2024-04-04 03:28:18.411	2024-12-12 07:57:09.95	1	\N
20	1	20	5	\N	800000.000000000000000000000000000000	t	2024-04-05 03:28:18.411	2024-12-12 07:57:10.018	1	\N
21	10	21	5	\N	3300000.000000000000000000000000000000	t	2024-05-01 03:28:18.411	2024-12-12 07:57:10.092	1	\N
22	10	22	5	\N	1600000.000000000000000000000000000000	t	2024-05-02 03:28:18.411	2024-12-12 07:57:10.178	1	\N
23	11	23	5	\N	1600000.000000000000000000000000000000	t	2024-05-03 03:28:18.411	2024-12-12 07:57:10.258	1	\N
24	11	24	5	\N	400000.000000000000000000000000000000	t	2024-05-04 03:28:18.411	2024-12-12 07:57:10.331	1	\N
25	13	25	5	\N	1600000.000000000000000000000000000000	t	2024-05-05 03:28:18.411	2024-12-12 07:57:10.402	1	\N
26	10	26	5	\N	2500000.000000000000000000000000000000	t	2024-06-01 03:28:18.411	2024-12-12 07:57:10.48	1	\N
27	15	27	5	\N	2700000.000000000000000000000000000000	t	2024-06-02 03:28:18.411	2024-12-12 07:57:10.556	1	\N
28	11	28	5	\N	2000000.000000000000000000000000000000	t	2024-06-03 03:28:18.411	2024-12-12 07:57:10.633	1	\N
29	11	29	5	\N	500000.000000000000000000000000000000	t	2024-06-04 03:28:18.411	2024-12-12 07:57:10.709	1	\N
30	7	30	5	\N	1200000.000000000000000000000000000000	t	2024-06-05 03:28:18.411	2024-12-12 07:57:10.774	1	\N
31	1	31	5	\N	1000000.000000000000000000000000000000	t	2024-07-01 03:28:18.411	2024-12-12 07:57:10.834	1	\N
32	1	32	5	\N	300000.000000000000000000000000000000	t	2024-07-02 03:28:18.411	2024-12-12 07:57:10.892	1	\N
33	11	33	5	\N	1500000.000000000000000000000000000000	t	2024-07-03 03:28:18.411	2024-12-12 07:57:10.953	1	\N
34	1	34	5	\N	1300000.000000000000000000000000000000	t	2024-07-04 03:28:18.411	2024-12-12 07:57:11.019	1	\N
35	1	35	5	\N	1300000.000000000000000000000000000000	t	2024-07-05 03:28:18.411	2024-12-12 07:57:11.094	1	\N
36	1	36	5	\N	2000000.000000000000000000000000000000	t	2024-08-01 03:28:18.411	2024-12-12 07:57:11.167	1	\N
37	9	37	5	\N	1000000.000000000000000000000000000000	t	2024-08-02 03:28:18.411	2024-12-12 07:57:11.241	1	\N
38	10	38	5	\N	900000.000000000000000000000000000000	t	2024-08-03 03:28:18.411	2024-12-12 07:57:11.306	1	\N
39	11	39	5	\N	800000.000000000000000000000000000000	t	2024-08-04 03:28:18.411	2024-12-12 07:57:11.377	1	\N
40	8	40	5	\N	1100000.000000000000000000000000000000	t	2024-08-05 03:28:18.411	2024-12-12 07:57:11.441	1	\N
41	16	41	5	\N	3600000.000000000000000000000000000000	t	2024-09-01 03:28:18.411	2024-12-12 07:57:11.48	1	\N
42	10	42	5	\N	3600000.000000000000000000000000000000	t	2024-09-02 03:28:18.411	2024-12-12 07:57:11.525	1	\N
43	11	43	5	\N	600000.000000000000000000000000000000	t	2024-09-03 03:28:18.411	2024-12-12 07:57:11.572	1	\N
44	15	44	5	\N	1400000.000000000000000000000000000000	t	2024-09-04 03:28:18.411	2024-12-12 07:57:11.626	1	\N
45	17	45	5	\N	500000.000000000000000000000000000000	t	2024-09-05 03:28:18.411	2024-12-12 07:57:11.664	1	\N
46	10	46	5	\N	2500000.000000000000000000000000000000	t	2024-10-01 03:28:18.411	2024-12-12 07:57:11.71	1	\N
47	17	47	5	\N	1000000.000000000000000000000000000000	t	2024-10-02 03:28:18.411	2024-12-12 07:57:11.75	1	\N
48	15	48	5	\N	700000.000000000000000000000000000000	t	2024-10-03 03:28:18.411	2024-12-12 07:57:11.784	1	\N
49	13	49	5	\N	500000.000000000000000000000000000000	t	2024-10-04 03:28:18.411	2024-12-12 07:57:11.819	1	\N
50	8	50	5	\N	1600000.000000000000000000000000000000	t	2024-10-05 03:28:18.411	2024-12-12 07:57:11.872	1	\N
51	17	51	5	\N	1500000.000000000000000000000000000000	t	2024-11-01 03:28:18.411	2024-12-12 07:57:11.939	1	\N
52	5	52	5	\N	1300000.000000000000000000000000000000	t	2024-11-02 03:28:18.411	2024-12-12 07:57:12.005	1	\N
53	10	53	5	\N	500000.000000000000000000000000000000	t	2024-11-03 03:28:18.411	2024-12-12 07:57:12.072	1	\N
54	8	54	5	\N	2600000.000000000000000000000000000000	t	2024-11-04 03:28:18.411	2024-12-12 07:57:12.153	1	\N
55	2	55	5	\N	700000.000000000000000000000000000000	t	2024-11-05 03:28:18.411	2024-12-12 07:57:12.236	1	\N
56	2	56	5	\N	1000000.000000000000000000000000000000	t	2024-12-01 03:28:18.411	2024-12-12 07:57:12.305	1	\N
57	7	57	5	\N	2800000.000000000000000000000000000000	t	2024-12-02 03:28:18.411	2024-12-12 07:57:12.383	1	\N
58	1	58	5	\N	300000.000000000000000000000000000000	t	2024-12-03 03:28:18.411	2024-12-12 07:57:12.463	1	\N
59	2	59	5	\N	300000.000000000000000000000000000000	t	2024-12-04 03:28:18.411	2024-12-12 07:57:12.536	1	\N
60	1	60	5	\N	1800000.000000000000000000000000000000	t	2024-12-05 03:28:18.411	2024-12-12 07:57:12.606	1	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, nik, email, password, "firstName", "lastName", dob, "phoneNum", role, is_active, specialist, "sipaNum", created_at, updated_at) FROM stdin;
1	4735144098109068	admin@gmail.com	$2b$10$xdVVuVoEIyRVcTl8hf6OHuxUO/DTcwNSUQQC0KVreJLtdrBmv3X2a	Admin	Admin	2024-03-24 09:05:07.985	62858545008975	ADMIN	t	\N	\N	2020-09-13 20:17:53	2024-12-12 14:57:04.293
2	1082329312373575	doctor1@gmail.com	$2b$10$cUIdjvRx4ax5f02xsAhHDeen3XdYYK17XZVR3DmQPeNHtpQqxwhSK	Maurice	Reinger	2024-01-24 11:03:07.861	62811425796137	DOCTOR	t	Dokter Umum	\N	2020-09-09 08:46:57	2024-12-12 14:57:04.43
3	8790210454972467	doctor2@gmail.com	$2b$10$cUIdjvRx4ax5f02xsAhHDeen3XdYYK17XZVR3DmQPeNHtpQqxwhSK	Mustafa	Fisher	2024-03-22 06:53:22.365	62886104835797	DOCTOR	t	Dokter Umum	\N	2020-05-17 16:11:51	2024-12-12 14:57:04.43
4	6552276087601773	doctor3@gmail.com	$2b$10$cUIdjvRx4ax5f02xsAhHDeen3XdYYK17XZVR3DmQPeNHtpQqxwhSK	Stefanie	Schumm	2024-10-14 20:00:34.382	62874369973420	DOCTOR	t	Dokter Umum	\N	2020-09-01 20:56:35	2024-12-12 14:57:04.43
5	0442193656277463	pharmacist1@gmail.com	$2b$10$tbhUzI0f0rel5hPwIDQqhuKIBdq4/11n8duwkGwtAbjd62DUeYkl2	Milford	Wuckert	2024-02-17 06:21:00.886	62807705484781	PHARMACIST	t	\N	001/001/001	2020-01-09 00:49:04	2024-12-12 14:57:04.555
6	0177664260639904	pharmacist2@gmail.com	$2b$10$tbhUzI0f0rel5hPwIDQqhuKIBdq4/11n8duwkGwtAbjd62DUeYkl2	Abbigail	Wisoky	2023-12-20 01:09:42.267	62835518606459	PHARMACIST	t	\N	001/001/001	2020-06-06 17:08:21	2024-12-12 14:57:04.555
7	1581530846806484	pharmacist3@gmail.com	$2b$10$tbhUzI0f0rel5hPwIDQqhuKIBdq4/11n8duwkGwtAbjd62DUeYkl2	Polly	Kshlerin	2024-11-28 23:53:13.683	62810122145671	PHARMACIST	t	\N	001/001/001	2020-01-05 00:46:48	2024-12-12 14:57:04.555
\.


--
-- Data for Name: Vendor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vendor" (id, name, "phoneNum", address, city, is_active, created_at, updated_at) FROM stdin;
1	PT.Guardian Pharmatama	62804175307281	Jl. Raya Bogor No.20, Cibubur	Jakarta	t	2020-07-11 18:26:48	2024-12-12 14:57:04.752
2	PT.Ika Pharmindo Putramas	62800491521029	Jl. Ancol Barat No.12	Jakarta	t	2020-01-21 12:28:46	2024-12-12 14:57:04.752
3	PT.Avintes Pharma	62843450913427	Jl. Letjen S. Parman Kav 21	Jakarta	t	2020-06-14 05:49:23	2024-12-12 14:57:04.752
4	PT.Global Healt Pharmaceutical	62808622909222	Jl. Lingkar Luar Barat No.28	Jakarta	t	2020-04-28 03:45:45	2024-12-12 14:57:04.752
5	PT.Dipa Pharmalab Intersains	62878877680649	Jl. RS Fatmawati No.188	Jakarta	t	2020-12-08 23:23:08	2024-12-12 14:57:04.752
6	PT.Hexapharm jaya laboratoris	62869363911009	Jl. Pulo Kambing II No.1	Jakarta	t	2020-04-12 03:55:30	2024-12-12 14:57:04.752
7	PT.Kalbe Farma	62849569725397	Jl. Letjen Suprapto Kav 4	Jakarta	t	2020-09-25 09:03:17	2024-12-12 14:57:04.752
8	PT.Perwi agung (Landson)	62836282585105	Jl. Pulomas Timur No.18	Jakarta	t	2020-12-20 11:11:12	2024-12-12 14:57:04.752
9	PT.Pyridam Farma	62825730951016	Jl. Kebon Jeruk Raya No.19	Jakarta	t	2020-09-09 09:05:00	2024-12-12 14:57:04.752
10	PT.Pyridam Farma	62891778544660	Jl. Kebon Jeruk Raya No.19	Jakarta	t	2020-05-01 05:02:23	2024-12-12 14:57:04.752
11	PT.Notaris Indonesia	62872617077881	Jl. Dr. Kusumaatmadja No.36	Jakarta	t	2020-02-06 01:02:29	2024-12-12 14:57:04.752
12	PT.Pyridam Farma	62805893352587	Jl. Kebon Jeruk Raya No.19	Jakarta	t	2020-10-14 09:14:14	2024-12-12 14:57:04.752
\.


--
-- Name: Classification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Classification_id_seq"', 23, true);


--
-- Name: Diagnose_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Diagnose_id_seq"', 1, false);


--
-- Name: GenericName_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GenericName_id_seq"', 16, true);


--
-- Name: MedicineReport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MedicineReport_id_seq"', 1, true);


--
-- Name: Medicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Medicine_id_seq"', 19, true);


--
-- Name: OutputMedicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OutputMedicine_id_seq"', 1, false);


--
-- Name: Packaging_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Packaging_id_seq"', 6, true);


--
-- Name: Patient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Patient_id_seq"', 17, true);


--
-- Name: Pharmacy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Pharmacy_id_seq"', 1, true);


--
-- Name: PhysicalReport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PhysicalReport_id_seq"', 1, false);


--
-- Name: PrescriptionHasMedicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PrescriptionHasMedicine_id_seq"', 224, true);


--
-- Name: Prescription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Prescription_id_seq"', 60, true);


--
-- Name: ReceiveMedicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ReceiveMedicine_id_seq"', 1, false);


--
-- Name: Transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Transaction_id_seq"', 60, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 7, true);


--
-- Name: Vendor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vendor_id_seq"', 12, true);


--
-- Name: Classification Classification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Classification"
    ADD CONSTRAINT "Classification_pkey" PRIMARY KEY (id);


--
-- Name: Diagnose Diagnose_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnose"
    ADD CONSTRAINT "Diagnose_pkey" PRIMARY KEY (id);


--
-- Name: GenericName GenericName_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GenericName"
    ADD CONSTRAINT "GenericName_pkey" PRIMARY KEY (id);


--
-- Name: MedicineHasClassification MedicineHasClassification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicineHasClassification"
    ADD CONSTRAINT "MedicineHasClassification_pkey" PRIMARY KEY ("medicineId", "classificationId");


--
-- Name: MedicineReport MedicineReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicineReport"
    ADD CONSTRAINT "MedicineReport_pkey" PRIMARY KEY (id);


--
-- Name: Medicine Medicine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Medicine"
    ADD CONSTRAINT "Medicine_pkey" PRIMARY KEY (id);


--
-- Name: OutputMedicine OutputMedicine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutputMedicine"
    ADD CONSTRAINT "OutputMedicine_pkey" PRIMARY KEY (id);


--
-- Name: Packaging Packaging_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Packaging"
    ADD CONSTRAINT "Packaging_pkey" PRIMARY KEY (id);


--
-- Name: Patient Patient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Patient"
    ADD CONSTRAINT "Patient_pkey" PRIMARY KEY (id);


--
-- Name: Pharmacy Pharmacy_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pharmacy"
    ADD CONSTRAINT "Pharmacy_pkey" PRIMARY KEY (id);


--
-- Name: PhysicalReport PhysicalReport_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PhysicalReport"
    ADD CONSTRAINT "PhysicalReport_pkey" PRIMARY KEY (id);


--
-- Name: PrescriptionHasMedicine PrescriptionHasMedicine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PrescriptionHasMedicine"
    ADD CONSTRAINT "PrescriptionHasMedicine_pkey" PRIMARY KEY (id);


--
-- Name: Prescription Prescription_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescription"
    ADD CONSTRAINT "Prescription_pkey" PRIMARY KEY (id);


--
-- Name: ReceiveMedicine ReceiveMedicine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiveMedicine"
    ADD CONSTRAINT "ReceiveMedicine_pkey" PRIMARY KEY (id);


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Vendor Vendor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vendor"
    ADD CONSTRAINT "Vendor_pkey" PRIMARY KEY (id);


--
-- Name: Diagnose_prescriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Diagnose_prescriptionId_key" ON public."Diagnose" USING btree ("prescriptionId");


--
-- Name: OutputMedicine_physicalReportId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "OutputMedicine_physicalReportId_key" ON public."OutputMedicine" USING btree ("physicalReportId");


--
-- Name: Patient_credentialNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Patient_credentialNumber_key" ON public."Patient" USING btree ("credentialNumber");


--
-- Name: Transaction_physicalReportId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Transaction_physicalReportId_key" ON public."Transaction" USING btree ("physicalReportId");


--
-- Name: Transaction_prescriptionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Transaction_prescriptionId_key" ON public."Transaction" USING btree ("prescriptionId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_nik_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_nik_key" ON public."User" USING btree (nik);


--
-- Name: Diagnose Diagnose_doctorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnose"
    ADD CONSTRAINT "Diagnose_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Diagnose Diagnose_prescriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnose"
    ADD CONSTRAINT "Diagnose_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES public."Prescription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MedicineHasClassification MedicineHasClassification_classificationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicineHasClassification"
    ADD CONSTRAINT "MedicineHasClassification_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES public."Classification"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MedicineHasClassification MedicineHasClassification_medicineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MedicineHasClassification"
    ADD CONSTRAINT "MedicineHasClassification_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES public."Medicine"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Medicine Medicine_genericNameId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Medicine"
    ADD CONSTRAINT "Medicine_genericNameId_fkey" FOREIGN KEY ("genericNameId") REFERENCES public."GenericName"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Medicine Medicine_packagingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Medicine"
    ADD CONSTRAINT "Medicine_packagingId_fkey" FOREIGN KEY ("packagingId") REFERENCES public."Packaging"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OutputMedicine OutputMedicine_medicineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutputMedicine"
    ADD CONSTRAINT "OutputMedicine_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES public."Medicine"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OutputMedicine OutputMedicine_physicalReportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutputMedicine"
    ADD CONSTRAINT "OutputMedicine_physicalReportId_fkey" FOREIGN KEY ("physicalReportId") REFERENCES public."PhysicalReport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OutputMedicine OutputMedicine_reportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OutputMedicine"
    ADD CONSTRAINT "OutputMedicine_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES public."MedicineReport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PrescriptionHasMedicine PrescriptionHasMedicine_medicineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PrescriptionHasMedicine"
    ADD CONSTRAINT "PrescriptionHasMedicine_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES public."Medicine"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PrescriptionHasMedicine PrescriptionHasMedicine_prescriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PrescriptionHasMedicine"
    ADD CONSTRAINT "PrescriptionHasMedicine_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES public."Prescription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Prescription Prescription_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Prescription"
    ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReceiveMedicine ReceiveMedicine_medicineId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiveMedicine"
    ADD CONSTRAINT "ReceiveMedicine_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES public."Medicine"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ReceiveMedicine ReceiveMedicine_reportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiveMedicine"
    ADD CONSTRAINT "ReceiveMedicine_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES public."MedicineReport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ReceiveMedicine ReceiveMedicine_vendorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReceiveMedicine"
    ADD CONSTRAINT "ReceiveMedicine_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES public."Vendor"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_patientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES public."Patient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_pharmacistId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_physicalReportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_physicalReportId_fkey" FOREIGN KEY ("physicalReportId") REFERENCES public."PhysicalReport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Transaction Transaction_prescriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES public."Prescription"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Transaction Transaction_reportId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Transaction"
    ADD CONSTRAINT "Transaction_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES public."MedicineReport"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

