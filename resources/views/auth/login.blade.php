@extends('layouts.guest')

@section('title', 'Tizimga kirish')

@section('content')
<div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
    
    <div>
        <h3 class="text-xl font-bold text-white">Xush kelibsiz!</h3>
        <p class="text-xs text-slate-400 mt-1">Tizimga kirish uchun login va parolingizni kiriting</p>
    </div>

    @if(session('success'))
        <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            {{ session('success') }}
        </div>
    @endif

    <form method="POST" action="{{ route('login') }}" class="space-y-4">
        @csrf

        <!-- Email -->
        <div>
            <label for="email" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Manzil</label>
            <input type="email" id="email" name="email" value="{{ old('email', 'demo@smartfinance.uz') }}" required autofocus
                   class="w-full bg-slate-800/80 border @error('email') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
            @error('email')
                <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parol</label>
            <input type="password" id="password" name="password" value="password123" required
                   class="w-full bg-slate-800/80 border @error('password') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
            @error('password')
                <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="remember" class="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500">
                <span class="text-xs text-slate-400">Meni eslab qol</span>
            </label>
        </div>

        <!-- Submit Button -->
        <button type="submit"
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95">
            Kirish
        </button>

        <!-- Demo credentials hint -->
        <div class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 space-y-1">
            <p class="font-bold text-emerald-400">🔑 Demo Akkaunt:</p>
            <p>Email: <code class="text-amber-300 font-mono">demo@smartfinance.uz</code></p>
            <p>Parol: <code class="text-amber-300 font-mono">password123</code></p>
        </div>
    </form>

    <div class="text-center pt-2 border-t border-slate-800">
        <p class="text-xs text-slate-400">
            Akkauntingiz yo'qmi?
            <a href="{{ route('register') }}" class="font-bold text-emerald-400 hover:underline">Ro'yxatdan o'ting</a>
        </p>
    </div>

</div>
@endsection
