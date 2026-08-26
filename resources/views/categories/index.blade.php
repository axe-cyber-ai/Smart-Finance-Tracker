@extends('layouts.app')

@section('title', 'Kategoriyalar')

@section('content')
<div class="space-y-8" x-data="{ createModalOpen: false, editModalOpen: false, editCat: {} }">
    
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-extrabold text-white">Kategoriyalar Boshqaruvi</h2>
            <p class="text-xs text-slate-400">Tizim standart va shaxsiy kategoriyalaringiz</p>
        </div>

        <button @click="createModalOpen = true" 
                class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <span>Yangi Kategoriya</span>
        </button>
    </div>

    <!-- Section 1: User Custom Categories -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span>👤 Sizning Shaxsiy Kategoriyalaringiz</span>
                <span class="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Custom</span>
            </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @forelse($userCategories as $cat)
            <div class="glass-card p-5 rounded-2xl flex items-center justify-between border-slate-800 glass-card-hover">
                <div class="flex items-center gap-3">
                    <span class="w-4 h-4 rounded-full flex-shrink-0" style="background-color: {{ $cat->color }}"></span>
                    <div>
                        <h4 class="font-bold text-white text-sm">{{ $cat->name }}</h4>
                        <span class="text-[10px] uppercase font-bold text-slate-400">{{ $cat->type === 'income' ? 'Daromad' : 'Xarajat' }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-1">
                    <button @click="editCat = { id: {{ $cat->id }}, name: '{{ addslashes($cat->name) }}', type: '{{ $cat->type }}', color: '{{ $cat->color }}', icon: '{{ $cat->icon }}' }; editModalOpen = true"
                            class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800">
                        ✏️
                    </button>
                    <form method="POST" action="{{ route('categories.destroy', $cat->id) }}" onsubmit="return confirm('Ushbu kategoriyani o\'chirmoqchimisiz?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10">🗑️</button>
                    </form>
                </div>
            </div>
            @empty
            <div class="col-span-full py-8 glass-card rounded-2xl text-center text-slate-500 text-xs">
                Siz hali shaxsiy kategoriya yaratmadingiz. Yuqoridagi "+ Yangi Kategoriya" tugmasini bosing.
            </div>
            @endforelse
        </div>
    </div>

    <!-- Section 2: System Default Categories -->
    <div class="space-y-4 pt-4 border-t border-slate-800">
        <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
                <span>⚡ Standart Tizim Kategoriyalari</span>
                <span class="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">Tizim</span>
            </h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @foreach($systemCategories as $cat)
            <div class="glass-card p-4 rounded-2xl flex items-center justify-between border-slate-800/80 opacity-90">
                <div class="flex items-center gap-3">
                    <span class="w-3.5 h-3.5 rounded-full flex-shrink-0" style="background-color: {{ $cat->color }}"></span>
                    <div>
                        <h4 class="font-bold text-slate-200 text-xs">{{ $cat->name }}</h4>
                        <span class="text-[9px] uppercase font-bold text-slate-500">{{ $cat->type === 'income' ? 'Daromad' : 'Xarajat' }}</span>
                    </div>
                </div>
                <span class="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded">Standart</span>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Create Category Modal -->
    <div x-show="createModalOpen" class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" @click="createModalOpen = false"></div>
            <div class="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white">Yangi Shaxsiy Kategoriya</h3>
                    <button @click="createModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form action="{{ route('categories.store') }}" method="POST" class="mt-4 space-y-4">
                    @csrf
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Kategoriya Nomi</label>
                        <input type="text" name="name" required placeholder="Masalan: Kitoblar" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Turi</label>
                        <select name="type" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                            <option value="expense">Xarajat</option>
                            <option value="income">Daromad</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Rang Hex Kod</label>
                            <input type="color" name="color" value="#10B981" class="w-full h-11 bg-slate-800 border border-slate-700 rounded-xl p-1">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Ikonka Nom</label>
                            <input type="text" name="icon" value="tag" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                        </div>
                    </div>
                    <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="createModalOpen = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">Bekor qilish</button>
                        <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">Saqlash</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Category Modal -->
    <div x-show="editModalOpen" class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" @click="editModalOpen = false"></div>
            <div class="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white">Kategoriyani Tahrirlash</h3>
                    <button @click="editModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form :action="'/categories/' + editCat.id" method="POST" class="mt-4 space-y-4">
                    @csrf
                    @method('PUT')
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Kategoriya Nomi</label>
                        <input type="text" name="name" x-model="editCat.name" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Turi</label>
                        <select name="type" x-model="editCat.type" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                            <option value="expense">Xarajat</option>
                            <option value="income">Daromad</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Rang</label>
                            <input type="color" name="color" x-model="editCat.color" class="w-full h-11 bg-slate-800 border border-slate-700 rounded-xl p-1">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Ikonka</label>
                            <input type="text" name="icon" x-model="editCat.icon" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                        </div>
                    </div>
                    <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="editModalOpen = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">Bekor qilish</button>
                        <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">Yangilash</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</div>
@endsection
