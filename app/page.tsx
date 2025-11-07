'use client';

import { useState, useMemo } from 'react';

interface Expense {
  id: string;
  category: string;
  description: string;
  currentCost: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface Alternative {
  expenseId: string;
  suggestion: string;
  newCost: number;
  savings: number;
  annualSavings: number;
}

export default function Home() {
  const [promoMessage, setPromoMessage] = useState('Join the Wealth Building Mastermind - Next Session Dec 15th | Register Now →');
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Food', description: 'Daily coffee', currentCost: 6, frequency: 'daily' },
    { id: '2', category: 'Transport', description: 'Uber to work', currentCost: 25, frequency: 'daily' },
    { id: '3', category: 'Subscription', description: 'Streaming services', currentCost: 45, frequency: 'monthly' },
  ]);

  const [investmentRate, setInvestmentRate] = useState(7); // Annual return %
  const [timeHorizon, setTimeHorizon] = useState(10); // Years

  const addExpense = () => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      category: '',
      description: '',
      currentCost: 0,
      frequency: 'monthly',
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string | number) => {
    setExpenses(expenses.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Convert all expenses to annual costs
  const toAnnualCost = (cost: number, frequency: string): number => {
    switch (frequency) {
      case 'daily': return cost * 365;
      case 'weekly': return cost * 52;
      case 'monthly': return cost * 12;
      case 'yearly': return cost;
      default: return cost * 12;
    }
  };

  // Generate intelligent alternatives
  const generateAlternatives = (): Alternative[] => {
    const alternatives: Alternative[] = [];

    expenses.forEach(expense => {
      if (!expense.description || expense.currentCost === 0) return;

      let suggestion = '';
      let newCost = 0;
      let savingsPercent = 0;

      // Category-based suggestions
      if (expense.category.toLowerCase().includes('food') || expense.description.toLowerCase().includes('coffee')) {
        suggestion = 'Make at home - Premium coffee maker + beans';
        savingsPercent = 0.75; // Save 75%
      } else if (expense.category.toLowerCase().includes('transport') || expense.description.toLowerCase().includes('uber')) {
        suggestion = 'Bike + public transit monthly pass';
        savingsPercent = 0.80; // Save 80%
      } else if (expense.description.toLowerCase().includes('streaming')) {
        suggestion = 'Bundle services or share family plan';
        savingsPercent = 0.50; // Save 50%
      } else if (expense.description.toLowerCase().includes('gym')) {
        suggestion = 'Home equipment or outdoor workouts';
        savingsPercent = 0.70; // Save 70%
      } else if (expense.description.toLowerCase().includes('dining') || expense.description.toLowerCase().includes('restaurant')) {
        suggestion = 'Meal prep + occasional dining out';
        savingsPercent = 0.60; // Save 60%
      } else {
        suggestion = 'Find generic/bulk alternative';
        savingsPercent = 0.30; // Save 30%
      }

      newCost = expense.currentCost * (1 - savingsPercent);
      const savings = expense.currentCost - newCost;
      const annualSavings = toAnnualCost(savings, expense.frequency);

      alternatives.push({
        expenseId: expense.id,
        suggestion,
        newCost: Math.max(0, newCost),
        savings,
        annualSavings,
      });
    });

    return alternatives;
  };

  const alternatives = useMemo(() => generateAlternatives(), [expenses]);

  // Calculate totals
  const totalCurrentAnnual = expenses.reduce((sum, exp) =>
    sum + toAnnualCost(exp.currentCost, exp.frequency), 0
  );

  const totalSavingsAnnual = alternatives.reduce((sum, alt) =>
    sum + alt.annualSavings, 0
  );

  const totalNewAnnual = totalCurrentAnnual - totalSavingsAnnual;

  // Calculate compound growth of savings
  const calculateCompoundGrowth = (annualSavings: number, rate: number, years: number): number => {
    const monthlyRate = rate / 100 / 12;
    const months = years * 12;
    const monthlySavings = annualSavings / 12;

    // Future value of annuity formula
    if (monthlyRate === 0) return monthlySavings * months;
    return monthlySavings * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  };

  const futureValueOfSavings = calculateCompoundGrowth(totalSavingsAnnual, investmentRate, timeHorizon);
  const totalContributions = totalSavingsAnnual * timeHorizon;
  const investmentGains = futureValueOfSavings - totalContributions;

  return (
    <div className="min-h-screen">
      {/* Promotional Banner */}
      <div className="w-full bg-[#00a8e1] text-white py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex-1 text-sm md:text-base font-medium tracking-wide">
            <input
              type="text"
              value={promoMessage}
              onChange={(e) => setPromoMessage(e.target.value)}
              className="bg-transparent border-b border-white/30 focus:border-white outline-none w-full text-center"
              placeholder="Add your promotional message here..."
            />
          </div>
          <button className="text-white hover:text-white/80 text-sm font-bold tracking-widest">
            ✕
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#1a3e5c] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="border-l-4 border-[#00a8e1] pl-6">
            <h1 className="text-4xl md:text-6xl font-light tracking-widest mb-4">
              THE BETTER ALTERNATIVE
            </h1>
            <p className="text-xl md:text-2xl font-light mb-2 tracking-wide">
              Financial Optimization Calculator
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-3xl">
              Re-stack the deck. Find smarter alternatives for your daily expenses and see the long-term impact of better financial decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Expense Input Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-12 bg-[#00a8e1]"></div>
            <h2 className="text-3xl font-light tracking-wide text-[#1a3e5c]">
              YOUR CURRENT EXPENSES
            </h2>
          </div>

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="excel-grid">
              <thead>
                <tr>
                  <th className="w-8">#</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Cost ($)</th>
                  <th>Frequency</th>
                  <th>Annual Cost</th>
                  <th className="w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr key={expense.id}>
                    <td className="text-center font-mono text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={expense.category}
                        onChange={(e) => updateExpense(expense.id, 'category', e.target.value)}
                        className="excel-cell-input"
                        placeholder="e.g., Food, Transport"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                        className="excel-cell-input"
                        placeholder="What is this expense?"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={expense.currentCost || ''}
                        onChange={(e) => updateExpense(expense.id, 'currentCost', parseFloat(e.target.value) || 0)}
                        className="excel-cell-input font-mono"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <select
                        value={expense.frequency}
                        onChange={(e) => updateExpense(expense.id, 'frequency', e.target.value as Expense['frequency'])}
                        className="excel-cell-input"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </td>
                    <td className="font-mono font-semibold text-[#1a3e5c]">
                      ${toAnnualCost(expense.currentCost, expense.frequency).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-800 font-bold text-lg"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#1a3e5c] text-white font-semibold">
                  <td colSpan={5} className="text-right uppercase tracking-wide text-sm">
                    Total Annual Cost:
                  </td>
                  <td className="font-mono text-lg">
                    ${totalCurrentAnnual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={addExpense}
            className="mt-4 bg-[#00a8e1] text-white px-8 py-3 rounded hover:bg-[#0096c9] transition-colors font-medium tracking-wide uppercase"
          >
            + Add Expense
          </button>
        </section>

        {/* Alternatives Section */}
        {alternatives.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1 h-12 bg-[#00a8e1]"></div>
              <h2 className="text-3xl font-light tracking-wide text-[#1a3e5c]">
                BETTER ALTERNATIVES
              </h2>
            </div>

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="excel-grid">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Original Expense</th>
                    <th>Better Alternative</th>
                    <th>New Cost</th>
                    <th>Savings</th>
                    <th>Annual Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {alternatives.map((alt, index) => {
                    const expense = expenses.find(e => e.id === alt.expenseId);
                    if (!expense || !expense.description) return null;

                    return (
                      <tr key={alt.expenseId}>
                        <td className="text-center font-mono text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="font-medium">{expense.description}</td>
                        <td className="text-[#00a8e1]">{alt.suggestion}</td>
                        <td className="font-mono">
                          ${alt.newCost.toFixed(2)} <span className="text-gray-500">/ {expense.frequency}</span>
                        </td>
                        <td className="font-mono text-green-600 font-semibold">
                          -${alt.savings.toFixed(2)} <span className="text-gray-500">/ {expense.frequency}</span>
                        </td>
                        <td className="font-mono text-green-600 font-bold text-lg">
                          ${alt.annualSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-green-600 text-white font-semibold">
                    <td colSpan={5} className="text-right uppercase tracking-wide text-sm">
                      Total Annual Savings:
                    </td>
                    <td className="font-mono text-xl">
                      ${totalSavingsAnnual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Financial Calculator Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-12 bg-[#00a8e1]"></div>
            <h2 className="text-3xl font-light tracking-wide text-[#1a3e5c]">
              LONG-TERM IMPACT CALCULATOR
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="bg-white p-8 shadow-lg rounded-lg border-l-4 border-[#00a8e1]">
              <h3 className="text-xl font-medium mb-6 text-[#1a3e5c] tracking-wide">
                INVESTMENT PARAMETERS
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Annual Return Rate: {investmentRate}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={investmentRate}
                    onChange={(e) => setInvestmentRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00a8e1]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wide">
                    Time Horizon: {timeHorizon} Years
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00a8e1]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
                  Annual Savings to Invest
                </div>
                <div className="text-3xl font-bold text-[#00a8e1]">
                  ${totalSavingsAnnual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#1a3e5c] text-white p-8 shadow-lg rounded-lg">
              <h3 className="text-xl font-light mb-8 tracking-widest">
                WHAT YOUR SAVINGS BECOME
              </h3>

              <div className="space-y-6">
                <div className="bg-white/10 p-6 rounded-lg">
                  <div className="text-sm tracking-wide mb-2 opacity-80">
                    Total Contributions
                  </div>
                  <div className="text-2xl font-bold">
                    ${totalContributions.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white/10 p-6 rounded-lg">
                  <div className="text-sm tracking-wide mb-2 opacity-80">
                    Investment Gains
                  </div>
                  <div className="text-2xl font-bold text-green-300">
                    +${investmentGains.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-[#00a8e1] p-6 rounded-lg border-2 border-white/20">
                  <div className="text-sm tracking-wide mb-2 uppercase">
                    Future Value in {timeHorizon} Years
                  </div>
                  <div className="text-4xl font-bold">
                    ${futureValueOfSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20 text-sm opacity-80">
                <p>
                  By making smarter choices today, you could have an additional{' '}
                  <span className="font-bold text-[#00a8e1]">
                    ${futureValueOfSavings.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  {' '}in {timeHorizon} years. That&apos;s the power of compound growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-12 bg-[#00a8e1]"></div>
            <h2 className="text-3xl font-light tracking-wide text-[#1a3e5c]">
              SAVINGS VS LOSS COMPARISON
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Path */}
            <div className="bg-red-50 border-2 border-red-300 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">📉</div>
                <h3 className="text-xl font-semibold text-red-700 tracking-wide">
                  CURRENT PATH (No Changes)
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">
                    Total Spent Over {timeHorizon} Years
                  </div>
                  <div className="text-3xl font-bold text-red-700">
                    ${(totalCurrentAnnual * timeHorizon).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="pt-4 border-t border-red-200">
                  <div className="text-sm text-gray-600">
                    Money gone forever - no investment growth
                  </div>
                </div>
              </div>
            </div>

            {/* Better Path */}
            <div className="bg-green-50 border-2 border-green-300 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">📈</div>
                <h3 className="text-xl font-semibold text-green-700 tracking-wide">
                  BETTER PATH (With Alternatives)
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">
                    Total Spent Over {timeHorizon} Years
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    ${(totalNewAnnual * timeHorizon).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">
                    Plus Investment Growth
                  </div>
                  <div className="text-3xl font-bold text-[#00a8e1]">
                    +${futureValueOfSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200">
                  <div className="text-sm font-medium text-green-800">
                    Net Position: <span className="text-2xl font-bold">
                      ${(futureValueOfSavings - (totalCurrentAnnual - totalNewAnnual) * timeHorizon).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span> better off
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#00a8e1] text-white p-6 rounded-lg text-center">
            <div className="text-sm tracking-widest mb-2 uppercase">
              The Difference
            </div>
            <div className="text-5xl font-bold mb-2">
              ${(futureValueOfSavings + (totalCurrentAnnual - totalNewAnnual) * timeHorizon).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-lg opacity-90">
              That&apos;s what making better choices is worth in {timeHorizon} years
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a3e5c] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm tracking-widest mb-2 opacity-80">
            THE BETTER ALTERNATIVE
          </div>
          <div className="text-xs opacity-60">
            A financial optimization tool by Edmund Bogen
          </div>
        </div>
      </footer>
    </div>
  );
}
