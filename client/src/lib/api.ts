import { apiRequest } from "@/lib/queryClient";
import type { Barber, Service, Booking, InsertBooking } from "@shared/schema";

export const api = {
  // Barbers
  getBarbers: async (): Promise<Barber[]> => {
    const response = await apiRequest("GET", "/api/barbers");
    return response.json();
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const response = await apiRequest("GET", "/api/services");
    return response.json();
  },

  // Availability
  getAvailability: async (barberId: number, date: string): Promise<string[]> => {
    const response = await apiRequest("GET", `/api/availability?barberId=${barberId}&date=${date}`);
    return response.json();
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    const response = await apiRequest("GET", "/api/bookings");
    return response.json();
  },

  createBooking: async (booking: InsertBooking): Promise<Booking> => {
    const response = await apiRequest("POST", "/api/bookings", booking);
    return response.json();
  },

  updateBooking: async (id: number, updates: { status: string }): Promise<Booking> => {
    const response = await apiRequest("PATCH", `/api/bookings/${id}`, updates);
    return response.json();
  },

  deleteBooking: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/bookings/${id}`);
  },
};
