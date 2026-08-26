@extends('layouts.app')

@section('title', 'Hisobotlar va Tahlil')

@section('content')
<div class="space-y-8">
    
    <!-- Top Action Bar & Date Range Form -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-extrabold text-white">Moliyaviy Hisobotlar</h2>
            <p class="text-xs text-slate-400">Tanlangan sana oralig'i bo'yicha batafsil daromad va xarajat statistikasi</p>
        </div>

        <form method="GET" action="{{ route('reports.index') }}" class="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl w-full md:w-auto">
            <div>
                <input type="date" name="start_date" value="{{ $startDate }}" 
                       class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
            </div>
            <span class="text-xs text-slate-500 font-bold">—</span>
            <div>
                <input type="date" name="end_date" value="{{ $endDate }}" 
                       class="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none">
            </div>
            <button type="submit" class="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400">
                Hisobotni Olish
            </button>
        </form>
    </div>

    <!-- Summary KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="glass-card p-5 rounded-3xl space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Daromad</span>
            <p class="text-2xl font-extrabold text-teal-400">+{{ number_format($totalIncome, 0, ' ', ' ') }} UZS</p>
            <p class="text-[11px] text-slate-500">Tanlangan oraliq bo'yicha</p>
        </div>

        <div class="glass-card p-5 rounded-3xl space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Xarajat</span>
            <p class="text-2xl font-extrabold text-rose-400">-{{ number_format($totalExpense, 0, ' ', ' ') }} UZS</p>
            <p class="text-[11px] text-slate-500">Tanlangan oraliq bo'yicha</p>
        </div>

        <div class="glass-card p-5 rounded-3xl space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Sof Jamg'arma</span>
            <p class="text-2xl font-extrabold {{ $netSavings >= 0 ? 'text-emerald-400' : 'text-rose-400' }}">
                {{ number_format($netSavings, 0, ' ', ' ') }} UZS
            </p>
            <p class="text-[11px] text-slate-500">Daromad minus Xarajat</p>
        </div>

        <div class="glass-card p-5 rounded-3xl space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">O'rtacha Tranzaksiya</span>
            <p class="text-2xl font-extrabold text-white">{{ number_format($avgTransaction, 0, ' ', ' ') }} UZS</p>
            <p class="text-[11px] text-slate-500">Jami {{ $transactionCount }} ta yozuvdan</p>
        </div>
    </div>

    <!-- Expense Breakdown Table & Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Table -->
        <div class="lg:col-span-7 glass-card p-6 rounded-3xl space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 class="text-base font-bold text-white">Xarajatlar Kategoriyasi Bo'yicha</h3>
                <span class="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">Xarajatlar</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm text-slate-300">
                    <thead class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <tr>
                            <th class="py-2.5 px-3">Kategoriya</th>
                            <th class="py-2.5 px-3 text-center">Yozuvlar</th>
                            <th class="py-2.5 px-3 text-right">Summa</th>
                            <th class="py-2.5 px-3 text-right">Ulesh (%)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-800/60 text-xs">
                        @forelse($expenseCategoryBreakdown as $row)
                        <tr class="hover:bg-slate-800/40">
                            <td class="py-3 px-3 font-semibold text-white">
                                <div class="flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full" style="background-color: {{ $row['color'] }}"></span>
                                    <span>{{ $row['name'] }}</span>
                                </div>
                            </td>
                            <td class="py-3 px-3 text-center text-slate-400">{{ $row['count'] }} ta</td>
                            <td class="py-3 px-3 text-right font-bold text-white">{{ number_format($row['amount'], 0, ' ', ' ') }} UZS</td>
                            <td class="py-3 px-3 text-right font-bold text-emerald-400">{{ $row['percentage'] }}%</td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="py-6 text-center text-slate-500">Mavjud emas</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Chart -->
        <div class="lg:col-span-5 glass-card p-6 rounded-3xl space-y-4">
            <div class="border-b border-slate-800 pb-3">
                <h3 class="text-base font-bold text-white">Grafik Vizualizatsiya</h3>
                <p class="text-xs text-slate-400">Xarajatlar taqsimoti</p>
            </div>
            <div class="h-64 flex items-center justify-center">
                <canvas id="reportExpenseChart"></canvas>
            </div>
        </div>

    </div>

</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const canvas = document.getElementById('reportExpenseChart');
        if (canvas) {
            const data = @json($expenseCategoryBreakdown);
            new Chart(canvas, {
                type: 'pie',
                data: {
                    labels: data.map(d => d.name),
                    datasets: [{
                        data: data.map(d => d.amount),
                        backgroundColor: data.map(d => d.color),
                        borderWidth: 2,
                        borderColor: '#0f172a'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
                        }
                    }
                }
            });
        }
    });
</script>
@endsection
