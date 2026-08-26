@extends('layouts.app')

@section('title', 'Tranzaksiyalar')

@section('content')
<div class="space-y-6" x-data="{ createModalOpen: false, editModalOpen: false, editTx: {} }">
    
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-extrabold text-white">Tranzaksiyalar Ro'yxati</h2>
            <p class="text-xs text-slate-400">Barcha daromad va xarajat yozuvlaringizni boshqaring</p>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
            <a href="{{ route('transactions.export', request()->query()) }}" 
               class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-300 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-colors w-full sm:w-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>CSV Eksport</span>
            </a>
            <button @click="createModalOpen = true" 
                    class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 transition-all w-full sm:w-auto">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Yangi Yozuv</span>
            </button>
        </div>
    </div>

    <!-- Filter Controls Panel -->
    <div class="glass-card p-5 rounded-3xl space-y-4">
        <form method="GET" action="{{ route('transactions.index') }}" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            <!-- Search -->
            <div>
                <label for="search" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Qidiruv (Izoh)</label>
                <input type="text" id="search" name="search" value="{{ request('search') }}" placeholder="Tavsif bo'yicha..." 
                       class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500">
            </div>

            <!-- Type -->
            <div>
                <label for="type" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tranzaksiya Turi</label>
                <select id="type" name="type" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500">
                    <option value="">Barchasi</option>
                    <option value="income" {{ request('type') === 'income' ? 'selected' : '' }}>Daromad</option>
                    <option value="expense" {{ request('type') === 'expense' ? 'selected' : '' }}>Xarajat</option>
                </select>
            </div>

            <!-- Category -->
            <div>
                <label for="category_id" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kategoriya</label>
                <select id="category_id" name="category_id" class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500">
                    <option value="">Barchasi</option>
                    @foreach($categories as $cat)
                        <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>

            <!-- Date Range: Start -->
            <div>
                <label for="start_date" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Boshlanish Sanasi</label>
                <input type="date" id="start_date" name="start_date" value="{{ request('start_date') }}"
                       class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500">
            </div>

            <!-- Date Range: End -->
            <div>
                <label for="end_date" class="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tugash Sanasi</label>
                <input type="date" id="end_date" name="end_date" value="{{ request('end_date') }}"
                       class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-emerald-500">
            </div>

            <!-- Buttons -->
            <div class="sm:col-span-2 lg:col-span-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                @if(request()->anyFilled(['search', 'type', 'category_id', 'start_date', 'end_date']))
                <a href="{{ route('transactions.index') }}" class="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs hover:text-white">
                    Filtrni tozalash
                </a>
                @endif
                <button type="submit" class="px-4 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30">
                    Filtrlash
                </button>
            </div>
        </form>
    </div>

    <!-- Datalist for autocomplete -->
    <datalist id="all_categories_list">
        @foreach($categories as $cat)
            <option value="{{ $cat->name }}"></option>
        @endforeach
    </datalist>

    <!-- Transactions Data Table -->
    <div class="glass-card rounded-3xl overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
                <thead class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/60">
                    <tr>
                        <th class="py-3.5 px-4">Kategoriya</th>
                        <th class="py-3.5 px-4">Turi</th>
                        <th class="py-3.5 px-4">Sana</th>
                        <th class="py-3.5 px-4">Tavsif</th>
                        <th class="py-3.5 px-4 text-right">Summa</th>
                        <th class="py-3.5 px-4 text-center">Amallar</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                    @forelse($transactions as $tx)
                    <tr class="hover:bg-slate-800/40 transition-colors">
                        <td class="py-3.5 px-4 font-semibold text-white">
                            <div class="flex items-center gap-2.5">
                                <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: {{ $tx->category->color ?? '#6B7280' }}"></span>
                                <span>{{ $tx->category->name ?? 'Noma\'lum' }}</span>
                            </div>
                        </td>
                        <td class="py-3.5 px-4">
                            @if($tx->type === 'income')
                                <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">Daromad</span>
                            @else
                                <span class="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">Xarajat</span>
                            @endif
                        </td>
                        <td class="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                            {{ $tx->transaction_date->format('Y-m-d') }}
                        </td>
                        <td class="py-3.5 px-4 text-xs text-slate-300 max-w-xs truncate">
                            {{ $tx->description ?? '-' }}
                        </td>
                        <td class="py-3.5 px-4 text-right font-extrabold text-sm {{ $tx->type === 'income' ? 'text-emerald-400' : 'text-rose-400' }} whitespace-nowrap">
                            {{ $tx->type === 'income' ? '+' : '-' }}{{ number_format($tx->amount, 0, ' ', ' ') }} UZS
                        </td>
                        <td class="py-3.5 px-4 text-center">
                            <div class="flex items-center justify-center gap-2">
                                <button @click="editTx = { id: {{ $tx->id }}, category_name: '{{ addslashes($tx->category->name ?? '') }}', type: '{{ $tx->type }}', amount: {{ $tx->amount }}, description: '{{ addslashes($tx->description) }}', transaction_date: '{{ $tx->transaction_date->format('Y-m-d') }}' }; editModalOpen = true" 
                                        class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>

                                <form method="POST" action="{{ route('transactions.destroy', $tx->id) }}" onsubmit="return confirm('Haqiqatan ham ushbu tranzaksiyani o\'chirmoqchimisiz?')">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="py-12 text-center text-slate-500 text-sm">
                            Hech qanday tranzaksiya topilmadi.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- Pagination links -->
        <div class="p-4 border-t border-slate-800">
            {{ $transactions->links() }}
        </div>
    </div>

    <!-- Create Transaction Modal -->
    <div x-show="createModalOpen" class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" @click="createModalOpen = false"></div>
            <div class="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white">Yangi Tranzaksiya Qo'shish</h3>
                    <button @click="createModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form action="{{ route('transactions.store') }}" method="POST" class="mt-4 space-y-4">
                    @csrf
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Turi</label>
                        <select name="type" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                            <option value="expense">Xarajat</option>
                            <option value="income">Daromad</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Kategoriya (o'zingiz yozing yoki tanlang)</label>
                        <input type="text" name="category_name" list="all_categories_list" required placeholder="Masalan: Oziq-ovqat, Taksi..." class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Summa (UZS)</label>
                        <input type="number" step="0.01" name="amount" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Sana</label>
                        <input type="date" name="transaction_date" value="{{ date('Y-m-d') }}" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Izoh</label>
                        <input type="text" name="description" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="createModalOpen = false" class="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">Bekor qilish</button>
                        <button type="submit" class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">Saqlash</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Transaction Modal -->
    <div x-show="editModalOpen" class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" @click="editModalOpen = false"></div>
            <div class="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white">Tranzaksiyani Tahrirlash</h3>
                    <button @click="editModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form :action="'/transactions/' + editTx.id" method="POST" class="mt-4 space-y-4">
                    @csrf
                    @method('PUT')
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Turi</label>
                        <select name="type" x-model="editTx.type" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                            <option value="expense">Xarajat</option>
                            <option value="income">Daromad</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Kategoriya (o'zingiz yozing yoki tanlang)</label>
                        <input type="text" name="category_name" x-model="editTx.category_name" list="all_categories_list" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:border-emerald-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Summa (UZS)</label>
                        <input type="number" step="0.01" name="amount" x-model="editTx.amount" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Sana</label>
                        <input type="date" name="transaction_date" x-model="editTx.transaction_date" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Izoh</label>
                        <input type="text" name="description" x-model="editTx.description" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
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
