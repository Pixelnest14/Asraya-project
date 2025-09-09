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

export const recentComplaints = [
  { id: 'C001', category: 'Plumbing', date: '2023-10-26', raisedBy: 'A-101', status: 'New' },
  { id: 'C002', category: 'Electrical', date: '2023-10-25', raisedBy: 'B-202', status: 'In Progress' },
  { id: 'C003', category: 'Security', date: '2023-10-24', raisedBy: 'C-301', status: 'Resolved' },
];

export const owners = [
    { id: 1, name: "Ravi Kumar", flat: "A-101", phone: "9876543210" },
    { id: 2, name: "Sunita Singh", flat: "A-102", phone: "9876543211" },
    { id: 3, name: "Anil Mehta", flat: "B-201", phone: "9876543212" },
];

export const tenants = [
    { id: 1, name: "Priya Sharma", flat: "A-101", phone: "8765432109" },
    { id: 2, name: "John Doe", flat: "B-202", phone: "8765432108" },
    { id: 3, name: "Jane Smith", flat: "C-302", phone: "8765432107" },
];

export const staff = [
    { id: 1, name: "Suresh", role: "Security", phone: "7654321098" },
    { id: 2, name: "Ram", role: "Housekeeping", phone: "7654321097" },
    { id: 3, name: "Gita", role: "Gardener", phone: "7654321096" },
];

export const billings = [
    { flat: "A-101", block: "A", status: "Paid" },
    { flat: "A-102", block: "A", status: "Pending" },
    { flat: "B-201", block: "B", status: "Due" },
    { flat: "B-202", block: "B", status: "Paid" },
    { flat: "C-301", block: "C", status: "Pending" },
    { flat: "C-302", block: "C", status: "Paid" },
];

export const parkingSlots = Array.from({ length: 40 }, (_, i) => ({
  id: `P${i + 1}`,
  status: i % 5 === 0 ? 'available' : i % 3 === 0 ? 'occupied' : 'allotted',
  allottedTo: i % 5 !== 0 && i % 3 !== 0 ? `A-${101 + i}` : null,
}));


export const marketplaceItems = [
  { id: 1, title: 'Used Bicycle', description: 'In good condition, selling because upgrading.', price: '₹3,000', seller: 'Priya (A-101)', image: 'https://picsum.photos/600/400?random=1', dataAiHint: "bicycle bike" },
  { id: 2, title: 'Sofa Set for Rent', description: 'Comfortable 3-seater sofa, available for monthly rent.', price: '₹1,500/month', seller: 'Anil (B-201)', image: 'https://picsum.photos/600/400?random=2', dataAiHint: "sofa couch" },
  { id: 3, title: 'Microwave Oven', description: '2-year-old microwave, works perfectly.', price: '₹2,500', seller: 'John (B-202)', image: 'https://picsum.photos/600/400?random=3', dataAiHint: "microwave oven" },
  { id: 4, title: 'Study Table', description: 'Wooden study table with chair.', price: '₹4,000', seller: 'Meera (C-301)', image: 'https://picsum.photos/600/400?random=4', dataAiHint: "study table" },
];

export const polls = [
    {
        id: 1,
        title: "Repainting of Building Exteriors",
        status: "Active",
        options: ["Yes, proceed with repainting", "No, postpone to next year"],
        results: [68, 32],
    },
    {
        id: 2,
        title: "Installation of Solar Panels",
        status: "Closed",
        options: ["Approve Budget", "Reject Budget"],
        results: [85, 15],
    }
];

export const tenantComplaints = [
    { id: 'TC001', category: 'Plumbing', date: '2023-10-20', description: 'Leaky faucet in the kitchen sink.', status: 'Resolved' },
    { id: 'TC002', category: 'Internet', date: '2023-10-22', description: 'Frequent disconnections from the society Wi-Fi.', status: 'In Progress' },
    { id: 'TC003', category: 'Noise', date: '2023-10-28', description: 'Loud music from the flat above late at night.', status: 'New' },
];

export const myTenants = [
    { name: "Priya Sharma", status: "Active", property: "A-101" },
    { name: "Suresh Gupta", status: "Inactive", property: "D-405" },
];
