import React, { useState } from 'react';
import { Zap, DollarSign, TrendingDown, PiggyBank } from 'lucide-react';

export function EnergySavings() {
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);

  const upgrades = [
    { id: 'led', name: 'LED Lighting', cost: 200, savings: 15, payback: '1.1 years' },
    { id: 'thermostat', name: 'Smart Thermostat', cost: 250, savings: 25, payback: '0.8 years' },
    { id: 'insulation', name: 'Better Insulation', cost: 1500, savings: 40, payback: '3.1 years' },
    { id: 'windows', name: 'Energy Windows', cost: 3000, savings: 30, payback: '8.3 years' },
    { id: 'appliances', name: 'Energy Star Appliances', cost: 2000, savings: 35, payback: '4.8 years' },
    { id: 'solar', name: 'Solar Panels', cost: 15000, savings: 120, payback: '10.4 years' },
  ];

  const toggleUpgrade = (upgradeId: string) => {
    setSelectedUpgrades(prev => 
      prev.includes(upgradeId) 
        ? prev.filter(id => id !== upgradeId)
        : [...prev, upgradeId]
    );
  };

  const calculateTotalSavings = () => {
    return selectedUpgrades.reduce((total, upgradeId) => {
      const upgrade = upgrades.find(u => u.id === upgradeId);
      return total + (upgrade?.savings || 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    return selectedUpgrades.reduce((total, upgradeId) => {
      const upgrade = upgrades.find(u => u.id === upgradeId);
      return total + (upgrade?.cost || 0);
    }, 0);
  };

  const calculateAnnualSavings = () => {
    return calculateTotalSavings() * 12;
  };

  return (
    <div className="space-y-6 slide-in-up">
      <div className="bg-white/95 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl border border-white/70">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-yellow-100 p-3">
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Energy Savings Calculator</h1>
            <p className="text-gray-600">Calculate potential savings from energy upgrades</p>
          </div>
        </div>

        {/* Current Bill Input */}
        <div className="bg-yellow-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-3">Current Energy Costs</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Energy Bill ($)
              </label>
              <input
                type="number"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="e.g., 150"
              />
            </div>
            {monthlyBill && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Annual Cost</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${(parseFloat(monthlyBill) * 12).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Energy Upgrades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upgrades.map((upgrade) => (
              <div
                key={upgrade.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                  selectedUpgrades.includes(upgrade.id)
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
                onClick={() => toggleUpgrade(upgrade.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{upgrade.name}</h4>
                  <input
                    type="checkbox"
                    checked={selectedUpgrades.includes(upgrade.id)}
                    onChange={() => toggleUpgrade(upgrade.id)}
                    className="w-4 h-4 text-yellow-600"
                  />
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Cost: ${upgrade.cost.toLocaleString()}</p>
                  <p>Monthly Savings: ${upgrade.savings}</p>
                  <p>Payback: {upgrade.payback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Summary */}
        {selectedUpgrades.length > 0 && (
          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
              <PiggyBank className="h-5 w-5" />
              Your Savings Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Total Investment</span>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  ${calculateTotalCost().toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Monthly Savings</span>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  ${calculateTotalSavings()}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-700">Annual Savings</span>
                </div>
                <p className="text-2xl font-bold text-green-800">
                  ${calculateAnnualSavings().toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg text-center">
              <p className="text-green-800">
                <strong>Payback Period:</strong> {' '}
                {calculateTotalCost() > 0 && calculateAnnualSavings() > 0
                  ? `${(calculateTotalCost() / calculateAnnualSavings()).toFixed(1)} years`
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}