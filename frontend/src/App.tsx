import { useEffect, useState } from 'react';
import { Download, Edit3, LogOut, Plus, Search, Sparkles, Trash2, X } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import { api, errorMessage } from './utils/api';
import type { Expense, ExpenseInput, MonthlyTotal, PageResult } from './types';
import { AuthPage } from './pages/AuthPage';
import { ExpenseForm } from './components/ExpenseForm';
import { Pagination } from './components/Pagination';
import { MonthlyChart } from './components/MonthlyChart';

export function App() { 
    const { user } = useAuth(); 
    return user ? <Dashboard /> : <AuthPage />; 
}

function Dashboard() {
  const { user, logout } = useAuth(); 
  const [result, setResult] = useState<PageResult>({ items: [], page: 1, limit: 10, total: 0, totalPages: 0 }); 
  const [monthly, setMonthly] = useState<MonthlyTotal[]>([]); 
  const [search, setSearch] = useState(''); 
  const [category, setCategory] = useState(''); 
  const [form, setForm] = useState<Expense | undefined>(); 
  const [formOpen, setFormOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  const load = async (page = result.page, limit = result.limit) => { 
        setLoading(true); 
        try { 
            const response = await api.get('/expenses', { 
                params: { page, limit, search: search || undefined, category: category || undefined } 
            }); 
            setResult(response.data.data); 
        } catch (error) { 
            toast.error(errorMessage(error)); 
        } finally { 
            setLoading(false); 
        } 
    };

  const loadMonthlySummary = async () => { 
        try { 
            const response = await api.get('/reports/monthly', { 
                params: { year: new Date().getFullYear() } 
            }); 
            setMonthly(response.data.data); 
        } catch (error) { 
            toast.error(errorMessage(error)); 
        } 
    };

  useEffect(() => { void load(1); }, [search, category]);
  useEffect(() => { void loadMonthlySummary(); }, []);
  
  const save = async (input: ExpenseInput) => { 
        try { 
            if (form) { 
                await api.put(`/expenses/${form.id}`, input); 
                toast.success('Expense updated.'); 
            } else { 
                await api.post('/expenses', input); 
                toast.success('Expense added.'); 
            } 
            setFormOpen(false); 
            setForm(undefined); await Promise.all([load(), loadMonthlySummary()]); 
        } catch (error) { 
            toast.error(errorMessage(error)); 
            throw error; 
        } 
    };

  const remove = async (id: number) => { 
        if (!window.confirm('Delete this expense?')) 
            return; 
        try { 
            await api.delete(`/expenses/${id}`); 
            toast.success('Expense deleted.'); 
            await Promise.all([load(), loadMonthlySummary()]); 
        } catch (error) { 
            toast.error(errorMessage(error)); 
        } 
    };

  const download = async () => { 
        try { 
            const from = `${new Date().getFullYear()}-01-01`; 
            const to = `${new Date().getFullYear()}-12-31`; 
            const response = await api.get('/reports', { 
                params: { from, to } 
            }); 
            const document = new jsPDF(); 
            document.setFontSize(20); 
            document.text('Ledgerly expense report', 20, 24); 
            document.setFontSize(10); 
            document.text(`${from} to ${to}`, 20, 32); 
            response.data.data.categories.forEach((row: { category: string; total: number }, index: number) => document.text(`${row.category}: ₹${row.total.toFixed(2)}`, 20, 48 + index * 8));
            document.save('ledgerly-expense-report.pdf'); 
            toast.success('Report downloaded.'); 
        } catch (error) { 
            toast.error(errorMessage(error)); 
        } 
    };

  const totalSpend = result.items.reduce((sum, expense) => sum + expense.amount, 0);

  return <div className="min-h-screen bg-cream">
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between border-r border-ink/10 bg-ink p-6 text-cream lg:flex">
        <div>
            <div className="flex items-center gap-2 font-display text-2xl">
                <Sparkles className="text-coral" size={20} />Ledgerly
            </div>
            <p className="mt-20 text-xs uppercase tracking-[0.2em] text-cream/40">Your money, in focus</p>
            <div className="mt-4 rounded-xl bg-white/10 p-4 text-sm leading-6 text-cream/70">Small entries become useful patterns.</div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-cream/60 hover:text-cream">
            <LogOut size={16} />Sign out
        </button>
    </aside>
    <main className="lg:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-cream/90 px-5 py-4 backdrop-blur md:px-10">
            <div>
                <p className="text-sm text-ink/50">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <h1 className="font-display text-2xl md:text-3xl">Good morning, {user?.name.split(' ')[0]}.</h1>
            </div>
            <button onClick={logout} aria-label="Sign out" className="rounded-lg p-2 text-ink/60 hover:bg-ink/5 lg:hidden">
                <LogOut size={18} />
            </button>
        </header>
        <div className="mx-auto max-w-6xl space-y-8 px-5 py-8 md:px-10">
            <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-ink p-6 text-cream md:col-span-2">
                    <p className="text-sm text-cream/60">Visible spend</p>
                    <p className="mt-2 font-display text-4xl">₹{totalSpend.toFixed(2)}</p>
                    <p className="mt-4 text-sm text-cream/60">{result.total} recorded {result.total === 1 ? 'expense' : 'expenses'}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-white p-6">
                    <p className="text-sm text-ink/50">This month</p>
                    <p className="mt-2 font-display text-4xl">₹{(monthly[new Date().getMonth()]?.total ?? 0).toFixed(2)}</p>
                    <button onClick={download} className="mt-5 flex items-center gap-2 text-sm font-semibold text-sage">
                        <Download size={16} />Download report
                    </button>
                </div>
            </section>
            <section className="rounded-2xl border border-ink/10 bg-white p-5 md:p-7">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sage">Activity</p>
                        <h2 className="mt-1 font-display text-2xl">Monthly rhythm</h2>
                    </div>
                    <button onClick={() => { setForm(undefined); setFormOpen(true); }} className="flex items-center gap-2 rounded-xl bg-coral px-4 py-2.5 text-sm font-semibold text-white hover:brightness-95">
                        <Plus size={17} />Add expense
                    </button>
                </div>
                <MonthlyChart data={monthly} />
            </section>
            <section className="rounded-2xl border border-ink/10 bg-white p-5 md:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-2xl">Recent expenses</h2>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        <label className="relative flex-1 sm:w-52">
                            <Search className="absolute left-3 top-2.5 text-ink/40" size={16} />
                            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses" className="input mt-0 pl-9" />
                        </label>
                        <select value={category} onChange={(event) => setCategory(event.target.value)} className="input mt-0 w-auto">
                            <option value="">All categories</option>
                            <option>Food</option>
                            <option>Transport</option>
                            <option>Home</option>
                            <option>Health</option>
                            <option>Entertainment</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                        <thead className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/40">
                            <tr>
                                <th className="pb-3">Description</th>
                                <th className="pb-3">Category</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3 text-right">Amount</th>
                                <th className="pb-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-ink/50">
                                        Loading your ledger...
                                    </td>
                                </tr>
                            ) : (
                                result.items.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="py-4 font-semibold">
                                            {expense.description || 'Untitled expense'}
                                        </td>
                                        <td className="py-4">
                                            <span className="rounded-full bg-sage/10 px-2.5 py-1 text-xs font-semibold text-sage">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-ink/55">{expense.spentAt}</td>
                                        <td className="py-4 text-right font-semibold">₹{expense.amount.toFixed(2)}</td>
                                        <td className="py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    aria-label="Edit expense"
                                                    onClick={() => {
                                                        setForm(expense);
                                                        setFormOpen(true);
                                                    }}
                                                    className="rounded-lg p-2 text-ink/50 hover:bg-sage/10 hover:text-sage"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    aria-label="Delete expense"
                                                    onClick={() => void remove(expense.id)}
                                                    className="rounded-lg p-2 text-ink/50 hover:bg-coral/10 hover:text-coral"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-5">
                    <Pagination
                        {...result}
                        onPage={(page) => void load(page, result.limit)}
                        onLimit={(limit) => void load(1, limit)}
                    />
                </div>
            </section>
        </div>
    </main>

    {formOpen && (
        <ExpenseForm
            initial={form}
            onSubmit={save}
            onClose={() => {
                setFormOpen(false);
                setForm(undefined);
            }}
        />
    )}

    <button
        className="fixed bottom-5 right-5 rounded-full bg-coral p-4 text-white shadow-lg lg:hidden"
        onClick={() => {
            setForm(undefined);
            setFormOpen(true);
        }}
        aria-label="Add expense"
    >
        <Plus />
    </button>
</div>;
}
