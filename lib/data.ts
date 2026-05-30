export const WEDDING_INFO = {
  couple: "Kudakwashe & Maxine",
  date: "2027-08-28",
  guestsEstimated: 150,
  budget: 20000,
  ceremonyTime: "11:00 AM",
  theme: "Classic / Bohemian / Modern / Rustic",
  colorPalette: "Sage Green",
};

export type ChecklistItem = {
  id: string;
  task: string;
  category: string;
  timeline: string;
  priority: "High" | "Medium" | "Low";
  assignedTo: string;
  status: "Not Started" | "In Progress" | "Completed";
  notes: string;
};

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "c1", task: "Set overall budget", category: "Planning", timeline: "12+ Months Before", priority: "High", assignedTo: "", status: "In Progress", notes: "" },
  { id: "c2", task: "Create guest list draft", category: "Guests", timeline: "12+ Months Before", priority: "High", assignedTo: "", status: "In Progress", notes: "" },
  { id: "c3", task: "Research & book venue", category: "Venue", timeline: "12+ Months Before", priority: "High", assignedTo: "", status: "In Progress", notes: "" },
  { id: "c4", task: "Hire wedding planner/coordinator", category: "Planning", timeline: "12+ Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c5", task: "Choose wedding party (bridesmaids/groomsmen)", category: "Wedding Party", timeline: "12+ Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c6", task: "Start engagement photos", category: "Photography", timeline: "12+ Months Before", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c7", task: "Research vendors (photographer, caterer, DJ)", category: "Vendors", timeline: "12+ Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c8", task: "Book photographer/videographer", category: "Photography", timeline: "9-12 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c9", task: "Book caterer / decide menu style", category: "Catering", timeline: "9-12 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c10", task: "Book DJ / band / entertainment", category: "Entertainment", timeline: "9-12 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c11", task: "Shop for wedding dress", category: "Attire", timeline: "9-12 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c12", task: "Choose ceremony officiant", category: "Ceremony", timeline: "9-12 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c13", task: "Book florist", category: "Flowers/Decor", timeline: "9-12 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c14", task: "Reserve hotel room blocks", category: "Accommodations", timeline: "9-12 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c15", task: "Start wedding website", category: "Planning", timeline: "9-12 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c16", task: "Order invitations & stationery", category: "Stationery", timeline: "6-9 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c17", task: "Book hair & makeup artist", category: "Beauty", timeline: "6-9 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c18", task: "Plan honeymoon destination & book flights", category: "Honeymoon", timeline: "6-9 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c19", task: "Register for gifts", category: "Registry", timeline: "6-9 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c20", task: "Order wedding cake / dessert", category: "Catering", timeline: "6-9 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c21", task: "Book transportation (limo, bus, etc.)", category: "Logistics", timeline: "6-9 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c22", task: "Select bridesmaid dresses", category: "Attire", timeline: "6-9 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c23", task: "Plan rehearsal dinner", category: "Events", timeline: "6-9 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c24", task: "Send Save-the-Dates", category: "Stationery", timeline: "4-6 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c25", task: "Finalize ceremony details & readings", category: "Ceremony", timeline: "4-6 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c26", task: "Plan reception layout / seating chart draft", category: "Venue", timeline: "4-6 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c27", task: "Schedule dress fittings", category: "Attire", timeline: "4-6 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c28", task: "Choose wedding favors", category: "Decor/Gifts", timeline: "4-6 Months Before", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c29", task: "Arrange rentals (tables, chairs, linens)", category: "Venue", timeline: "4-6 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c30", task: "Book calligrapher (if needed)", category: "Stationery", timeline: "4-6 Months Before", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c31", task: "Mail invitations", category: "Stationery", timeline: "2-4 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c32", task: "Apply for marriage license", category: "Legal", timeline: "2-4 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c33", task: "Finalize menu & cake tasting", category: "Catering", timeline: "2-4 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c34", task: "Write vows", category: "Ceremony", timeline: "2-4 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c35", task: "Buy wedding rings", category: "Jewelry", timeline: "2-4 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c36", task: "Finalize floral arrangements", category: "Flowers/Decor", timeline: "2-4 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c37", task: "Plan bachelor/bachelorette parties", category: "Events", timeline: "2-4 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c38", task: "Arrange groomsmen attire", category: "Attire", timeline: "2-4 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c39", task: "Confirm all vendor details & payments", category: "Vendors", timeline: "1-2 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c40", task: "Create day-of timeline", category: "Planning", timeline: "1-2 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c41", task: "Finalize seating chart", category: "Guests", timeline: "1-2 Months Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c42", task: "Prepare toasts / speeches", category: "Ceremony", timeline: "1-2 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c43", task: "Hair & makeup trial", category: "Beauty", timeline: "1-2 Months Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c44", task: "Break in wedding shoes", category: "Attire", timeline: "1-2 Months Before", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c45", task: "Prepare welcome bags (for out-of-town guests)", category: "Guests", timeline: "1-2 Months Before", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c46", task: "Final dress fitting", category: "Attire", timeline: "1-2 Weeks Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c47", task: "Confirm headcount with caterer", category: "Catering", timeline: "1-2 Weeks Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c48", task: "Prepare tips & vendor payments", category: "Planning", timeline: "1-2 Weeks Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c49", task: "Pick up marriage license", category: "Legal", timeline: "1-2 Weeks Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c50", task: "Rehearsal & rehearsal dinner", category: "Events", timeline: "1-2 Weeks Before", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c51", task: "Pack for honeymoon", category: "Honeymoon", timeline: "1-2 Weeks Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c52", task: "Delegate day-of tasks to wedding party", category: "Planning", timeline: "1-2 Weeks Before", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c53", task: "Deliver final vendor payments & tips", category: "Planning", timeline: "Day Of", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c54", task: "Ceremony!", category: "Ceremony", timeline: "Day Of", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c55", task: "Reception!", category: "Events", timeline: "Day Of", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c56", task: "Send thank-you cards", category: "Stationery", timeline: "After Wedding", priority: "High", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c57", task: "Change name (if applicable)", category: "Legal", timeline: "After Wedding", priority: "Medium", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c58", task: "Preserve wedding dress", category: "Attire", timeline: "After Wedding", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
  { id: "c59", task: "Review & tip vendors", category: "Vendors", timeline: "After Wedding", priority: "Low", assignedTo: "", status: "Not Started", notes: "" },
];

export type BudgetItem = {
  id: string;
  category: string;
  vendorItem: string;
  estimatedCost: number;
  actualCost: number | null;
  depositPaid: number | null;
  balanceDue: number;
  paymentDueDate: string;
  status: "Not Paid" | "Deposit Paid" | "Paid in Full";
};

export const BUDGET_ITEMS: BudgetItem[] = [
  { id: "b1", category: "Venue", vendorItem: "Ceremony & Reception Venue", estimatedCost: 8000, actualCost: null, depositPaid: null, balanceDue: 8000, paymentDueDate: "", status: "Not Paid" },
  { id: "b2", category: "Venue", vendorItem: "Rentals (tables, chairs, linens)", estimatedCost: 1500, actualCost: null, depositPaid: null, balanceDue: 1500, paymentDueDate: "", status: "Not Paid" },
  { id: "b3", category: "Catering", vendorItem: "Food & Beverages", estimatedCost: 5000, actualCost: null, depositPaid: null, balanceDue: 5000, paymentDueDate: "", status: "Not Paid" },
  { id: "b4", category: "Catering", vendorItem: "Wedding Cake / Desserts", estimatedCost: 500, actualCost: null, depositPaid: null, balanceDue: 500, paymentDueDate: "", status: "Not Paid" },
  { id: "b5", category: "Catering", vendorItem: "Bar / Alcohol", estimatedCost: 1500, actualCost: null, depositPaid: null, balanceDue: 1500, paymentDueDate: "", status: "Not Paid" },
  { id: "b6", category: "Photography", vendorItem: "Photographer", estimatedCost: 2500, actualCost: null, depositPaid: null, balanceDue: 2500, paymentDueDate: "", status: "Not Paid" },
  { id: "b7", category: "Photography", vendorItem: "Videographer", estimatedCost: 1800, actualCost: null, depositPaid: null, balanceDue: 1800, paymentDueDate: "", status: "Not Paid" },
  { id: "b8", category: "Flowers/Decor", vendorItem: "Florist", estimatedCost: 1200, actualCost: null, depositPaid: null, balanceDue: 1200, paymentDueDate: "", status: "Not Paid" },
  { id: "b9", category: "Flowers/Decor", vendorItem: "Decorations & Lighting", estimatedCost: 800, actualCost: null, depositPaid: null, balanceDue: 800, paymentDueDate: "", status: "Not Paid" },
  { id: "b10", category: "Entertainment", vendorItem: "DJ / Band", estimatedCost: 1200, actualCost: null, depositPaid: null, balanceDue: 1200, paymentDueDate: "", status: "Not Paid" },
  { id: "b11", category: "Attire", vendorItem: "Wedding Dress + Alterations", estimatedCost: 2000, actualCost: null, depositPaid: null, balanceDue: 2000, paymentDueDate: "", status: "Not Paid" },
  { id: "b12", category: "Attire", vendorItem: "Groom's Suit / Tux", estimatedCost: 500, actualCost: null, depositPaid: null, balanceDue: 500, paymentDueDate: "", status: "Not Paid" },
  { id: "b13", category: "Attire", vendorItem: "Accessories (veil, shoes, jewelry)", estimatedCost: 400, actualCost: null, depositPaid: null, balanceDue: 400, paymentDueDate: "", status: "Not Paid" },
  { id: "b14", category: "Beauty", vendorItem: "Hair & Makeup", estimatedCost: 600, actualCost: null, depositPaid: null, balanceDue: 600, paymentDueDate: "", status: "Not Paid" },
  { id: "b15", category: "Stationery", vendorItem: "Invitations & Save-the-Dates", estimatedCost: 400, actualCost: null, depositPaid: null, balanceDue: 400, paymentDueDate: "", status: "Not Paid" },
  { id: "b16", category: "Stationery", vendorItem: "Programs, Menus, Place Cards", estimatedCost: 200, actualCost: null, depositPaid: null, balanceDue: 200, paymentDueDate: "", status: "Not Paid" },
  { id: "b17", category: "Jewelry", vendorItem: "Wedding Rings", estimatedCost: 1500, actualCost: null, depositPaid: null, balanceDue: 1500, paymentDueDate: "", status: "Not Paid" },
  { id: "b18", category: "Logistics", vendorItem: "Transportation", estimatedCost: 500, actualCost: null, depositPaid: null, balanceDue: 500, paymentDueDate: "", status: "Not Paid" },
  { id: "b19", category: "Accommodations", vendorItem: "Hotel Room Block / Bridal Suite", estimatedCost: 600, actualCost: null, depositPaid: null, balanceDue: 600, paymentDueDate: "", status: "Not Paid" },
  { id: "b20", category: "Gifts", vendorItem: "Wedding Favors", estimatedCost: 300, actualCost: null, depositPaid: null, balanceDue: 300, paymentDueDate: "", status: "Not Paid" },
  { id: "b21", category: "Gifts", vendorItem: "Wedding Party Gifts", estimatedCost: 400, actualCost: null, depositPaid: null, balanceDue: 400, paymentDueDate: "", status: "Not Paid" },
  { id: "b22", category: "Events", vendorItem: "Rehearsal Dinner", estimatedCost: 1000, actualCost: null, depositPaid: null, balanceDue: 1000, paymentDueDate: "", status: "Not Paid" },
  { id: "b23", category: "Legal", vendorItem: "Marriage License & Officiant Fee", estimatedCost: 200, actualCost: null, depositPaid: null, balanceDue: 200, paymentDueDate: "", status: "Not Paid" },
  { id: "b24", category: "Honeymoon", vendorItem: "Flights & Accommodation", estimatedCost: 3000, actualCost: null, depositPaid: null, balanceDue: 3000, paymentDueDate: "", status: "Not Paid" },
  { id: "b25", category: "Misc", vendorItem: "Tips for Vendors", estimatedCost: 500, actualCost: null, depositPaid: null, balanceDue: 500, paymentDueDate: "", status: "Not Paid" },
  { id: "b26", category: "Misc", vendorItem: "Emergency / Contingency Fund", estimatedCost: 800, actualCost: null, depositPaid: null, balanceDue: 800, paymentDueDate: "", status: "Not Paid" },
];

export type Guest = {
  id: string;
  name: string;
  plusOne: string;
  group: "Family" | "Friends" | "Work" | "Other";
  inviteSent: boolean;
  rsvpStatus: "Pending" | "Accepted" | "Declined";
  mealPreference: string;
  dietaryNeeds: string;
  tableNumber: number | null;
  giftReceived: boolean;
  thankYouSent: boolean;
};

export const INITIAL_GUESTS: Guest[] = [
  { id: "g1", name: "", plusOne: "", group: "Family", inviteSent: false, rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "", tableNumber: null, giftReceived: false, thankYouSent: false },
  { id: "g2", name: "", plusOne: "", group: "Family", inviteSent: false, rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "", tableNumber: null, giftReceived: false, thankYouSent: false },
  { id: "g3", name: "", plusOne: "", group: "Friends", inviteSent: false, rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "", tableNumber: null, giftReceived: false, thankYouSent: false },
  { id: "g4", name: "", plusOne: "", group: "Friends", inviteSent: false, rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "", tableNumber: null, giftReceived: false, thankYouSent: false },
  { id: "g5", name: "", plusOne: "", group: "Work", inviteSent: false, rsvpStatus: "Pending", mealPreference: "", dietaryNeeds: "", tableNumber: null, giftReceived: false, thankYouSent: false },
];

export type Vendor = {
  id: string;
  category: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  contractSigned: boolean;
  depositPaid: boolean;
  notes: string;
};

export const INITIAL_VENDORS: Vendor[] = [
  { id: "v1", category: "Venue", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v2", category: "Caterer", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v3", category: "Photographer", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v4", category: "Videographer", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v5", category: "Florist", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v6", category: "DJ / Band", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v7", category: "Hair & Makeup", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v8", category: "Baker (Cake)", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v9", category: "Officiant", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v10", category: "Transportation", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v11", category: "Rentals", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v12", category: "Stationery/Calligrapher", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v13", category: "Wedding Planner", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
  { id: "v14", category: "Hotel/Accommodations", vendorName: "", contactPerson: "", phone: "", email: "", website: "", contractSigned: false, depositPaid: false, notes: "" },
];

export type TimelineEvent = {
  id: string;
  time: string;
  event: string;
  location: string;
  responsible: string;
  notes: string;
};

export const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "t1", time: "7:00 AM", event: "Hair & Makeup begins (bridal party)", location: "Hotel/Suite", responsible: "Hair & Makeup Artist", notes: "" },
  { id: "t2", time: "8:00 AM", event: "Breakfast for bridal party", location: "Hotel/Suite", responsible: "Maid of Honor", notes: "" },
  { id: "t3", time: "9:00 AM", event: "Photographer arrives — getting ready shots", location: "Hotel/Suite", responsible: "Photographer", notes: "" },
  { id: "t4", time: "10:00 AM", event: "Groom & groomsmen get ready", location: "Groom's Suite", responsible: "Best Man", notes: "" },
  { id: "t5", time: "11:00 AM", event: "First look photos (optional)", location: "Venue Garden", responsible: "Photographer", notes: "" },
  { id: "t6", time: "11:30 AM", event: "Wedding party photos", location: "Venue", responsible: "Photographer", notes: "" },
  { id: "t7", time: "12:00 PM", event: "Family formal photos", location: "Venue", responsible: "Photographer", notes: "" },
  { id: "t8", time: "12:30 PM", event: "Lunch break for wedding party", location: "Venue", responsible: "Coordinator", notes: "" },
  { id: "t9", time: "1:00 PM", event: "Florist delivers & sets up", location: "Venue", responsible: "Florist / Coordinator", notes: "" },
  { id: "t10", time: "1:30 PM", event: "DJ / Band setup & sound check", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t11", time: "2:00 PM", event: "Ceremony rehearsal (quick run-through)", location: "Ceremony Space", responsible: "Officiant", notes: "" },
  { id: "t12", time: "2:30 PM", event: "Guests begin to arrive", location: "Ceremony Space", responsible: "Ushers", notes: "" },
  { id: "t13", time: "3:00 PM", event: "Ceremony begins", location: "Ceremony Space", responsible: "Officiant", notes: "" },
  { id: "t14", time: "3:30 PM", event: "Ceremony ends — Cocktail hour begins", location: "Cocktail Area", responsible: "Caterer / DJ", notes: "" },
  { id: "t15", time: "4:00 PM", event: "Couple photos (golden hour)", location: "Venue Grounds", responsible: "Photographer", notes: "" },
  { id: "t16", time: "4:30 PM", event: "Guests seated for reception", location: "Reception Hall", responsible: "Coordinator", notes: "" },
  { id: "t17", time: "4:45 PM", event: "Grand entrance of newlyweds", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t18", time: "5:00 PM", event: "First dance", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t19", time: "5:15 PM", event: "Welcome speech & toasts", location: "Reception Hall", responsible: "Best Man / MOH", notes: "" },
  { id: "t20", time: "5:45 PM", event: "Dinner service begins", location: "Reception Hall", responsible: "Caterer", notes: "" },
  { id: "t21", time: "6:45 PM", event: "Parent dances", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t22", time: "7:00 PM", event: "Cake cutting", location: "Reception Hall", responsible: "Coordinator", notes: "" },
  { id: "t23", time: "7:15 PM", event: "Open dancing & party", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t24", time: "8:30 PM", event: "Bouquet & garter toss (optional)", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t25", time: "9:30 PM", event: "Last dance", location: "Reception Hall", responsible: "DJ / Band", notes: "" },
  { id: "t26", time: "10:00 PM", event: "Grand exit / Send-off", location: "Venue Exit", responsible: "Coordinator", notes: "" },
  { id: "t27", time: "10:30 PM", event: "Vendor breakdown & final payments", location: "Venue", responsible: "Coordinator", notes: "" },
];

export type PaymentItem = {
  id: string;
  vendor: string;
  description: string;
  amount: number;
  dueDate: string;
  datePaid: string;
  method: string;
  status: "Pending" | "Paid" | "Overdue";
};

export const PAYMENT_ITEMS: PaymentItem[] = [
  { id: "p1", vendor: "Venue", description: "Deposit (50%)", amount: 4000, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p2", vendor: "Venue", description: "Final Payment", amount: 4000, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p3", vendor: "Caterer", description: "Deposit (30%)", amount: 1500, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p4", vendor: "Caterer", description: "Final Payment", amount: 3500, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p5", vendor: "Photographer", description: "Deposit", amount: 1000, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p6", vendor: "Photographer", description: "Final Payment", amount: 1500, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p7", vendor: "Florist", description: "Deposit", amount: 400, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p8", vendor: "Florist", description: "Final Payment", amount: 800, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p9", vendor: "DJ / Band", description: "Full Payment", amount: 1200, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p10", vendor: "Baker", description: "Deposit", amount: 150, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p11", vendor: "Baker", description: "Final Payment", amount: 350, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p12", vendor: "Hair & Makeup", description: "Full Payment", amount: 600, dueDate: "", datePaid: "", method: "", status: "Pending" },
  { id: "p13", vendor: "Transportation", description: "Full Payment", amount: 500, dueDate: "", datePaid: "", method: "", status: "Pending" },
];

export type Note = {
  id: string;
  category: string;
  idea: string;
  source: string;
  priority: "High" | "Medium" | "Low" | "";
};

export const INITIAL_NOTES: Note[] = [
  { id: "n1", category: "Venue Decor", idea: "", source: "", priority: "" },
  { id: "n2", category: "Dress Inspiration", idea: "", source: "", priority: "" },
  { id: "n3", category: "Flowers", idea: "", source: "", priority: "" },
  { id: "n4", category: "Cake Ideas", idea: "", source: "", priority: "" },
  { id: "n5", category: "Music / Playlist", idea: "", source: "", priority: "" },
  { id: "n6", category: "Photography Poses", idea: "", source: "", priority: "" },
  { id: "n7", category: "Color Palette", idea: "Sage Green monochromatic — #B7CFB5, #A2B5A2, #9BAA7F, #606C46, #405335", source: "Wedding Visual Board", priority: "High" },
  { id: "n8", category: "DIY Projects", idea: "", source: "", priority: "" },
];
