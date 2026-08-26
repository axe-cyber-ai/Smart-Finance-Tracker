@extends('layouts.app')

@section('title', 'Profil Sozlamalari')

@section('content')
<div class="max-w-4xl space-y-8">
    
    <div>
        <h2 class="text-2xl font-extrabold text-white">Profil Sozlamalari</h2>
        <p class="text-xs text-slate-400">Shaxsiy ma'lumotlaringizni va xavfsizlik parolingizni yangilang</p>
    </div>

    <!-- Personal Info Card -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border-slate-800">
        <div class="border-b border-slate-800 pb-4">
            <h3 class="text-lg font-bold text-white">Shaxsiy Ma'lumotlar</h3>
            <p class="text-xs text-slate-400">Ismingiz va email manzilingizni o'zgartiring</p>
        </div>

        <form method="POST" action="{{ route('profile.update') }}" class="space-y-5">
            @csrf
            @method('PUT')

            <!-- Name -->
            <div>
                <label for="name" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Ism va Familiya</label>
                <input type="text" id="name" name="name" value="{{ old('name', $user->name) }}" required
                       class="w-full bg-slate-800/80 border @error('name') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                @error('name')
                    <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
                @enderror
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Manzil</label>
                <input type="email" id="email" name="email" value="{{ old('email', $user->email) }}" required
                       class="w-full bg-slate-800/80 border @error('email') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                @error('email')
                    <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
                @enderror
            </div>

            <div class="border-t border-slate-800/80 pt-5 space-y-4">
                <h4 class="text-sm font-bold text-white">Parolni O'zgartirish (Ixtiyoriy)</h4>
                
                <!-- Current Password -->
                <div>
                    <label for="current_password" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Joriy Parol</label>
                    <input type="password" id="current_password" name="current_password"
                           class="w-full bg-slate-800/80 border @error('current_password') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                    @error('current_password')
                        <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <!-- New Password -->
                <div>
                    <label for="password" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Yangi Parol</label>
                    <input type="password" id="password" name="password"
                           class="w-full bg-slate-800/80 border @error('password') border-rose-500 @else border-slate-700 @enderror rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                    @error('password')
                        <p class="mt-1 text-xs text-rose-400 font-medium">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Confirm Password -->
                <div>
                    <label for="password_confirmation" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Yangi Parolni Tasdiqlang</label>
                    <input type="password" id="password_confirmation" name="password_confirmation"
                           class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                </div>
            </div>

            <!-- Submit Button -->
            <div class="pt-4 flex justify-end">
                <button type="submit"
                        class="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400">
                    O'zgarishlarni Saqlash
                </button>
            </div>
        </form>
    </div>

</div>
@endsection
