import React, { useState } from 'react';
import { Home, Thermometer, Lightbulb, Wind, Calculator } from 'lucide-react';

export function HomeEfficiency() {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [homeSize, setHomeSize] = useState<string>('');
  const [currentBill, setCurrentBill] = useState<string>('');

  const rooms = [
    { name: 'Living Room', tips: ['LED lighting', 'Smart thermostat', 'Energy-efficient TV'] },
    { name: 'Kitchen', tips: ['Energy Star appliances', 'Efficient refrigerator', 'Induction cooking'] },
    { name: 'Bedroom', tips: ['Blackout curtains', 'Ceiling fans', 'Smart power strips'] },
    { name: 'Bathroom', tips: ['Low-flow fixtures', 'Efficient water heater', 'Ventilation fans'] },
  ];

  const calculateSavings = () => {
    if (!currentBill) return 0;
    const bill = parseFloat(currentBill);
    return Math.round(bill * 0.25); // Estimate 25% savings
  };

  return (
    <div className="space-y-6 slide-in-up">
      <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-white/70">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-blue-100 p-3">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Home Efficiency</h1>
            <p className="text-gray-600">Optimize your home's energy performance</p>
          </div>
        </div>

        {/* Quick Assessment */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">Quick Energy Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Home Size (sq ft)
              </label>
              <input
                type="number"
                value={homeSize}
                onChange={(e) => setHomeSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Energy Bill ($)
              </label>
              <input
                type="number"
                value={currentBill}
                onChange={(e) => setCurrentBill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 150"
              />
            </div>
          </div>
          {currentBill && (
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Potential Monthly Savings: ${calculateSavings()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Room-by-Room Guide */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Room-by-Room Efficiency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <button
                key={room.name}
                onClick={() => setSelectedRoom(selectedRoom === room.name ? '' : room.name)}
                className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <h4 className="font-medium text-gray-800">{room.name}</h4>
                {selectedRoom === room.name && (
                  <ul className="mt-2 space-y-1">
                    {room.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Key Systems */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium text-orange-800">Heating & Cooling</h4>
            </div>
            <p className="text-sm text-orange-700">
              Accounts for 50% of energy use. Upgrade to smart thermostats and improve insulation.
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Lighting</h4>
            </div>
            <p className="text-sm text-yellow-700">
              Switch to LED bulbs and use smart switches for 75% lighting energy savings.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">Ventilation</h4>
            </div>
            <p className="text-sm text-green-700">
              Proper ventilation reduces HVAC load and improves air quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}