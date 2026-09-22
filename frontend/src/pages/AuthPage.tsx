import { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../utils/api';
export function AuthPage() { 
    const { authenticate, loading } = useAuth(); 
    const [mode, setMode] = useState<'login' | 'register'>('login'); 
    const [values, setValues] = useState({ name: '', email: '', password: '' }); 
    const submit = async (event: React.FormEvent) => { 
        event.preventDefault(); 
        if (values.password.length < 8) 
            return toast.error('Password must be at least 8 characters.');

        try { 
            await authenticate(mode, values); 
            toast.success(mode === 'login' ? 'Welcome back.' : 'Your account is ready.'); 
        } catch (error) { 
            toast.error(errorMessage(error)); 
        } 
    }; 
return <main className="grid min-h-screen place-items-center bg-cream px-4 py-10">
    <section className="w-full max-w-md animate-rise">
        <div className="mb-8 flex items-center gap-3 text-sage">
            <BookOpen size={28} />
            <span className="font-display text-2xl text-ink">Ledgerly</span>
        </div>
        <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-xl shadow-ink/5">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-coral">Personal finance, clarified</p>
            <h1 className="font-display text-4xl leading-tight text-ink">{mode === 'login' ? 'A calmer view of your spending.' : 'Start your spending story.'}</h1>
            <p className="mt-3 text-sm leading-6 text-ink/60">Capture the everyday details, then see the patterns that matter.</p>
            <form onSubmit={submit} className="mt-7 space-y-4">{mode === 'register' && 
                <label className="label">Name
                    <input required value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} className="input" />
                </label>}
                <label className="label">Email
                    <input required type="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} className="input" />
                </label>
                <label className="label">Password
                    <input required minLength={8} type="password" value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} className="input" />
                </label>
                <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 font-semibold text-cream transition hover:bg-sage disabled:opacity-50">{loading ? 'Working...' : mode === 'login' ? 'Enter Ledgerly' : 'Create account'}
                    <ArrowRight size={17} />
                </button>
            </form>
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-5 w-full text-center text-sm text-ink/60 underline underline-offset-4">{mode === 'login' ? 'New here? Create an account' : 'Already registered? Sign in'}</button>
        </div>
    </section>
</main>; }
