import React, { useState } from 'react';
import { Battery, Smartphone, Clock, TrendingUp, Zap, Wifi } from 'lucide-react';

export function SmartUsage() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [automationLevel, setAutomationLevel] = useState<string>('basic');

  const smartDevices = [
    {
      id: 'thermostat',
      name: 'Smart Thermostat',
      savings: '$180/year',
      features: ['Auto scheduling', 'Remote control', 'Learning algorithms'],
      icon: '🌡️'
    },
    {
      id: 'lighting',
      name: 'Smart Lighting',
      savings: '$75/year',
      features: ['Motion sensors', 'Dimming', 'Color control'],
      icon: '💡'
    },
    {
      id: 'outlets',
      name: 'Smart Outlets',
      savings: '$50/year',
      features: ['Remote control', 'Usage monitoring', 'Scheduling'],
      icon: '🔌'
    },
    {
      id: 'water',
      name: 'Smart Water Heater',
      savings: '$120/year',
      features: ['Leak detection', 'Temperature control', 'Usage tracking'],
      icon: '🚿'
    },
    {
      id: 'appliances',
      name: 'Smart Appliances',
      savings: '$200/year',
      features: ['Energy optimization', 'Remote monitoring', 'Maintenance alerts'],
      icon: '🏠'
    },
    {
      id: 'security',
      name: 'Smart Security',
      savings: '$30/year',
      features: ['Motion detection', 'Smart cameras', 'Automated lighting'],
      icon: '🔒'
    }
  ];

  const automationLevels = [
    {
      id: 'basic',
      name: 'Basic Automation',
      description: 'Simple scheduling and remote control',
      savings: '10-15%'
    },
    {
      id: 'intermediate',
      name: 'Intermediate Automation',
      description: 'Learning algorithms and adaptive scheduling',
      savings: '15-25%'
    },
    {
      id: 'advanced',
      name: 'Advanced Automation',
      description: 'AI-powered optimization and predictive control',
      savings: '25-35%'
    }
  ];

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const calculateTotalSavings = () => {
    return selectedDevices.reduce((total, deviceId) => {
      const device = smartDevices.find(d => d.id === deviceId);
      if (device) {
        const savings = parseInt(device.savings.replace(/[^0-9]/g, ''));
        return total + savings;
      }
      return total;
    }, 0);
  };

  const getAutomationMultiplier = () => {
    switch (automationLevel) {
      case 'intermediate': return 1.2;
      case 'advanced': return 1.5;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6 slide-in-up">
      <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-white/70">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-purple-100 p-3">
            <Battery className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Smart Usage & Automation</h1>
            <p className="text-gray-600">Optimize energy usage with smart technology</p>
          </div>
        </div>

        {/* Automation Level Selection */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-purple-800 mb-3">Choose Your Automation Level</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {automationLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setAutomationLevel(level.id)}
                className={`p-3 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  automationLevel === level.id
                    ? 'bg-purple-200 border-2 border-purple-500'
                    : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                }`}
              >
                <h4 className="font-medium text-gray-800">{level.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                <p className="text-sm font-medium text-purple-600 mt-2">
                  {level.savings} energy savings
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Smart Devices */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Smart Devices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smartDevices.map((device) => (
              <div
                key={device.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedDevices.includes(device.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => toggleDevice(device.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{device.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-800">{device.name}</h4>
                      <p className="text-sm font-medium text-green-600">{device.savings}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                    className="w-4 h-4 text-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  {device.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Patterns */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Smart Usage Patterns</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-800">Peak Hours</h4>
              <p className="text-sm text-blue-600">Avoid 4-9 PM usage</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-800">Off-Peak</h4>
              <p className="text-sm text-green-600">Use 10 PM-6 AM</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5">
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-medium text-yellow-800">Load Balancing</h4>
              <p className="text-sm text-yellow-600">Distribute usage</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center transition-all duration-300 hover:-translate-y-0.5">
              <Wifi className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-800">Remote Control</h4>
              <p className="text-sm text-purple-600">Monitor anywhere</p>
            </div>
          </div>
        </div>

        {/* Savings Summary */}
        {selectedDevices.length > 0 && (
          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="font-semibold text-indigo-800 mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Your Smart Home Savings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  ${calculateTotalSavings()}
                </div>
                <p className="text-indigo-700">Base Annual Savings</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  ${Math.round(calculateTotalSavings() * getAutomationMultiplier())}
                </div>
                <p className="text-indigo-700">With Automation</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {Math.round((calculateTotalSavings() * getAutomationMultiplier()) / 12)}%
                </div>
                <p className="text-indigo-700">Energy Reduction</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-indigo-100 rounded-lg text-center">
              <p className="text-indigo-800">
                <strong>Smart Investment:</strong> Your selected devices will pay for themselves through energy savings!
              </p>
            </div>
          </div>
        )}

        {/* Smart Tips */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Smart Usage Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div>• Set thermostats 7-10°F lower when away</div>
            <div>• Use smart power strips to eliminate phantom loads</div>
            <div>• Schedule high-energy tasks during off-peak hours</div>
            <div>• Monitor real-time usage with smart meters</div>
            <div>• Set up automated lighting based on occupancy</div>
            <div>• Use smart water heaters with vacation modes</div>
          </div>
        </div>
      </div>
    </div>
  );
}