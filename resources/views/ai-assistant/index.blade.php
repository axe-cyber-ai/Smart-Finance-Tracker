@extends('layouts.app')

@section('title', 'Smart Finance AI')

@section('content')
<div class="space-y-8">
    
    <!-- Header Banner -->
    <div class="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="space-y-2 relative z-10">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                ✨ Sun'iy Intellekt Maslahatchisi
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white">Smart Finance AI Tahlilchisi</h2>
            <p class="text-xs sm:text-sm text-slate-400 max-w-xl">
                So'nggi 30–60 kunlik moliyaviy yozuvlaringizni chuqur tahlil qiling, anomaliyalarni aniqlang va shaxsiy tejash strategiyasini oling.
            </p>
        </div>

        <div class="relative z-10 w-full md:w-auto">
            <a href="{{ route('ai-assistant.index', ['analyze' => 1]) }}" 
               class="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95 w-full">
                <span>🤖 Moliya Tahlilini Olish</span>
            </a>
        </div>
    </div>

    @if(is_null($analysis))
        <!-- Empty State Prompt -->
        <div class="glass-card p-12 rounded-3xl text-center space-y-4 max-w-2xl mx-auto border-slate-800">
            <div class="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-3xl font-bold border border-purple-500/20">
                💡
            </div>
            <div class="space-y-1">
                <h3 class="text-lg font-bold text-white">Moliyaviy Tahlil Tayyor Emas</h3>
                <p class="text-xs text-slate-400">
                    Tahlilni boshlash uchun yuqoridagi <strong>"Moliya Tahlilini Olish"</strong> tugmasini bosing. AI tizimi daromad, xarajat hamda byudjetlaringizni o'rganib chiqadi.
                </p>
            </div>
        </div>
    @else
        <!-- Analysis Results Dashboard -->
        <div class="space-y-8">
            
            <!-- 3 Top Metric Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <!-- Card 1: Overall Financial Score -->
                <div class="glass-card p-6 rounded-3xl space-y-4 border-slate-800 flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Umumiy Moliyaviy Ball</span>
                        <span class="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">0 - 100</span>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="text-4xl font-black text-purple-400 tracking-tight">
                            {{ $analysis['financial_score'] }}<span class="text-sm text-slate-500 font-normal">/100</span>
                        </div>
                        <div class="flex-1">
                            <div class="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-700" 
                                     style="width: {{ $analysis['financial_score'] }}%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <p class="text-[11px] text-slate-400">
                        @if($analysis['financial_score'] >= 80)
                            🟢 A'lo! Moliyaviy intizomingiz va tejash darajangiz yuqori.
                        @elseif($analysis['financial_score'] >= 60)
                            🟡 Qoniqarli. Xarajatlarni yanada optimallashtirish imkoniyati bor.
                        @else
                            🔴 Ogohlantirish! Xarajatlar daromaddan oshib ketish xavfi mavjud.
                        @endif
                    </p>
                </div>

                <!-- Card 2: Detected Anomalies -->
                <div class="glass-card p-6 rounded-3xl space-y-3 border-slate-800">
                    <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Aniqlangan Anomaliyalar</span>
                        <span class="text-xs text-rose-400 font-bold">⚠️ {{ count($analysis['anomalies']) }} ta holat</span>
                    </div>

                    <ul class="space-y-2 max-h-32 overflow-y-auto pr-1">
                        @foreach($analysis['anomalies'] as $anomaly)
                        <li class="text-xs text-slate-300 flex items-start gap-2">
                            <span class="text-amber-400 font-bold">•</span>
                            <span>{{ $anomaly }}</span>
                        </li>
                        @endforeach
                    </ul>
                </div>

                <!-- Card 3: Best Saving Advice -->
                <div class="glass-card p-6 rounded-3xl space-y-3 border-emerald-500/20 bg-emerald-500/5">
                    <div class="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                        <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Eng Yaxshi Tejash Maslahati</span>
                        <span class="text-xs">💡</span>
                    </div>

                    <p class="text-xs font-medium text-slate-200 leading-relaxed">
                        {{ $analysis['savings_tip'] }}
                    </p>
                </div>

            </div>

            <!-- Formatted Markdown Report Document -->
            <div class="glass-card p-8 rounded-3xl space-y-4 border-slate-800">
                <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 class="text-lg font-bold text-white flex items-center gap-2">
                        <span>📝 Shaxsiy Moliyaviy Hisobot</span>
                    </h3>
                    <span class="text-xs text-slate-400 font-mono">Markdown Format</span>
                </div>

                <!-- Markdown Content Render -->
                <div class="prose prose-invert prose-emerald max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {!! nl2br(e($analysis['markdown_report'])) !!}
                </div>
            </div>

        </div>
    @endif

</div>
@endsection
