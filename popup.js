class ZerodhaCalculator {
    constructor() {
        this.storageKey = 'zerodha_calculator_data';
        this.init();
    }

    init() {
        this.setupMainTabs();
        this.setupSubTabs();
        this.setupCalculationFunctions();
        this.setupEventListeners();
        this.loadStoredData();
        this.calculateAll();
    }

    // Save data to localStorage
    saveData() {
        const data = {
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

        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Load data from localStorage
    loadStoredData() {
        try {
            const storedData = localStorage.getItem(this.storageKey);
            if (!storedData) return;

            const data = JSON.parse(storedData);

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

    // Clear all stored data - NO CONFIRMATION
    clearStoredData() {
        localStorage.removeItem(this.storageKey);
        location.reload();
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
                
                // Save UI state
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
                
                // Save UI state
                this.saveData();
            });
        });
    }

    setupEventListeners() {
        // Add auto-save functionality to all input fields
        const allInputs = document.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveData();
            });
            input.addEventListener('change', () => {
                this.saveData();
            });
        });

        // Intraday inputs
        const intraInputs = ['intra_bp', 'intra_sp', 'intra_qty'];
        intraInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_intra());
            }
        });

        // Intraday exchange radio buttons
        const intraRadios = document.querySelectorAll('input[name="intra_exchange"]');
        intraRadios.forEach(radio => {
            radio.addEventListener('change', () => this.cal_intra());
        });

        // Delivery inputs
        const delInputs = ['del_bp', 'del_sp', 'del_qty'];
        delInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_delivery());
            }
        });

        // Delivery exchange radio buttons
        const delRadios = document.querySelectorAll('input[name="del_exchange"]');
        delRadios.forEach(radio => {
            radio.addEventListener('change', () => this.cal_delivery());
        });

        // Futures inputs
        const futInputs = ['fut_bp', 'fut_sp', 'fut_qty'];
        futInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_futures());
            }
        });

        // Futures exchange radio buttons
        const futRadios = document.querySelectorAll('input[name="fut_exchange"]');
        futRadios.forEach(radio => {
            radio.addEventListener('change', () => this.cal_futures());
        });

        // Options inputs
        const optInputs = ['opt_bp', 'opt_sp', 'opt_qty'];
        optInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_options());
            }
        });

        // Options exchange radio buttons
        const optRadios = document.querySelectorAll('input[name="opt_exchange"]');
        optRadios.forEach(radio => {
            radio.addEventListener('change', () => this.cal_options());
        });

        // Currency inputs
        const currFutInputs = ['curr_fut_bp', 'curr_fut_sp', 'curr_fut_qty'];
        currFutInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_curr_fut());
            }
        });

        const currOptInputs = ['curr_opt_strike', 'curr_opt_bp', 'curr_opt_sp', 'curr_opt_qty'];
        currOptInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_curr_opt());
            }
        });

        // Commodity inputs
        const commFutInputs = ['comm_fut_bp', 'comm_fut_sp', 'comm_fut_qty'];
        commFutInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_comm_fut());
            }
        });

        const commFutSelect = document.getElementById('comm_fut_select');
        if (commFutSelect) {
            commFutSelect.addEventListener('change', () => this.cal_comm_fut());
        }

        const commOptInputs = ['comm_opt_strike', 'comm_opt_bp', 'comm_opt_sp', 'comm_opt_qty'];
        commOptInputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.cal_comm_opt());
            }
        });

        const commOptSelect = document.getElementById('comm_opt_select');
        if (commOptSelect) {
            commOptSelect.addEventListener('change', () => this.cal_comm_opt());
        }
    }

    setupCalculationFunctions() {
        // Make calculation functions available globally for inline handlers
        window.cal_intra = () => this.cal_intra();
        window.cal_delivery = () => this.cal_delivery();
        window.cal_futures = () => this.cal_futures();
        window.cal_options = () => this.cal_options();
        window.cal_curr_fut = () => this.cal_curr_fut();
        window.cal_curr_opt = () => this.cal_curr_opt();
        window.cal_comm_fut = () => this.cal_comm_fut();
        window.cal_comm_opt = () => this.cal_comm_opt();
    }

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

        const multiplier = parseInt(select.selectedOptions[0].getAttribute('data-multiplier')) || 1;
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

        const multiplier = parseInt(select.selectedOptions[0].getAttribute('data-multiplier')) || 1;
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

    updateResults(prefix, values) {
        const elements = {
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
                elements[key].textContent = `₹${value.toFixed(2)}`;
                
                if (key === 'pnl') {
                    elements[key].classList.toggle('negative', value < 0);
                }
            }
        });
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
    
    // Add reset button to clear stored data (no confirmation)
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.cssText = `
        position: fixed;
        bottom: 8px;
        right: 8px;
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
