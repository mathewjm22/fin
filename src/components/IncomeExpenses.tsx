import { useState } from "react";
import { FinancialData, Income, Expense } from "../types";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function IncomeExpenses({
  data,
  setData,
}: {
  data: FinancialData;
  setData: (d: FinancialData) => void;
}) {
  const [editingIncome, setEditingIncome] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);

  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState({ source: "", amount: "" });

  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ category: "", subCategory: "", amount: "" });

  const handleUpdateIncome = (
    id: string,
    field: keyof Income,
    value: string | number,
  ) => {
    setData({
      ...data,
      income: (data.income || []).map((inc) =>
        inc.id === id ? { ...inc, [field]: value } : inc,
      ),
    });
  };

  const handleUpdateExpense = (
    id: string,
    field: keyof Expense,
    value: string | number,
  ) => {
    setData({
      ...data,
      expenses: (data.expenses || []).map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp,
      ),
    });
  };

  const handleAddIncome = () => {
    if (!newIncome.source || !newIncome.amount) return;
    
    const income: Income = {
      id: Date.now().toString(),
      source: newIncome.source,
      amount: parseFloat(newIncome.amount) || 0,
    };
    
    setData({ ...data, income: [...(data.income || []), income] });
    setNewIncome({ source: "", amount: "" });
    setIsAddingIncome(false);
  };

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount) return;

    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      subCategory: newExpense.subCategory || "General",
      amount: parseFloat(newExpense.amount) || 0,
    };

    setData({ ...data, expenses: [...(data.expenses || []), expense] });
    setNewExpense({ category: "", subCategory: "", amount: "" });
    setIsAddingExpense(false);
  };

  const deleteIncome = (id: string) => {
    setData({ ...data, income: (data.income || []).filter((i) => i.id !== id) });
  };

  const deleteExpense = (id: string) => {
    setData({ ...data, expenses: (data.expenses || []).filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-zinc-100">Income & Expenses</h2>
        <p className="text-zinc-400 mt-1">Manage your monthly cash flow.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Income Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-zinc-100">
              Monthly Income
            </h3>
            {!isAddingIncome && (
              <button
                onClick={() => setIsAddingIncome(true)}
                className="flex items-center space-x-2 text-sm bg-lime-500 hover:bg-lime-400 text-zinc-950 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Income</span>
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isAddingIncome && (
              <div className="flex items-center justify-between p-4 bg-zinc-950/80 border border-lime-500/50 rounded-xl mb-4">
                <div className="flex-1 flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Income Source (e.g. Salary)"
                    value={newIncome.source}
                    onChange={(e) => setNewIncome({ ...newIncome, source: e.target.value })}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-lime-500"
                    autoFocus
                  />
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newIncome.amount}
                      onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-zinc-100 focus:outline-none focus:border-lime-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddIncome()}
                    />
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleAddIncome}
                      disabled={!newIncome.source || !newIncome.amount}
                      className="p-2 text-zinc-950 bg-lime-500 hover:bg-lime-400 disabled:opacity-50 disabled:hover:bg-lime-500 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsAddingIncome(false)}
                      className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(data.income || []).map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl group"
              >
                {editingIncome === inc.id ? (
                  <div className="flex-1 flex items-center space-x-4">
                    <input
                      type="text"
                      value={inc.source}
                      onChange={(e) =>
                        handleUpdateIncome(inc.id, "source", e.target.value)
                      }
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-lime-500"
                    />
                    <div className="relative w-32">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input
                        type="number"
                        value={inc.amount}
                        onChange={(e) =>
                          handleUpdateIncome(
                            inc.id,
                            "amount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-7 pr-3 py-1.5 text-zinc-100 focus:outline-none focus:border-lime-500"
                      />
                    </div>
                    <button
                      onClick={() => setEditingIncome(null)}
                      className="p-2 text-lime-400 hover:bg-lime-500/10 rounded-lg"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-zinc-200">{inc.source}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lime-400">
                        ${inc.amount.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingIncome(inc.id)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteIncome(inc.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {(!data.income || data.income.length === 0) && !isAddingIncome && (
              <div className="text-center py-12 text-zinc-500">
                No income sources added yet.
              </div>
            )}
          </div>
          <div className="flex justify-between items-center p-4 border-t border-zinc-800 mt-4">
            <span className="font-semibold text-zinc-400">Total Income</span>
            <span className="font-bold text-xl text-zinc-100">
              $
              {(data.income || [])
                .reduce((sum, i) => sum + (i?.amount || 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-zinc-100">
              Monthly Expenses
            </h3>
            {!isAddingExpense && (
              <button
                onClick={() => setIsAddingExpense(true)}
                className="flex items-center space-x-2 text-sm bg-zinc-100 hover:bg-white text-zinc-950 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>
            )}
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {isAddingExpense && (
              <div className="flex flex-col space-y-3 p-4 bg-zinc-950/80 border border-zinc-500/50 rounded-xl mb-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Category (e.g. Housing)"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500"
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Sub-category (Optional)"
                    value={newExpense.subCategory}
                    onChange={(e) => setNewExpense({ ...newExpense, subCategory: e.target.value })}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="relative w-1/2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-7 pr-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddExpense()}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsAddingExpense(false)}
                      className="px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddExpense}
                      disabled={!newExpense.category || !newExpense.amount}
                      className="px-4 py-2 text-sm font-medium text-zinc-950 bg-zinc-100 hover:bg-white disabled:opacity-50 disabled:hover:bg-zinc-100 rounded-lg transition-colors"
                    >
                      Save Expense
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(data.expenses || []).map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl group"
              >
                {editingExpense === exp.id ? (
                  <div className="flex-1 flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={exp.category}
                        onChange={(e) =>
                          handleUpdateExpense(
                            exp.id,
                            "category",
                            e.target.value,
                          )
                        }
                        placeholder="Category"
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-500"
                      />
                      <input
                        type="text"
                        value={exp.subCategory}
                        onChange={(e) =>
                          handleUpdateExpense(
                            exp.id,
                            "subCategory",
                            e.target.value,
                          )
                        }
                        placeholder="Sub-category"
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div className="flex space-x-3 justify-between items-center">
                      <div className="relative w-1/2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                        <input
                          type="number"
                          value={exp.amount}
                          onChange={(e) =>
                            handleUpdateExpense(
                              exp.id,
                              "amount",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-7 pr-3 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                      <button
                        onClick={() => setEditingExpense(null)}
                        className="px-4 py-1.5 text-sm font-medium text-zinc-950 bg-zinc-100 hover:bg-white rounded-lg transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium text-zinc-200">
                        {exp.category}
                      </p>
                      <p className="text-sm text-zinc-500">{exp.subCategory}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-zinc-100">
                        ${exp.amount.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingExpense(exp.id)}
                          className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteExpense(exp.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {(!data.expenses || data.expenses.length === 0) && !isAddingExpense && (
              <div className="text-center py-12 text-zinc-500">
                No expenses added yet.
              </div>
            )}
          </div>
          <div className="flex justify-between items-center p-4 border-t border-zinc-800 mt-4">
            <span className="font-semibold text-zinc-400">Total Expenses</span>
            <span className="font-bold text-xl text-zinc-100">
              $
              {(data.expenses || [])
                .reduce((sum, e) => sum + (e?.amount || 0), 0)
                .toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
