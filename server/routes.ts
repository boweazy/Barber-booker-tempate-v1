import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all barbers
  app.get("/api/barbers", async (req, res) => {
    try {
      const barbers = await storage.getBarbers();
      res.json(barbers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch barbers" });
    }
  });

  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get available time slots for a barber on a specific date
  app.get("/api/availability", async (req, res) => {
    try {
      const { barberId, date } = req.query;
      
      if (!barberId || !date) {
        return res.status(400).json({ message: "barberId and date are required" });
      }

      const existingBookings = await storage.getBookingsByBarberAndDate(
        parseInt(barberId as string), 
        date as string
      );

      // Generate all possible time slots (9:00 AM to 6:00 PM, 30-minute intervals)
      const allSlots = [];
      for (let hour = 9; hour < 18; hour++) {
        allSlots.push(`${hour.toString().padStart(2, '0')}:00`);
        allSlots.push(`${hour.toString().padStart(2, '0')}:30`);
      }

      // Filter out booked slots
      const bookedSlots = existingBookings.map(booking => booking.time);
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json(availableSlots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Create a new booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      
      // Check if the time slot is still available
      const existingBookings = await storage.getBookingsByBarberAndDate(
        validatedData.barberId,
        validatedData.date
      );
      
      const isSlotTaken = existingBookings.some(booking => booking.time === validatedData.time);
      if (isSlotTaken) {
        return res.status(409).json({ message: "This time slot is no longer available" });
      }

      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update booking status
  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["confirmed", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedBooking = await storage.updateBooking(id, { status });
      if (!updatedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Delete a booking
  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBooking(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
