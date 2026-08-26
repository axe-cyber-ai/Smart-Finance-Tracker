@extends('layouts.app')

@section('title', 'Byudjet Rejalashtirish')

@section('content')
<div class="space-y-8" x-data="{ createModalOpen: false, editModalOpen: false, editBudget: {} }">
    
    <!-- Top Action Bar & Month Selector -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-extrabold text-white">Byudjet Rejalashtirish</h2>
            <p class="text-xs text-slate-400">Oylik xarajatlar limitini belgilang va sarflarni nazorat qiling</p>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <!-- Month/Year Filter Form -->
            <form method="GET" action="{{ route('budgets.index') }}" class="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                <select name="month" onchange="this.form.submit()" class="bg-transparent text-slate-200 text-xs font-bold px-3 py-1.5 focus:outline-none">
                    @foreach(range(1, 12) as $m)
                        <option value="{{ $m }}" {{ $month == $m ? 'selected' : '' }} class="bg-slate-900">
                            {{ [1=>'Yanvar',2=>'Fevral',3=>'Mart',4=>'Aprel',5=>'May',6=>'Iyun',7=>'Iyul',8=>'Avgust',9=>'Sentabr',10=>'Oktabr',11=>'Noyabr',12=>'Dekabr'][$m] }}
                        </option>
                    @endforeach
                </select>
                <select name="year" onchange="this.form.submit()" class="bg-transparent text-slate-200 text-xs font-bold px-3 py-1.5 focus:outline-none border-l border-slate-800">
                    @foreach(range(date('Y')-1, date('Y')+2) as $y)
                        <option value="{{ $y }}" {{ $year == $y ? 'selected' : '' }} class="bg-slate-900">{{ $y }}</option>
                    @endforeach
                </select>
            </form>

            <button @click="createModalOpen = true" 
                    class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Yangi Byudjet</span>
            </button>
        </div>
    </div>

    <!-- Overall Monthly Budget Overview Card -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl space-y-4 relative overflow-hidden border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
                <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">Umumiy Oylik Byudjet</span>
                <h3 class="text-2xl font-extrabold text-white">
                    {{ $budgetStatus['overall']['has_budget'] ? number_format($budgetStatus['overall']['budgeted'], 0, ' ', ' ') . ' UZS' : 'Belgilanmagan' }}
                </h3>
            </div>
            
            <div class="flex items-center gap-3">
                @if($budgetStatus['overall']['has_budget'])
                    <button @click="editBudget = { id: {{ $budgetStatus['overall']['id'] }}, category_id: '', amount: {{ $budgetStatus['overall']['budgeted'] }}, month: {{ $month }}, year: {{ $year }} }; editModalOpen = true"
                            class="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800">
                        Tahrirlash
                    </button>
                @endif
                <div class="px-3 py-1.5 rounded-full text-xs font-bold border 
                    {{ $budgetStatus['overall']['status'] === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : ($budgetStatus['overall']['status'] === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30') }}">
                    Status: {{ strtoupper($budgetStatus['overall']['status']) }} ({{ $budgetStatus['overall']['percentage'] }}%)
                </div>
            </div>
        </div>

        @if($budgetStatus['overall']['has_budget'])
        <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-400">Sarflandi: <span class="text-white">{{ number_format($budgetStatus['overall']['spent'], 0, ' ', ' ') }} so'm</span></span>
                <span class="text-slate-400">Qoldi: <span class="{{ $budgetStatus['overall']['remaining'] < 0 ? 'text-rose-400' : 'text-emerald-400' }}">{{ number_format($budgetStatus['overall']['remaining'], 0, ' ', ' ') }} so'm</span></span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div class="h-full rounded-full transition-all duration-500 
                    {{ $budgetStatus['overall']['status'] === 'critical' ? 'bg-rose-500' : ($budgetStatus['overall']['status'] === 'warning' ? 'bg-amber-400' : 'bg-emerald-500') }}"
                     style="width: {{ min(100, $budgetStatus['overall']['percentage']) }}%"></div>
            </div>
        </div>
        @else
        <div class="text-xs text-slate-400 py-2">
            Ushbu oy uchun umumiy byudjet kiritilmagan. Yuqoridagi "+ Yangi Byudjet" tugmasi orqali umumiy oylik limit belgiling.
        </div>
        @endif
    </div>

    <!-- Category Budgets Grid -->
    <div class="space-y-4">
        <h3 class="text-lg font-bold text-white">Kategoriyalar Kesimidagi Byudjetlar</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @forelse($budgetStatus['categories'] as $b)
            <div class="glass-card p-6 rounded-3xl space-y-4 relative border-slate-800 glass-card-hover">
                
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-3">
                        <span class="w-4 h-4 rounded-full" style="background-color: {{ $b['color'] }}"></span>
                        <h4 class="font-bold text-white text-base">{{ $b['category_name'] }}</h4>
                    </div>

                    <div class="flex items-center gap-1">
                        <button @click="editBudget = { id: {{ $b['id'] }}, category_id: {{ $b['category_id'] }}, amount: {{ $b['budgeted'] }}, month: {{ $month }}, year: {{ $year }} }; editModalOpen = true"
                                class="p-1 text-slate-400 hover:text-emerald-400">
                            ✏️
                        </button>
                        <form method="POST" action="{{ route('budgets.destroy', $b['id']) }}" onsubmit="return confirm('Ushbu byudjetni o\'chirmoqchimisiz?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="p-1 text-slate-400 hover:text-rose-400">🗑️</button>
                        </form>
                    </div>
                </div>

                <div class="space-y-1">
                    <p class="text-xs text-slate-400">Byudjet limiti:</p>
                    <p class="text-xl font-extrabold text-white">{{ number_format($b['budgeted'], 0, ' ', ' ') }} UZS</p>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-800/60">
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-slate-400">Sarflandi: <strong class="text-white">{{ number_format($b['spent'], 0, ' ', ' ') }} UZS</strong></span>
                        <span class="font-bold px-2 py-0.5 rounded-full text-[10px] 
                            {{ $b['status'] === 'critical' ? 'bg-rose-500/20 text-rose-300' : ($b['status'] === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300') }}">
                            {{ $b['percentage'] }}%
                        </span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500 
                            {{ $b['status'] === 'critical' ? 'bg-rose-500' : ($b['status'] === 'warning' ? 'bg-amber-400' : 'bg-emerald-500') }}"
                             style="width: {{ min(100, $b['percentage']) }}%"></div>
                    </div>

                    <div class="text-[11px] text-right font-medium {{ $b['remaining'] < 0 ? 'text-rose-400' : 'text-slate-400' }}">
                        Qolgan mablag': {{ number_format($b['remaining'], 0, ' ', ' ') }} UZS
                    </div>
                </div>

            </div>
            @empty
            <div class="col-span-full py-12 glass-card rounded-3xl text-center text-slate-500 text-sm">
                Ushbu oy uchun kiritilgan kategoriya byudjetlari mavjud emas.
            </div>
            @endforelse
        </div>
    </div>

    <!-- Create Budget Modal -->
    <div x-show="createModalOpen" class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" @click="createModalOpen = false"></div>
            <div class="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white">Yangi Byudjet Oynasi</h3>
                    <button @click="createModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form action="{{ route('budgets.store') }}" method="POST" class="mt-4 space-y-4">
                    @csrf
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Kategoriya (bo'sh bo'lsa - Umumiy Byudjet)</label>
                        <select name="category_id" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                            <option value="">--- Umumiy Oylik Byudjet ---</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Byudjet Summasi (UZS)</label>
                        <input type="number" step="0.01" name="amount" required placeholder="Masalan: 3000000" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Oy</label>
                            <select name="month" class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                                @foreach(range(1, 12) as $m)
                                    <option value="{{ $m }}" {{ $month == $m ? 'selected' : '' }}>Oy {{ $m }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-300 mb-1">Yil</label>
                            <input type="number" name="year" value="{{ $year }}" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
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

    <!-- Edit Budget Modal -->
    <div x-show="editModalOpen" class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
        <div class="flex min-h-screen items-center justify-center p-4">
            <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" @click="editModalOpen = false"></div>
            <div class="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white">Byudjetni Tahrirlash</h3>
                    <button @click="editModalOpen = false" class="text-slate-400 hover:text-white">✕</button>
                </div>
                <form :action="'/budgets/' + editBudget.id" method="POST" class="mt-4 space-y-4">
                    @csrf
                    @method('PUT')
                    <div>
                        <label class="block text-xs font-bold text-slate-300 mb-1">Byudjet Summasi (UZS)</label>
                        <input type="number" step="0.01" name="amount" x-model="editBudget.amount" required class="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white">
                    </div>
                    <input type="hidden" name="category_id" :value="editBudget.category_id">
                    <input type="hidden" name="month" :value="editBudget.month">
                    <input type="hidden" name="year" :value="editBudget.year">

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
