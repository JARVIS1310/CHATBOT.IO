import React, { useState } from 'react';
import { Leaf, Recycle, Sun, Droplets, TreePine } from 'lucide-react';

export function EcoFriendly() {
  const [carbonFootprint, setCarbonFootprint] = useState<string>('');
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const ecoActions = [
    {
      id: 'solar',
      name: 'Install Solar Panels',
      impact: 'Reduce CO₂ by 3-4 tons/year',
      icon: Sun,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Generate clean renewable energy for your home'
    },
    {
      id: 'led',
      name: 'Switch to LED Lighting',
      impact: 'Reduce CO₂ by 0.5 tons/year',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Use 75% less energy than traditional bulbs'
    },
    {
      id: 'water',
      name: 'Water Conservation',
      impact: 'Save 10,000+ gallons/year',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Low-flow fixtures and smart irrigation'
    },
    {
      id: 'recycling',
      name: 'Enhanced Recycling',
      impact: 'Reduce waste by 60%',
      icon: Recycle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Comprehensive recycling and composting program'
    },
    {
      id: 'landscaping',
      name: 'Native Landscaping',
      impact: 'Reduce water use by 50%',
      icon: TreePine,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Drought-resistant plants and natural gardening'
    }
  ];

  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const calculateImpact = () => {
    const impacts = {
      solar: 3.5,
      led: 0.5,
      water: 0.3,
      recycling: 0.8,
      landscaping: 0.4
    };
    
    return selectedActions.reduce((total, actionId) => {
      return total + (impacts[actionId as keyof typeof impacts] || 0);
    }, 0);
  };

  return (
    <div className="space-y-6 slide-in-up">
      <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-white/70">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <Leaf className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Eco-Friendly Solutions</h1>
            <p className="text-gray-600">Reduce your environmental impact and carbon footprint</p>
          </div>
        </div>

        {/* Carbon Footprint Tracker */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-3">Carbon Footprint Assessment</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Annual CO₂ Emissions (tons)
              </label>
              <input
                type="number"
                value={carbonFootprint}
                onChange={(e) => setCarbonFootprint(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., 16 (US average)"
              />
            </div>
            {carbonFootprint && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Compared to US Average</p>
                <p className={`text-lg font-semibold ${
                  parseFloat(carbonFootprint) > 16 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {parseFloat(carbonFootprint) > 16 ? 'Above' : 'Below'} Average
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Eco Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Eco-Friendly Actions</h3>
          <div className="space-y-4">
            {ecoActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                    selectedActions.includes(action.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => toggleAction(action.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${action.bgColor}`}>
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{action.name}</h4>
                        <input
                          type="checkbox"
                          checked={selectedActions.includes(action.id)}
                          onChange={() => toggleAction(action.id)}
                          className="w-4 h-4 text-green-600"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{action.description}</p>
                      <p className="text-sm font-medium text-green-700">{action.impact}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Impact Summary */}
        {selectedActions.length > 0 && (
          <div className="bg-emerald-50 rounded-xl p-6">
            <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Your Environmental Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {calculateImpact().toFixed(1)} tons
                </div>
                <p className="text-emerald-700">CO₂ Reduction per Year</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {Math.round(calculateImpact() * 2.5)}
                </div>
                <p className="text-emerald-700">Trees Equivalent Impact</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-100 rounded-lg text-center">
              <p className="text-emerald-800">
                <strong>Great job!</strong> Your selected actions will significantly reduce your environmental impact.
              </p>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Eco Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <div>• Unplug devices when not in use</div>
            <div>• Use cold water for washing clothes</div>
            <div>• Air dry clothes instead of using dryer</div>
            <div>• Choose renewable energy providers</div>
            <div>• Reduce, reuse, recycle materials</div>
            <div>• Use programmable thermostats</div>
          </div>
        </div>
      </div>
    </div>
  );
}