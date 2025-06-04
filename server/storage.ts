import { 
  barbers, 
  services, 
  bookings, 
  type Barber, 
  type Service, 
  type Booking, 
  type InsertBarber, 
  type InsertService, 
  type InsertBooking 
} from "@shared/schema";

export interface IStorage {
  // Barbers
  getBarbers(): Promise<Barber[]>;
  getBarber(id: number): Promise<Barber | undefined>;
  createBarber(barber: InsertBarber): Promise<Barber>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking | undefined>;
  deleteBooking(id: number): Promise<boolean>;
  getBookingsByDate(date: string): Promise<Booking[]>;
  getBookingsByBarberAndDate(barberId: number, date: string): Promise<Booking[]>;
}

export class MemStorage implements IStorage {
  private barbers: Map<number, Barber>;
  private services: Map<number, Service>;
  private bookings: Map<number, Booking>;
  private currentBarberId: number;
  private currentServiceId: number;
  private currentBookingId: number;

  constructor() {
    this.barbers = new Map();
    this.services = new Map();
    this.bookings = new Map();
    this.currentBarberId = 1;
    this.currentServiceId = 1;
    this.currentBookingId = 1;
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default barbers
    const defaultBarbers: InsertBarber[] = [
      {
        name: "John Doe",
        title: "Senior Barber",
        experience: "8 years exp",
        rating: "4.9 (127 reviews)",
        avatar: "JD"
      },
      {
        name: "Mike Smith",
        title: "Master Barber",
        experience: "12 years exp",
        rating: "4.8 (203 reviews)",
        avatar: "MS"
      },
      {
        name: "Alex Johnson",
        title: "Specialist",
        experience: "6 years exp",
        rating: "4.7 (89 reviews)",
        avatar: "AJ"
      },
      {
        name: "Carlos Rivera",
        title: "Style Expert",
        experience: "10 years exp",
        rating: "4.9 (156 reviews)",
        avatar: "CR"
      }
    ];

    // Create default services
    const defaultServices: InsertService[] = [
      {
        name: "Classic Haircut",
        duration: 30,
        price: 2500 // $25.00
      },
      {
        name: "Haircut + Beard",
        duration: 45,
        price: 4000 // $40.00
      },
      {
        name: "Premium Package",
        duration: 60,
        price: 6000 // $60.00
      },
      {
        name: "Beard Trim",
        duration: 20,
        price: 1500 // $15.00
      }
    ];

    // Initialize barbers
    defaultBarbers.forEach(barber => {
      const id = this.currentBarberId++;
      this.barbers.set(id, { ...barber, id });
    });

    // Initialize services
    defaultServices.forEach(service => {
      const id = this.currentServiceId++;
      this.services.set(id, { ...service, id });
    });
  }

  // Barber methods
  async getBarbers(): Promise<Barber[]> {
    return Array.from(this.barbers.values());
  }

  async getBarber(id: number): Promise<Barber | undefined> {
    return this.barbers.get(id);
  }

  async createBarber(insertBarber: InsertBarber): Promise<Barber> {
    const id = this.currentBarberId++;
    const barber: Barber = { ...insertBarber, id };
    this.barbers.set(id, barber);
    return barber;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const service: Service = { ...insertService, id };
    this.services.set(id, service);
    return service;
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentBookingId++;
    const booking: Booking = { 
      id,
      customerName: insertBooking.customerName,
      customerPhone: insertBooking.customerPhone,
      barberId: insertBooking.barberId,
      serviceId: insertBooking.serviceId,
      date: insertBooking.date,
      time: insertBooking.time,
      status: insertBooking.status,
      createdAt: new Date()
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBooking(id: number, updates: Partial<InsertBooking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async deleteBooking(id: number): Promise<boolean> {
    return this.bookings.delete(id);
  }

  async getBookingsByDate(date: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.date === date);
  }

  async getBookingsByBarberAndDate(barberId: number, date: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.barberId === barberId && booking.date === date
    );
  }
}

export const storage = new MemStorage();
