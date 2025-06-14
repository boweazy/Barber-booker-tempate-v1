import OpenAI from "openai";
import nodemailer from "nodemailer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateBookingMessage(customerName: string, date: string, time: string) {
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a polite and friendly assistant at a barber shop." },
      { role: "user", content: `A customer named ${customerName} booked for ${date} at ${time}. Write a short, friendly confirmation message.` },
    ],
  });

  return chat.choices[0].message.content || "Thanks for booking!";
}

export async function sendEmailConfirmation(to: string, message: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smartflowsystemsb@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"SmartFlow Barbers" <smartflowsystemsb@gmail.com>',
    to,
    subject: "Your Barber Appointment",
    text: message,
  });
}