

export const dashboardStats = {
  totalApartments: 120,
  residentCount: 350,
  openComplaints: 12,
  parkingAvailable: 25,
};

export const apartments = [
  { id: 'A-101', block: 'A', status: 'Rented', owner: 'Mr. Kumar', tenant: 'Mr. Raj' },
  { id: 'A-102', block: 'A', status: 'Self-occupied', owner: 'Mrs. Devi', tenant: 'N/A' },
  { id: 'B-201', block: 'B', status: 'Vacant', owner: 'Mr. Singh', tenant: 'N/A' },
  { id: 'B-202', block: 'B', status: 'Rented', owner: 'Ms. Iyer', tenant: 'Ms. Priya' },
  { id: 'C-301', block: 'C', status: 'Self-occupied', owner: 'Mr. Khan', tenant: 'N/A' },
  { id: 'C-302', block: 'C', status: 'Rented', owner: 'Vijay Patil', tenant: 'Jane Smith' },
  { id: 'A-201', block: 'A', status: 'Vacant', owner: 'Suresh Iyer', tenant: '' },
  { id: 'B-101', block: 'B', status: 'Self-occupied', owner: 'Fatima Khan', tenant: '' },
  { id: 'C-401', block: 'C', status: 'Rented', owner: 'Gaurav Gupta', tenant: 'Michael Brown' },
];

export const owners = [
    { id: "1", name: "Ravi Kumar", flat: "A-101", phone: "9876543210" },
    { id: "2", name: "Sunita Singh", flat: "A-102", phone: "9876543211" },
    { id: "3", name: "Anil Mehta", flat: "B-201", phone: "9876543212" },
];

export const tenants = [
    { id: "1", name: "Priya Sharma", flat: "A-101", phone: "8765432109" },
    { id: "2", name: "John Doe", flat: "B-202", phone: "8765432108" },
    { id: "3", name: "Jane Smith", flat: "C-302", phone: "8765432107" },
];

export const staff = [
    { id: "1", name: "Suresh", role: "Security", phone: "7654321098" },
    { id: "2", name: "Ram", role: "Housekeeping", phone: "7654321097" },
    { id: "3", name: "Gita", role: "Gardener", phone: "7654321096" },
];

export const initialParkingSlots = [
  { id: 'A1', status: 'Occupied', allottedTo: 'A-101' },
  { id: 'A2', status: 'Allotted', allottedTo: 'A-102' },
  { id: 'A3', status: 'Available', allottedTo: null },
  { id: 'A4', status: 'Available', allottedTo: null },
  { id: 'A5', status: 'Available', allottedTo: null },
  { id: 'A6', status: 'Occupied', allottedTo: 'A-201' },
  { id: 'B1', status: 'Occupied', allottedTo: 'B-201' },
  { id: 'B2', status: 'Available', allottedTo: null },
  { id: 'B3', status: 'Occupied', allottedTo: 'B-202' },
  { id: 'B4', status: 'Allotted', allottedTo: 'B-204' },
  { id: 'B5', status: 'Available', allottedTo: null },
  { id: 'B6', status: 'Available', allottedTo: null },
  { id: 'C1', status: 'Allotted', allottedTo: 'C-301' },
  { id: 'C2', status: 'Available', allottedTo: null },
  { id: 'C3', status: 'Occupied', allottedTo: 'C-302' },
  { id: 'C4', status: 'Available', allottedTo: null },
  { id: 'C5', status: 'Allotted', allottedTo: 'C-401' },
  { id: 'C6', status: 'Available', allottedTo: null },
];

export const initialEvents = [
    {
        title: "Annual General Meeting",
        date: "Dec 5th, 2024 at 6:00 PM",
        location: "Clubhouse"
    },
    {
        title: "Christmas Carnival",
        date: "Dec 24th, 2024 from 3:00 PM",
        location: "Society Park"
    }
];

export const marketplaceItems = [
  {
    title: "Old Bicycle",
    description: "A classic road bike, good for parts or restoration. A bit of rust but rides well.",
    price: "Rs 1,500",
    seller: "Mr. Raj (A-101)",
    image: "https://picsum.photos/seed/bicycle/600/400",
    dataAiHint: "old bicycle",
  },
  {
    title: "Microwave Oven",
    description: "LG 20L solo microwave. In perfect working condition, less than a year old.",
    price: "Rs 4,000",
    seller: "Ms. Priya (B-202)",
    image: "https://picsum.photos/seed/microwave/600/400",
    dataAiHint: "microwave oven",
  },
  {
    title: "Wooden Study Table",
    description: "A sturdy wooden study table with a drawer. Minor scratches on the surface.",
    price: "Rs 2,000",
    seller: "Mrs. Devi (A-102)",
    image: "https://picsum.photos/seed/desk/600/400",
    dataAiHint: "study table",
  },
    {
    title: "Toddler Car Seat",
    description: "Graco brand car seat suitable for children from 1-4 years. Excellent condition.",
    price: "Rs 3,500",
    seller: "Mr. Khan (C-301)",
    image: "https://picsum.photos/seed/car-seat/600/400",
    dataAiHint: "car seat",
  },
];
