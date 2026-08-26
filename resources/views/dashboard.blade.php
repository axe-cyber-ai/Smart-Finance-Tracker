@extends('layouts.app')

@section('title', 'Bosh sahifa - Dashboard')

@section('content')
<div class="space-y-8">
    
    <!-- Top Welcome Banner -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-slate-800">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="space-y-1 relative z-10">
            <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-widest text-emerald-400">Xush Kelibsiz</span>
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Salom, {{ auth()->user()->name }}! 👋</h2>
            <p class="text-sm text-slate-400">Joriy oy uchun moliyaviy ko'rsatkichlaringiz va byudjet tahlilingiz.</p>
        </div>
        <div class="flex items-center gap-3 relative z-10">
            <a href="{{ route('ai-assistant.index', ['analyze' => 1]) }}" 
               class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-purple-600/20 hover:from-purple-500 hover:to-indigo-500 transition-all">
                <span>🤖 AI Tahlil Olish</span>
            </a>
        </div>
    </div>

    <!-- Budget Dynamic Alert Banner (80% and 100% threshold limits) -->
    @if($budgetStatus['overall']['status'] === 'critical')
        <div class="p-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-4 shadow-lg shadow-rose-500/5">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                ⚠️
            </div>
            <div class="space-y-1 flex-1">
                <h4 class="text-sm font-bold text-rose-300 uppercase tracking-wide">Qizil Ogohlantirish: Byudjet Limitidan Oshib Ketdi!</h4>
                <p class="text-xs text-rose-200/80">
                    Joriy oy uchun ajratilgan <strong>{{ number_format($budgetStatus['overall']['budgeted'], 0, ' ', ' ') }} so'm</strong> umumiy byudjet sarflab bo'lindi. Hozirgacha jami <strong>{{ number_format($budgetStatus['overall']['spent'], 0, ' ', ' ') }} so'm</strong> ({{ $budgetStatus['overall']['percentage'] }}%) xarajat qilindi.
                </p>
            </div>
            <a href="{{ route('budgets.index') }}" class="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/30 whitespace-nowrap">
                Byudjetni ko'rish
            </a>
        </div>
    @elseif($budgetStatus['overall']['status'] === 'warning')
        <div class="p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-4 shadow-lg shadow-amber-500/5">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 font-bold text-xl">
                ⚡
            </div>
            <div class="space-y-1 flex-1">
                <h4 class="text-sm font-bold text-amber-300 uppercase tracking-wide">Sariq Ogohlantirish: Byudjet 80% dan Otdi</h4>
                <p class="text-xs text-amber-200/80">
                    Joriy oy uchun umumiy byudjetning <strong>{{ $budgetStatus['overall']['percentage'] }}%</strong> qismi sarflandi. Qolgan mablag': <strong>{{ number_format($budgetStatus['overall']['remaining'], 0, ' ', ' ') }} so'm</strong>.
                </p>
            </div>
            <a href="{{ route('budgets.index') }}" class="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 whitespace-nowrap">
                Byudjetni ko'rish
            </a>
        </div>
    @endif

    <!-- 4 KPI Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- KPI 1: Total Balance -->
        <div class="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Sof Balans</span>
                <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    💳
                </div>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {{ number_format($totalBalance, 0, ' ', ' ') }} <span class="text-xs font-semibold text-slate-400">UZS</span>
                </p>
                <p class="text-[11px] text-slate-400 mt-1">Barcha vaqtlardagi umumiy balans</p>
            </div>
        </div>

        <!-- KPI 2: Monthly Income -->
        <div class="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Oylik Daromad</span>
                <div class="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
                    📈
                </div>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-teal-400 tracking-tight">
                    +{{ number_format($monthlyIncome, 0, ' ', ' ') }} <span class="text-xs font-semibold text-slate-400">UZS</span>
                </p>
                <p class="text-[11px] text-slate-400 mt-1">Joriy oy uchun tushumlar</p>
            </div>
        </div>

        <!-- KPI 3: Monthly Expense -->
        <div class="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Oylik Xarajat</span>
                <div class="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    📉
                </div>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-rose-400 tracking-tight">
                    -{{ number_format($monthlyExpense, 0, ' ', ' ') }} <span class="text-xs font-semibold text-slate-400">UZS</span>
                </p>
                <p class="text-[11px] text-slate-400 mt-1">Joriy oy uchun xarajatlar</p>
            </div>
        </div>

        <!-- KPI 4: Remaining Budget -->
        <div class="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
            <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Qolgan Byudjet</span>
                <div class="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    🎯
                </div>
            </div>
            <div>
                <p class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {{ number_format($remainingBudget, 0, ' ', ' ') }} <span class="text-xs font-semibold text-slate-400">UZS</span>
                </p>
                <p class="text-[11px] text-slate-400 mt-1">Joriy oy rejasidan qolgan limit</p>
            </div>
        </div>

    </div>

    <!-- Charts Section: Doughnut + Bar Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Chart 1: Expense Breakdown by Category (Doughnut) -->
        <div class="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h3 class="text-base font-bold text-white">Xarajatlar Strukturasi</h3>
                    <p class="text-xs text-slate-400">Joriy oy kategoriyalar kesimida</p>
                </div>
                <span class="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">Doughnut</span>
            </div>

            <div class="h-64 flex items-center justify-center relative">
                @if(count($categoryBreakdown['categories']) > 0)
                    <canvas id="categoryChart"></canvas>
                @else
                    <div class="text-center text-slate-500 text-sm">
                        Ushbu oyda hali xarajatlar mavjud emas
                    </div>
                @endif
            </div>

            <!-- Legend breakdown list -->
            <div class="space-y-2 pt-2 border-t border-slate-800/80 max-h-40 overflow-y-auto pr-1">
                @foreach($categoryBreakdown['categories'] as $cat)
                <div class="flex items-center justify-between text-xs">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: {{ $cat['color'] }}"></span>
                        <span class="text-slate-300 font-medium">{{ $cat['category_name'] }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="font-bold text-white">{{ number_format($cat['amount'], 0, ' ', ' ') }} so'm</span>
                        <span class="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{{ $cat['percentage'] }}%</span>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <!-- Chart 2: Income vs Expense 6-Month Comparison (Bar Chart) -->
        <div class="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                    <h3 class="text-base font-bold text-white">Daromad vs Xarajat (Oxirgi 6 oy)</h3>
                    <p class="text-xs text-slate-400">Oylar bo'yicha dinamika va taqqoslash</p>
                </div>
                <span class="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20">Bar Chart</span>
            </div>

            <div class="h-80 relative">
                <canvas id="monthlyChart"></canvas>
            </div>
        </div>

    </div>

    <!-- Latest Transactions Table (5 entries) -->
    <div class="glass-card p-6 rounded-3xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
                <h3 class="text-base font-bold text-white">So'nggi Tranzaksiyalar</h3>
                <p class="text-xs text-slate-400">Oxirgi 5 ta kiritilgan daromad va xarajat yozuvi</p>
            </div>
            <a href="{{ route('transactions.index') }}" class="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                <span>Barchasini ko'rish</span>
                <span>&rarr;</span>
            </a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-300">
                <thead class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 bg-slate-900/50">
                    <tr>
                        <th class="py-3 px-4">Kategoriya</th>
                        <th class="py-3 px-4">Turi</th>
                        <th class="py-3 px-4">Sana</th>
                        <th class="py-3 px-4">Tavsif</th>
                        <th class="py-3 px-4 text-right">Summa</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                    @forelse($latestTransactions as $tx)
                    <tr class="hover:bg-slate-800/40 transition-colors">
                        <td class="py-3.5 px-4 font-semibold text-white">
                            <div class="flex items-center gap-2.5">
                                <span class="w-3 h-3 rounded-full" style="background-color: {{ $tx->category->color ?? '#6B7280' }}"></span>
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
                        <td class="py-3.5 px-4 text-xs text-slate-400">
                            {{ $tx->transaction_date->format('d.m.Y') }}
                        </td>
                        <td class="py-3.5 px-4 text-slate-300 text-xs max-w-xs truncate">
                            {{ $tx->description ?? '-' }}
                        </td>
                        <td class="py-3.5 px-4 text-right font-extrabold text-sm {{ $tx->type === 'income' ? 'text-emerald-400' : 'text-rose-400' }}">
                            {{ $tx->type === 'income' ? '+' : '-' }}{{ number_format($tx->amount, 0, ' ', ' ') }} UZS
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="py-8 text-center text-slate-500 text-sm">
                            Tranzaksiyalar yozuvi topilmadi.
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

</div>

<!-- Chart.js Scripts Initialization -->
<script>
    document.addEventListener('DOMContentLoaded', function () {
        
        // 1. Category Doughnut Chart
        const catCanvas = document.getElementById('categoryChart');
        if (catCanvas) {
            const catData = @json($categoryBreakdown['categories']);
            new Chart(catCanvas, {
                type: 'doughnut',
                data: {
                    labels: catData.map(c => c.category_name),
                    datasets: [{
                        data: catData.map(c => c.amount),
                        backgroundColor: catData.map(c => c.color),
                        borderWidth: 2,
                        borderColor: '#0f172a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    cutout: '70%'
                }
            });
        }

        // 2. Monthly Income vs Expense Bar Chart
        const monthlyCanvas = document.getElementById('monthlyChart');
        if (monthlyCanvas) {
            const monthlyData = @json($monthlyOverview);
            new Chart(monthlyCanvas, {
                type: 'bar',
                data: {
                    labels: monthlyData.labels,
                    datasets: [
                        {
                            label: 'Daromad (UZS)',
                            data: monthlyData.income,
                            backgroundColor: '#10B981',
                            borderRadius: 6
                        },
                        {
                            label: 'Xarajat (UZS)',
                            data: monthlyData.expense,
                            backgroundColor: '#EF4444',
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 12 } }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        },
                        y: {
                            ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } },
                            grid: { color: 'rgba(255,255,255,0.05)' }
                        }
                    }
                }
            });
        }

    });
</script>
@endsection
