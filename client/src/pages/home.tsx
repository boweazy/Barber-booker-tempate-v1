
import { Link } from "wouter";

function Home() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-2">SmartFlow Systems</h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        Book your barber appointment in seconds.
      </p>
      <form className="space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="datetime-local"
          className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <Link href="/barbers">
          <button
            type="button"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition duration-300"
          >
            Confirm Booking
          </button>
        </Link>
      </form>
      
      {/* Navigation Links */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <Link href="/barbers">
          <button className="w-full text-blue-900 hover:text-green-500 font-medium py-2 transition duration-200">
            View Our Barbers
          </button>
        </Link>
        <Link href="/admin-login">
          <button className="w-full text-gray-500 hover:text-blue-900 text-sm py-1 transition duration-200">
            Admin Access
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
