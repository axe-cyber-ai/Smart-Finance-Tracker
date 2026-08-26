<div x-show="quickAddOpen" 
     x-transition:enter="transition ease-out duration-200"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition ease-in duration-150"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     class="fixed inset-0 z-50 overflow-y-auto" x-cloak>
    
    <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" @click="quickAddOpen = false"></div>

        <!-- Modal Box -->
        <div class="relative transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 px-6 pt-6 pb-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            
            <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        ⚡
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-white">Tezkor Tranzaksiya Qo'shish</h3>
                        <p class="text-xs text-slate-400">Daromad yoki xarajat yozuvini kiritish</p>
                    </div>
                </div>
                <button @click="quickAddOpen = false" class="text-slate-400 hover:text-white p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <form action="{{ route('transactions.store') }}" method="POST" class="mt-6 space-y-4">
                @csrf

                <!-- Type Selector -->
                <div>
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tranzaksiya Turi</label>
                    <div class="grid grid-cols-2 gap-3" x-data="{ type: 'expense' }">
                        <label :class="type === 'expense' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-slate-800/50 border-slate-700/60 text-slate-400'"
                               class="flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm cursor-pointer transition-all">
                            <input type="radio" name="type" value="expense" x-model="type" class="hidden">
                            <span>💸 Xarajat</span>
                        </label>
                        <label :class="type === 'income' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-800/50 border-slate-700/60 text-slate-400'"
                               class="flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm cursor-pointer transition-all">
                            <input type="radio" name="type" value="income" x-model="type" class="hidden">
                            <span>💰 Daromad</span>
                        </label>
                    </div>
                </div>

                <!-- Category Input (Direct Typing + Autocomplete Datalist) -->
                <div>
                    <label for="quick_category_name" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Kategoriya <span class="text-[10px] text-emerald-400 font-normal lowercase">(o'zingiz yozing yoki tanlang)</span>
                    </label>
                    <input type="text" 
                           id="quick_category_name" 
                           name="category_name" 
                           list="quick_category_list"
                           placeholder="Kategoriya nomini yozing (Masalan: Oziq-ovqat, Taksi)..." 
                           required 
                           autocomplete="off"
                           class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                    <datalist id="quick_category_list">
                        @if(isset($categories))
                            @foreach($categories as $category)
                                <option value="{{ $category->name }}"></option>
                            @endforeach
                        @endif
                    </datalist>
                </div>

                <!-- Amount -->
                <div>
                    <label for="quick_amount" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Summa (UZS)</label>
                    <div class="relative">
                        <input type="number" step="0.01" id="quick_amount" name="amount" placeholder="Masalan: 150000" required
                               class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 font-semibold">
                        <span class="absolute right-4 top-3.5 text-xs text-slate-400 font-bold">so'm</span>
                    </div>
                </div>

                <!-- Date -->
                <div>
                    <label for="quick_transaction_date" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Sana</label>
                    <input type="date" id="quick_transaction_date" name="transaction_date" value="{{ date('Y-m-d') }}" required
                           class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                </div>

                <!-- Description -->
                <div>
                    <label for="quick_description" class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Tavsif (ixtiyoriy)</label>
                    <input type="text" id="quick_description" name="description" placeholder="Batafsil izoh kiritishingiz mumkin..."
                           class="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:border-emerald-500">
                </div>

                <!-- Submit Button -->
                <div class="pt-4 flex justify-end gap-3 border-t border-slate-800">
                    <button type="button" @click="quickAddOpen = false"
                            class="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800">
                        Bekor qilish
                    </button>
                    <button type="submit"
                            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400">
                        Saqlash
                    </button>
                </div>
            </form>

        </div>
    </div>
</div>
