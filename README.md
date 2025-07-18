# Zerodha Brokerage Calculator Extension

A Chrome extension for Zerodha's brokerage calculator

insted of going to zerodhas website, we can use this extension

## 🚀 Features

- **Equities Trading**
  - Intraday Equity calculations
  - Delivery Equity calculations
  - F&O Futures calculations
  - F&O Options calculations

- **Currency Trading**
  - Currency Futures calculations
  - Currency Options calculations

- **Commodity Trading**
  - Commodity Futures calculations


### Calculation Accuracy
- **Accurate Charges**: Based on Zerodha's actual brokerage structure
- **All Statutory Charges**: Including STT, Exchange charges, GST, SEBI charges, Stamp duty, and CTT
- **Net P&L Display**: Clear profit/loss calculations with color coding
- **Multiple Commodities**: Support for Gold, Silver, Copper, Crude Oil, Natural Gas, and more

## 📦 Installation

### From Source
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your browser toolbar

### File Structure
zerodha-calculator-extension/
├── manifest.json # Extension configuration
├── popup.html # Main interface
├── popup.css # Styling
├── popup.js # Logic and calculations
├── README.md # Documentation
└── icons/ # Extension icons
├── icon16.png
├── icon48.png
└── icon128.png



## 🔧 Usage

1. Click the extension icon in your browser toolbar
2. Select the appropriate main tab (Equities-F&O, Currency, or Commodities)
3. Choose the specific instrument type from the sub-tabs
4. Enter your trade details:
   - Buy price
   - Sell price
   - Quantity
   - Exchange (NSE/BSE where applicable)
5. View real-time calculations of all charges and net P&L

## 🧮 Supported Calculations

### Equity Charges
- **Brokerage**: ₹20 per order or 0.03% (whichever is lower)
- **STT**: 0.025% on sell side (Intraday), 0.1% on sell side (Delivery)
- **Exchange Charges**: 0.00325% (NSE), 0.00375% (BSE)
- **GST**: 18% on brokerage + exchange charges
- **SEBI Charges**: 0.0001% on turnover
- **Stamp Duty**: 0.003% on buy side (Intraday), 0.015% on buy side (Delivery)

### F&O Charges
- **Futures**: STT 0.01% on sell side, Exchange charges 0.0019%
- **Options**: STT 0.05% on sell side, Exchange charges 0.035%

### Currency Charges
- **Futures**: Exchange charges 0.0004%, No STT
- **Options**: Exchange charges 0.0035%, No STT

### Commodity Charges
- **Futures**: Exchange charges 0.0021%, CTT 0.01%
- **Options**: Exchange charges 0.042%, CTT 0.01% on sell side

## 🚧 Future Scope

### Planned Features
- **Historical Data Integration**: Connect with trading APIs for real-time price data
- **Portfolio Analysis**: Calculate charges for multiple positions
- **Export Functionality**: Save calculations as PDF or Excel
- **Advanced Calculators**: 
  - Margin calculator
  - SIP calculator
  - Tax calculator
- **Multiple Brokers**: Support for other brokers' charge structures
- **Mobile App**: React Native version for mobile devices
- **Theme Options**: Dark mode and custom themes
- **Notifications**: Alerts for significant charge differences

### Technical Enhancements
- **Cloud Sync**: Save calculations across devices
- **Offline Storage**: Local storage for calculation history
- **Performance Optimization**: Faster calculations for large datasets
- **API Integration**: Connect with popular trading platforms
- **Automated Updates**: Real-time charge structure updates

## 🤝 Contributing

We welcome contributions from the community! This project is open source and collaborative.

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/feature`)
3. Commit your changes (`git commit -m 'Add  feature'`)
4. Push to the branch (`git push origin feature/feature`)
5. Open a Pull Request

### Areas for Contribution
- **Bug Fixes**: Report and fix calculation errors
- **New Features**: Add support for new instruments or brokers
- **UI/UX Improvements**: Enhance user experience
- **Documentation**: Improve README and code comments
- **Testing**: Add unit tests and integration tests
- **Localization**: Add support for multiple languages


## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- **Zerodha** for providing the original calculator functionality
- **Chrome Extensions API** for the platform
- **Open Source Community** for inspiration and support

## 📧 Contact & Support

- **Author**: Tharun R
- **GitHub**: [https://github.com/Tharun-Techie](https://github.com/Tharun-Techie)
- **Issues**: Please report bugs and feature requests on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions

## 🔄 Version History

### v1.0.0 (Current)
- Initial release with basic calculation functionality
- Support for Equities, Currency, and Commodities
- Clean tabbed interface
- Real-time calculations

### Roadmap
- **v1.0.0**: Multi-broker support

## 🌟 Support the Project

If you find this extension helpful, please:
- ⭐ Star the repository on GitHub
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 🔄 Share with fellow traders
- 🤝 Contribute code or documentation



**Made with ❤️ by traders, for traders**
