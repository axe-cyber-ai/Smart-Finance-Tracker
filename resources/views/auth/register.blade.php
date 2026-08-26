@extends('layouts.guest')

@section('title', 'Ro\'yxatdan o\'tish')

@section('content')
<div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
    
    <div>
        <h3 class="text-xl font-bold text-white">Yangi Akkaunt Yaratish</h3>
        <p class="text-xs text-slate-400 mt-1">Smart Finance Tracker bilan moliyangizni nazorat qiling</p>
    </div>

    <form method="POST" action="{{ route('register') }}" class="space-y-4">
        @csrf

        <!-- Name -->
        <div>
            <label for="name" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Ism va Familiya</label>
            <input type="text" id="name" name="name" value="{{ old('name') }}" required autofocus placeholder="Masalan: Alisher Navoiy"
                   class="w-full bg-slate-800/80 border @error('name') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
            @error('name')
                <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Email -->
        <div>
            <label for="email" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Manzil</label>
            <input type="email" id="email" name="email" value="{{ old('email') }}" required placeholder="email@example.com"
                   class="w-full bg-slate-800/80 border @error('email') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
            @error('email')
                <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password -->
        <div>
            <label for="password" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parol</label>
            <input type="password" id="password" name="password" required placeholder="Kamida 8 ta belgi"
                   class="w-full bg-slate-800/80 border @error('password') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
            @error('password')
                <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
            @enderror
        </div>

        <!-- Password Confirmation -->
        <div>
            <label for="password_confirmation" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Parolni Tasdiqlang</label>
            <input type="password" id="password_confirmation" name="password_confirmation" required placeholder="Parolni qayta kiriting"
                   class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
        </div>

        <!-- Submit Button -->
        <button type="submit"
                class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95">
            Ro'yxatdan o'tish
        </button>
    </form>

    <div class="text-center pt-2 border-t border-slate-800">
        <p class="text-xs text-slate-400">
            Akkauntingiz bormi?
            <a href="{{ route('login') }}" class="font-bold text-emerald-400 hover:underline">Tizimga kiring</a>
        </p>
    </div>

</div>
@endsection
