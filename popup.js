class ZerodhaCalculator {
    constructor() {
        this.storageKey = 'zerodha_calculator_data';
        this.themeKey = 'zerodha_calculator_theme';
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupMainTabs();
        this.setupSubTabs();
        this.setupCalculationFunctions();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupInputModeToggles();
        this.loadStoredData();
        this.calculateAll();
    }

    // Indian number formatting function
    formatIndianNumber(num) {
        if (isNaN(num) || num === 0) return '0';
        return Math.abs(num).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Theme functions
    loadTheme() {
        const savedTheme = localStorage.getItem(this.themeKey) || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeIcon(true);
        }
    }

    toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem(this.themeKey, isDarkMode ? 'dark' : 'light');
        this.updateThemeIcon(isDarkMode);
    }

    updateThemeIcon(isDarkMode) {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.textContent = isDarkMode ? '☀️' : '🌙';
        }
    }

    setupThemeToggle() {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }
    }

    // Input mode toggle setup
    setupInputModeToggles() {
        const prefixes = ['intra', 'del', 'fut', 'opt', 'curr_fut', 'curr_opt', 'comm_fut', 'comm_opt'];
        
        prefixes.forEach(prefix => {
            const modeRadios = document.querySelectorAll(`input[name="${prefix}_input_mode"]`);
            modeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.handleInputModeChange(prefix, radio.value);
                });
            });

            // Setup amount input listeners
            const amountInput = document.getElementById(`${prefix}_amount`);
            if (amountInput) {
                amountInput.addEventListener('input', () => {
                    this.handleAmountInput(prefix);
                });
            }
        });
    }

    handleInputModeChange(prefix, mode) {
        const qtyField = document.getElementById(`${prefix}_qty`);
        const amountField = document.getElementById(`${prefix}_amount_field`);
        const qtyLabel = document.getElementById(`${prefix}_qty_label`);

        if (mode === 'amount') {
            if (amountField) amountField.style.display = 'block';
            if (qtyLabel) qtyLabel.textContent = 'CALCULATED QTY';
            if (qtyField) qtyField.readOnly = true;
        } else {
            if (amountField) amountField.style.display = 'none';
            if (qtyLabel) qtyLabel.textContent = 'QUANTITY';
            if (qtyField) qtyField.readOnly = false;
        }
        
        this.recalculate(prefix);
    }

    handleAmountInput(prefix) {
        const amountInput = document.getElementById(`${prefix}_amount`);
        const qtyInput = document.getElementById(`${prefix}_qty`);
        const bpInput = document.getElementById(`${prefix}_bp`);
        
        if (!amountInput || !qtyInput || !bpInput) return;

        const amount = parseFloat(amountInput.value) || 0;
        const price = parseFloat(bpInput.value) || 1;
        
        if (price > 0) {
            const calculatedQty = Math.floor(amount / price);
            qtyInput.value = calculatedQty;
        }
        
        this.recalculate(prefix);
    }

    recalculate(prefix) {
        const calculationMap = {
            'intra': () => this.cal_intra(),
            'del': () => this.cal_delivery(),
            'fut': () => this.cal_futures(),
            'opt': () => this.cal_options(),
            'curr_fut': () => this.cal_curr_fut(),
            'curr_opt': () => this.cal_curr_opt(),
            'comm_fut': () => this.cal_comm_fut(),
            'comm_opt': () => this.cal_comm_opt()
        };

        if (calculationMap[prefix]) {
            calculationMap[prefix]();
        }
    }

    // Enhanced calculation functions with buy/sell values
    cal_intra() {
        const bp = parseFloat(document.getElementById('intra_bp').value) || 0;
        const sp = parseFloat(document.getElementById('intra_sp').value) || 0;
        const qty = parseFloat(document.getElementById('intra_qty').value) || 0;
        const exchange = document.querySelector('input[name="intra_exchange"]:checked')?.value || 'NSE';

        const buyValue = bp * qty;
        const sellValue = sp * qty;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, Math.max(0, (turnover * 0.03) / 100));
        const stt = (sellValue * 0.025) / 100;
        const exchangeCharge = exchange === 'NSE' ? (turnover * 0.00325) / 100 : (turnover * 0.00375) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const sebiCharges = (turnover * 0.0001) / 100;
        const stampDuty = (buyValue * 0.003) / 100;

        const totalCharges = brokerage + stt + exchangeCharge + gst + sebiCharges + stampDuty;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('intra', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            stt,
            etc: exchangeCharge,
            gst,
            sebi: sebiCharges,
            stamp: stampDuty,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_delivery() {
        const bp = parseFloat(document.getElementById('del_bp').value) || 0;
        const sp = parseFloat(document.getElementById('del_sp').value) || 0;
        const qty = parseFloat(document.getElementById('del_qty').value) || 0;
        const exchange = document.querySelector('input[name="del_exchange"]:checked')?.value || 'NSE';

        const buyValue = bp * qty;
        const sellValue = sp * qty;
        const turnover = buyValue + sellValue;

        const brokerage = 0; // Free for delivery
        const stt = (sellValue * 0.1) / 100;
        const exchangeCharge = exchange === 'NSE' ? (turnover * 0.00325) / 100 : (turnover * 0.00375) / 100;
        const gst = exchangeCharge * 0.18;
        const sebiCharges = (turnover * 0.0001) / 100;
        const stampDuty = (buyValue * 0.015) / 100;

        const totalCharges = brokerage + stt + exchangeCharge + gst + sebiCharges + stampDuty;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('del', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            stt,
            etc: exchangeCharge,
            gst,
            sebi: sebiCharges,
            stamp: stampDuty,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_futures() {
        const bp = parseFloat(document.getElementById('fut_bp').value) || 0;
        const sp = parseFloat(document.getElementById('fut_sp').value) || 0;
        const qty = parseFloat(document.getElementById('fut_qty').value) || 0;
        const exchange = document.querySelector('input[name="fut_exchange"]:checked')?.value || 'NSE';

        const buyValue = bp * qty;
        const sellValue = sp * qty;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, Math.max(0, (turnover * 0.03) / 100));
        const stt = (sellValue * 0.01) / 100;
        const exchangeCharge = exchange === 'NSE' ? (turnover * 0.0019) / 100 : (turnover * 0.0019) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const sebiCharges = (turnover * 0.0001) / 100;
        const stampDuty = (buyValue * 0.002) / 100;

        const totalCharges = brokerage + stt + exchangeCharge + gst + sebiCharges + stampDuty;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('fut', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            stt,
            etc: exchangeCharge,
            gst,
            sebi: sebiCharges,
            stamp: stampDuty,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_options() {
        const bp = parseFloat(document.getElementById('opt_bp').value) || 0;
        const sp = parseFloat(document.getElementById('opt_sp').value) || 0;
        const qty = parseFloat(document.getElementById('opt_qty').value) || 0;
        const exchange = document.querySelector('input[name="opt_exchange"]:checked')?.value || 'NSE';

        const buyValue = bp * qty;
        const sellValue = sp * qty;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, Math.max(0, (turnover * 0.03) / 100));
        const stt = (sellValue * 0.05) / 100;
        const exchangeCharge = exchange === 'NSE' ? (turnover * 0.035) / 100 : (turnover * 0.035) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const sebiCharges = (turnover * 0.0001) / 100;
        const stampDuty = (buyValue * 0.003) / 100;

        const totalCharges = brokerage + stt + exchangeCharge + gst + sebiCharges + stampDuty;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('opt', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            stt,
            etc: exchangeCharge,
            gst,
            sebi: sebiCharges,
            stamp: stampDuty,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_curr_fut() {
        const bp = parseFloat(document.getElementById('curr_fut_bp').value) || 0;
        const sp = parseFloat(document.getElementById('curr_fut_sp').value) || 0;
        const qty = parseFloat(document.getElementById('curr_fut_qty').value) || 0;
        const multiplier = 1000;

        const buyValue = bp * qty * multiplier;
        const sellValue = sp * qty * multiplier;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, (turnover * 0.03) / 100);
        const exchangeCharge = (turnover * 0.0004) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const sebiCharges = (turnover * 0.0001) / 100;

        const totalCharges = brokerage + exchangeCharge + gst + sebiCharges;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('curr_fut', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            etc: exchangeCharge,
            gst,
            sebi: sebiCharges,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_curr_opt() {
        const strike = parseFloat(document.getElementById('curr_opt_strike').value) || 0;
        const bp = parseFloat(document.getElementById('curr_opt_bp').value) || 0;
        const sp = parseFloat(document.getElementById('curr_opt_sp').value) || 0;
        const qty = parseFloat(document.getElementById('curr_opt_qty').value) || 0;
        const multiplier = 1000;

        const buyValue = bp * qty * multiplier;
        const sellValue = sp * qty * multiplier;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, (turnover * 0.03) / 100);
        const exchangeCharge = (turnover * 0.0035) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const sebiCharges = (turnover * 0.0001) / 100;

        const totalCharges = brokerage + exchangeCharge + gst + sebiCharges;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('curr_opt', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            etc: exchangeCharge,
            gst,
            sebi: sebiCharges,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_comm_fut() {
        const select = document.getElementById('comm_fut_select');
        const bp = parseFloat(document.getElementById('comm_fut_bp').value) || 0;
        const sp = parseFloat(document.getElementById('comm_fut_sp').value) || 0;
        const qty = parseFloat(document.getElementById('comm_fut_qty').value) || 0;
        const multiplier = parseInt(select?.selectedOptions[0]?.getAttribute('data-multiplier')) || 1;

        const buyValue = bp * qty * multiplier;
        const sellValue = sp * qty * multiplier;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, (turnover * 0.03) / 100);
        const exchangeCharge = (turnover * 0.0021) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const ctt = (turnover * 0.01) / 100;
        const sebiCharges = (turnover * 0.0001) / 100;
        const stampDuty = (buyValue * 0.002) / 100;

        const totalCharges = brokerage + exchangeCharge + gst + ctt + sebiCharges + stampDuty;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('comm_fut', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            etc: exchangeCharge,
            gst,
            ctt,
            sebi: sebiCharges,
            stamp: stampDuty,
            total: totalCharges,
            pnl: netPnL
        });
    }

    cal_comm_opt() {
        const select = document.getElementById('comm_opt_select');
        const strike = parseFloat(document.getElementById('comm_opt_strike').value) || 0;
        const bp = parseFloat(document.getElementById('comm_opt_bp').value) || 0;
        const sp = parseFloat(document.getElementById('comm_opt_sp').value) || 0;
        const qty = parseFloat(document.getElementById('comm_opt_qty').value) || 0;
        const multiplier = parseInt(select?.selectedOptions[0]?.getAttribute('data-multiplier')) || 1;

        const buyValue = bp * qty * multiplier;
        const sellValue = sp * qty * multiplier;
        const turnover = buyValue + sellValue;

        const brokerage = Math.min(40, (turnover * 0.03) / 100);
        const exchangeCharge = (turnover * 0.042) / 100;
        const gst = (brokerage + exchangeCharge) * 0.18;
        const ctt = (sellValue * 0.01) / 100;
        const sebiCharges = (turnover * 0.0001) / 100;
        const stampDuty = (buyValue * 0.003) / 100;

        const totalCharges = brokerage + exchangeCharge + gst + ctt + sebiCharges + stampDuty;
        const netPnL = (sellValue - buyValue) - totalCharges;

        this.updateResults('comm_opt', {
            buyValue,
            sellValue,
            turnover,
            brokerage,
            etc: exchangeCharge,
            gst,
            ctt,
            sebi: sebiCharges,
            stamp: stampDuty,
            total: totalCharges,
            pnl: netPnL
        });
    }

    // Enhanced updateResults with Indian formatting
    updateResults(prefix, values) {
        const elements = {
            buyValue: document.getElementById(`${prefix}_buy_value`),
            sellValue: document.getElementById(`${prefix}_sell_value`),
            turnover: document.getElementById(`${prefix}_turnover`),
            brokerage: document.getElementById(`${prefix}_brokerage`),
            stt: document.getElementById(`${prefix}_stt`),
            etc: document.getElementById(`${prefix}_etc`),
            gst: document.getElementById(`${prefix}_gst`),
            sebi: document.getElementById(`${prefix}_sebi`),
            stamp: document.getElementById(`${prefix}_stamp`),
            ctt: document.getElementById(`${prefix}_ctt`),
            total: document.getElementById(`${prefix}_total`),
            pnl: document.getElementById(`${prefix}_pnl`)
        };

        Object.keys(elements).forEach(key => {
            if (elements[key] && values[key] !== undefined) {
                const value = values[key];
                const formattedValue = this.formatIndianNumber(Math.abs(value));
                const sign = value < 0 ? '-' : '';
                elements[key].textContent = `₹${sign}${formattedValue}`;
                
                if (key === 'pnl') {
                    elements[key].classList.toggle('negative', value < 0);
                }
            }
        });
    }

    setupMainTabs() {
        const mainTabs = document.querySelectorAll('.main-tabs .tab');
        const tabContents = document.querySelectorAll('.tab-content');

        mainTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                mainTabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tab.dataset.tab).classList.add('active');
                
                this.saveData();
            });
        });
    }

    setupSubTabs() {
        const subTabs = document.querySelectorAll('.sub-tab');
        const subTabContents = document.querySelectorAll('.sub-tab-content');

        subTabs.forEach(subTab => {
            subTab.addEventListener('click', () => {
                const parentTab = subTab.closest('.tab-content');
                const parentSubTabs = parentTab.querySelectorAll('.sub-tab');
                const parentSubTabContents = parentTab.querySelectorAll('.sub-tab-content');

                parentSubTabs.forEach(st => st.classList.remove('active'));
                parentSubTabContents.forEach(stc => stc.classList.remove('active'));

                subTab.classList.add('active');
                const targetContent = document.getElementById(subTab.dataset.subtab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                this.saveData();
            });
        });
    }

    setupEventListeners() {
        const allInputs = document.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveData();
            });
            input.addEventListener('change', () => {
                this.saveData();
            });
        });

        // Add specific listeners for each calculation type
        const inputGroups = [
            { prefix: 'intra', calc: () => this.cal_intra() },
            { prefix: 'del', calc: () => this.cal_delivery() },
            { prefix: 'fut', calc: () => this.cal_futures() },
            { prefix: 'opt', calc: () => this.cal_options() },
            { prefix: 'curr_fut', calc: () => this.cal_curr_fut() },
            { prefix: 'curr_opt', calc: () => this.cal_curr_opt() },
            { prefix: 'comm_fut', calc: () => this.cal_comm_fut() },
            { prefix: 'comm_opt', calc: () => this.cal_comm_opt() }
        ];

        inputGroups.forEach(group => {
            const inputs = [`${group.prefix}_bp`, `${group.prefix}_sp`, `${group.prefix}_qty`];
            inputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', group.calc);
                }
            });

            // Add exchange radio button listeners where applicable
            if (['intra', 'del', 'fut', 'opt'].includes(group.prefix)) {
                const radios = document.querySelectorAll(`input[name="${group.prefix}_exchange"]`);
                radios.forEach(radio => {
                    radio.addEventListener('change', group.calc);
                });
            }
        });

        // Special listeners for commodity select dropdowns
        const commFutSelect = document.getElementById('comm_fut_select');
        if (commFutSelect) {
            commFutSelect.addEventListener('change', () => this.cal_comm_fut());
        }

        const commOptSelect = document.getElementById('comm_opt_select');
        if (commOptSelect) {
            commOptSelect.addEventListener('change', () => this.cal_comm_opt());
        }
    }

    setupCalculationFunctions() {
        window.cal_intra = () => this.cal_intra();
        window.cal_delivery = () => this.cal_delivery();
        window.cal_futures = () => this.cal_futures();
        window.cal_options = () => this.cal_options();
        window.cal_curr_fut = () => this.cal_curr_fut();
        window.cal_curr_opt = () => this.cal_curr_opt();
        window.cal_comm_fut = () => this.cal_comm_fut();
        window.cal_comm_opt = () => this.cal_comm_opt();
    }

    // Enhanced save data with theme and input modes
    saveData() {
        const data = {
            // Theme preference
            theme: localStorage.getItem(this.themeKey) || 'light',
            
            // Input mode preferences
            inputModes: {},
            
            // Equity data
            intraday: {
                bp: document.getElementById('intra_bp')?.value || '',
                sp: document.getElementById('intra_sp')?.value || '',
                qty: document.getElementById('intra_qty')?.value || '',
                exchange: document.querySelector('input[name="intra_exchange"]:checked')?.value || 'NSE'
            },
            delivery: {
                bp: document.getElementById('del_bp')?.value || '',
                sp: document.getElementById('del_sp')?.value || '',
                qty: document.getElementById('del_qty')?.value || '',
                exchange: document.querySelector('input[name="del_exchange"]:checked')?.value || 'NSE'
            },
            futures: {
                bp: document.getElementById('fut_bp')?.value || '',
                sp: document.getElementById('fut_sp')?.value || '',
                qty: document.getElementById('fut_qty')?.value || '',
                exchange: document.querySelector('input[name="fut_exchange"]:checked')?.value || 'NSE'
            },
            options: {
                bp: document.getElementById('opt_bp')?.value || '',
                sp: document.getElementById('opt_sp')?.value || '',
                qty: document.getElementById('opt_qty')?.value || '',
                exchange: document.querySelector('input[name="opt_exchange"]:checked')?.value || 'NSE'
            },
            // Currency data
            currencyFutures: {
                bp: document.getElementById('curr_fut_bp')?.value || '',
                sp: document.getElementById('curr_fut_sp')?.value || '',
                qty: document.getElementById('curr_fut_qty')?.value || ''
            },
            currencyOptions: {
                strike: document.getElementById('curr_opt_strike')?.value || '',
                bp: document.getElementById('curr_opt_bp')?.value || '',
                sp: document.getElementById('curr_opt_sp')?.value || '',
                qty: document.getElementById('curr_opt_qty')?.value || ''
            },
            // Commodity data
            commodityFutures: {
                commodity: document.getElementById('comm_fut_select')?.value || 'GOLD',
                bp: document.getElementById('comm_fut_bp')?.value || '',
                sp: document.getElementById('comm_fut_sp')?.value || '',
                qty: document.getElementById('comm_fut_qty')?.value || ''
            },
            commodityOptions: {
                commodity: document.getElementById('comm_opt_select')?.value || 'GOLD',
                strike: document.getElementById('comm_opt_strike')?.value || '',
                bp: document.getElementById('comm_opt_bp')?.value || '',
                sp: document.getElementById('comm_opt_sp')?.value || '',
                qty: document.getElementById('comm_opt_qty')?.value || ''
            },
            // UI state
            activeTab: document.querySelector('.main-tabs .tab.active')?.dataset.tab || 'equities',
            activeSubTab: document.querySelector('.sub-tab.active')?.dataset.subtab || 'intraday',
            lastUpdated: new Date().toISOString()
        };

        // Save input modes for each section
        const prefixes = ['intra', 'del', 'fut', 'opt', 'curr_fut', 'curr_opt', 'comm_fut', 'comm_opt'];
        prefixes.forEach(prefix => {
            const modeRadio = document.querySelector(`input[name="${prefix}_input_mode"]:checked`);
            if (modeRadio) {
                data.inputModes[prefix] = modeRadio.value;
            }
        });

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Enhanced load stored data
    loadStoredData() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (!storedData) return;
            
            const data = JSON.parse(storedData);
            
            // Restore input modes
            if (data.inputModes) {
                Object.keys(data.inputModes).forEach(prefix => {
                    const mode = data.inputModes[prefix];
                    const radio = document.querySelector(`input[name="${prefix}_input_mode"][value="${mode}"]`);
                    if (radio) {
                        radio.checked = true;
                        this.handleInputModeChange(prefix, mode);
                    }
                });
            }

            // Restore equity data
            if (data.intraday) {
                this.setFieldValue('intra_bp', data.intraday.bp);
                this.setFieldValue('intra_sp', data.intraday.sp);
                this.setFieldValue('intra_qty', data.intraday.qty);
                this.setRadioValue('intra_exchange', data.intraday.exchange);
            }

            if (data.delivery) {
                this.setFieldValue('del_bp', data.delivery.bp);
                this.setFieldValue('del_sp', data.delivery.sp);
                this.setFieldValue('del_qty', data.delivery.qty);
                this.setRadioValue('del_exchange', data.delivery.exchange);
            }

            if (data.futures) {
                this.setFieldValue('fut_bp', data.futures.bp);
                this.setFieldValue('fut_sp', data.futures.sp);
                this.setFieldValue('fut_qty', data.futures.qty);
                this.setRadioValue('fut_exchange', data.futures.exchange);
            }

            if (data.options) {
                this.setFieldValue('opt_bp', data.options.bp);
                this.setFieldValue('opt_sp', data.options.sp);
                this.setFieldValue('opt_qty', data.options.qty);
                this.setRadioValue('opt_exchange', data.options.exchange);
            }

            // Restore currency data
            if (data.currencyFutures) {
                this.setFieldValue('curr_fut_bp', data.currencyFutures.bp);
                this.setFieldValue('curr_fut_sp', data.currencyFutures.sp);
                this.setFieldValue('curr_fut_qty', data.currencyFutures.qty);
            }

            if (data.currencyOptions) {
                this.setFieldValue('curr_opt_strike', data.currencyOptions.strike);
                this.setFieldValue('curr_opt_bp', data.currencyOptions.bp);
                this.setFieldValue('curr_opt_sp', data.currencyOptions.sp);
                this.setFieldValue('curr_opt_qty', data.currencyOptions.qty);
            }

            // Restore commodity data
            if (data.commodityFutures) {
                this.setFieldValue('comm_fut_select', data.commodityFutures.commodity);
                this.setFieldValue('comm_fut_bp', data.commodityFutures.bp);
                this.setFieldValue('comm_fut_sp', data.commodityFutures.sp);
                this.setFieldValue('comm_fut_qty', data.commodityFutures.qty);
            }

            if (data.commodityOptions) {
                this.setFieldValue('comm_opt_select', data.commodityOptions.commodity);
                this.setFieldValue('comm_opt_strike', data.commodityOptions.strike);
                this.setFieldValue('comm_opt_bp', data.commodityOptions.bp);
                this.setFieldValue('comm_opt_sp', data.commodityOptions.sp);
                this.setFieldValue('comm_opt_qty', data.commodityOptions.qty);
            }

            // Restore UI state
            if (data.activeTab) {
                this.setActiveTab(data.activeTab);
            }

            if (data.activeSubTab) {
                this.setActiveSubTab(data.activeSubTab);
            }
            
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    }

    // Helper functions
    setFieldValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== '') {
            element.value = value;
        }
    }

    setRadioValue(name, value) {
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            radio.checked = true;
        }
    }

    setActiveTab(tabName) {
        const tab = document.querySelector(`[data-tab="${tabName}"]`);
        if (tab) {
            tab.click();
        }
    }

    setActiveSubTab(subTabName) {
        setTimeout(() => {
            const subTab = document.querySelector(`[data-subtab="${subTabName}"]`);
            if (subTab) {
                subTab.click();
            }
        }, 100);
    }

    // Clear all stored data
    clearStoredData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.themeKey);
        location.reload();
    }

    calculateAll() {
        setTimeout(() => {
            this.cal_intra();
            this.cal_delivery();
            this.cal_futures();
            this.cal_options();
            this.cal_curr_fut();
            this.cal_curr_opt();
            this.cal_comm_fut();
            this.cal_comm_opt();
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new ZerodhaCalculator();
    
    // Add reset button to clear stored data
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.cssText = `
        position: fixed;
        bottom: 570px;
        right: 50px;
        background: #dc3545;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 10px;
        cursor: pointer;
        z-index: 1000;
    `;
    resetButton.onclick = () => {
        calculator.clearStoredData();
    };
    document.body.appendChild(resetButton);
});
