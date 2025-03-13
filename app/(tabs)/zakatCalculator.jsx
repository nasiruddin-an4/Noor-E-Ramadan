import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Input field component
const InputField = ({
  label,
  value,
  name,
  placeholder = 'Enter amount',
  icon = null,
  handleChange,
  theme,
}) => (
  <View className="mb-4">
    <Text className={`mb-1 text-base ${theme.text}`}>{label}</Text>
    <View className={`flex-row items-center overflow-hidden ${theme.cardBackground} border ${theme.border} rounded-md`}>
      {icon && (
        <View className={`px-3 py-3 ${theme.secondaryBackground}`}>
          <Text className={`font-bold ${theme.iconColor}`}>{icon}</Text>
        </View>
      )}
      <TextInput
        className={`flex-1 px-4 py-3 ${theme.text} ${theme.cardBackground}`}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => handleChange(name, text)}
      />
    </View>
  </View>
);

export default function ZakatCalculator() {
  const colorScheme = useColorScheme() || 'dark';

  // Theme definitions
  const themeStyles = {
    light: {
      background: 'bg-gray-100',
      cardBackground: 'bg-white',
      secondaryBackground: 'bg-gray-200',
      text: 'text-gray-800',
      secondaryText: 'text-gray-500',
      placeholder: '#6B7280',
      primary: 'bg-emerald-600',
      primaryText: 'text-emerald-600',
      secondary: 'bg-gray-300',
      border: 'border-gray-300',
      buttonText: 'text-white',
      success: 'bg-emerald-100',
      successText: 'text-emerald-700',
      warning: 'bg-yellow-100',
      warningText: 'text-yellow-700',
      iconColor: 'text-yellow-500',
      statusBar: '#E5E7EB',
      switchTrackFalse: '#6B7280',
      switchTrackTrue: '#10B981',
      switchThumb: '#FFFFFF',
    },
    dark: {
      background: 'bg-gray-900',
      cardBackground: 'bg-gray-800',
      secondaryBackground: 'bg-gray-700',
      text: 'text-white',
      secondaryText: 'text-gray-400',
      placeholder: '#94A3B8',
      primary: 'bg-emerald-700',
      primaryText: 'text-emerald-200',
      secondary: 'bg-gray-600',
      border: 'border-gray-700',
      buttonText: 'text-white',
      success: 'bg-emerald-900',
      successText: 'text-emerald-200',
      warning: 'bg-yellow-900',
      warningText: 'text-yellow-200',
      iconColor: 'text-yellow-400',
      statusBar: '#111827',
      switchTrackFalse: '#6B7280',
      switchTrackTrue: '#10B981',
      switchThumb: '#FFFFFF',
    },
  };

  const theme = themeStyles[colorScheme];

  // State for input fields
  const [formData, setFormData] = useState({
    cash: '',
    goldSilverType: 'gold',
    goldSilver: '',
    goldSilverUnit: 'grams',
    investments: '',
    loansGiven: '',
    liabilities: '',
    stocks: '',
    rentalIncome: '',
    agriculture: '',
    fdrSavings: '',
  });

  // State for calculated values
  const [results, setResults] = useState({
    totalZakatableAssets: 0,
    zakatAmount: 0,
    nisabValue: 0,
    isEligible: false,
    calculated: false,
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState('assets');

  // Constants for gold and silver prices
  const goldPricePerGram = 7500;
  const silverPricePerGram = 100;
  const goldNisabGrams = 87.48;
  const silverNisabGrams = 612.36;

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle between grams and BDT
  const toggleGoldSilverUnit = () => {
    setFormData((prev) => ({
      ...prev,
      goldSilverUnit: prev.goldSilverUnit === 'grams' ? 'bdt' : 'grams',
      goldSilver: '',
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cash: '',
      goldSilverType: 'gold',
      goldSilver: '',
      goldSilverUnit: 'grams',
      investments: '',
      loansGiven: '',
      liabilities: '',
      stocks: '',
      rentalIncome: '',
      agriculture: '',
      fdrSavings: '',
    });
    setResults({
      totalZakatableAssets: 0,
      zakatAmount: 0,
      nisabValue: 0,
      isEligible: false,
      calculated: false,
    });
    setActiveTab('assets');
  };

  // Calculate Zakat
  const calculateZakat = () => {
    const cashValue = parseFloat(formData.cash) || 0;
    const goldSilverValue =
      formData.goldSilverUnit === 'grams'
        ? (parseFloat(formData.goldSilver) || 0) *
          (formData.goldSilverType === 'gold' ? goldPricePerGram : silverPricePerGram)
        : parseFloat(formData.goldSilver) || 0;
    const investmentsValue = parseFloat(formData.investments) || 0;
    const loansGivenValue = parseFloat(formData.loansGiven) || 0;
    const liabilitiesValue = parseFloat(formData.liabilities) || 0;
    const stocksValue = parseFloat(formData.stocks) || 0;
    const rentalIncomeValue = parseFloat(formData.rentalIncome) || 0;
    const agricultureValue = parseFloat(formData.agriculture) || 0;
    const fdrSavingsValue = parseFloat(formData.fdrSavings) || 0;

    const totalAssets =
      cashValue +
      goldSilverValue +
      investmentsValue +
      loansGivenValue +
      stocksValue +
      rentalIncomeValue +
      agricultureValue +
      fdrSavingsValue -
      liabilitiesValue;

    const nisabValue =
      formData.goldSilverType === 'gold'
        ? goldNisabGrams * goldPricePerGram
        : silverNisabGrams * silverPricePerGram;

    const isEligible = totalAssets >= nisabValue;
    const zakat = isEligible ? totalAssets * 0.025 : 0;

    setResults({
      totalZakatableAssets: totalAssets,
      zakatAmount: zakat,
      nisabValue: nisabValue,
      isEligible: isEligible,
      calculated: true,
    });
    setActiveTab('results');
  };

  // Tab Navigation Component
  const TabNav = () => (
    <View className={`flex-row p-1 mb-4 ${theme.secondaryBackground} rounded-xl`}>
      {['assets', 'liabilities', 'results'].map((tab) => (
        <TouchableOpacity
          key={tab}
          className={`flex-1 py-2 px-3 rounded-lg ${
            activeTab === tab ? theme.primary : 'bg-transparent'
          }`}
          onPress={() => tab !== 'results' || results.calculated ? setActiveTab(tab) : null}
          disabled={tab === 'results' && !results.calculated}
        >
          <Text
            className={`text-center text-sm ${
              activeTab === tab ? theme.buttonText : theme.secondaryText
            } ${activeTab === tab ? 'font-bold' : ''}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // Gold/Silver Tab Component
  const GoldSilverTab = () => (
    <View className="mb-4">
      <Text className={`mb-1 text-base ${theme.text}`}>Select Gold or Silver</Text>
      <View className={`flex-row p-1 ${theme.secondaryBackground} rounded-lg`}>
        {['gold', 'silver'].map((type) => (
          <TouchableOpacity
            key={type}
            className={`flex-1 py-2 px-3 rounded-lg ${
              formData.goldSilverType === type ? theme.primary : 'bg-transparent'
            }`}
            onPress={() => handleChange('goldSilverType', type)}
          >
            <Text
              className={`text-center ${
                formData.goldSilverType === type ? theme.buttonText : theme.secondaryText
              } ${formData.goldSilverType === type ? 'font-bold' : ''}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${theme.background}`}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.statusBar}
      />

      {/* Header */}
      <View className={`px-5 py-4 border-b ${theme.border}`}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className={`text-xl font-bold ${theme.text}`}>
              Zakat Calculator
            </Text>
            <Text className={`text-xs ${theme.secondaryText}`}>
              Calculate your annual Islamic charity
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${theme.success}`}>
            <Text className={`text-xs font-medium ${theme.successText}`}>2.5%</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-3 py-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Tab Navigation */}
          <TabNav />

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <View className={`p-4 mb-4 ${theme.cardBackground} rounded-xl`}>
              <View className={`pb-2 mb-5 border-b ${theme.border}`}>
                <Text className={`text-lg font-semibold ${theme.text}`}>
                  Your Financial Assets
                </Text>
                <Text className={`text-xs ${theme.secondaryText}`}>
                  Enter the value of your assets in BDT
                </Text>
              </View>

              <InputField
                label="Cash & Bank Balances"
                value={formData.cash}
                name="cash"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              {/* Gold/Silver Tab Selection */}
              <GoldSilverTab />

              {/* Toggle between grams and BDT */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className={`text-base ${theme.text}`}>
                  Enter in {formData.goldSilverUnit === 'grams' ? 'Grams' : 'BDT'}
                </Text>
                <Switch
                  value={formData.goldSilverUnit === 'bdt'}
                  onValueChange={toggleGoldSilverUnit}
                  trackColor={{ false: theme.switchTrackFalse, true: theme.switchTrackTrue }}
                  thumbColor={theme.switchThumb}
                />
              </View>

              <InputField
                label={`${formData.goldSilverType === 'gold' ? 'Gold' : 'Silver'} (${
                  formData.goldSilverUnit === 'grams' ? 'in grams' : 'in BDT'
                })`}
                value={formData.goldSilver}
                name="goldSilver"
                placeholder={`Enter ${formData.goldSilverUnit === 'grams' ? 'grams' : 'BDT'}`}
                icon={formData.goldSilverUnit === 'grams' ? 'g' : '৳'}
                handleChange={handleChange}
                theme={theme}
              />

              {/* Rest of the input fields */}
              <InputField
                label="Business & Investment Profits"
                value={formData.investments}
                name="investments"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <InputField
                label="Loans Given to Others"
                value={formData.loansGiven}
                name="loansGiven"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <InputField
                label="Stocks & Shares Value"
                value={formData.stocks}
                name="stocks"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <InputField
                label="Rental Income"
                value={formData.rentalIncome}
                name="rentalIncome"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <InputField
                label="Agricultural Produce Value"
                value={formData.agriculture}
                name="agriculture"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <InputField
                label="FDR & Savings Certificates"
                value={formData.fdrSavings}
                name="fdrSavings"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <TouchableOpacity
                className={`${theme.primary} py-3 px-4 rounded-lg items-center mt-2`}
                onPress={() => setActiveTab('liabilities')}
              >
                <Text className={`${theme.buttonText}`}>Next: Add Liabilities →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Liabilities Tab */}
          {activeTab === 'liabilities' && (
            <View className={`p-4 mb-4 ${theme.cardBackground} rounded-xl`}>
              <View className={`pb-2 mb-5 border-b ${theme.border}`}>
                <Text className={`text-lg font-semibold ${theme.text}`}>
                  Your Liabilities
                </Text>
                <Text className={`text-xs ${theme.secondaryText}`}>
                  Enter your outstanding debts and loans
                </Text>
              </View>

              <InputField
                label="Debts & Loans to Pay"
                value={formData.liabilities}
                name="liabilities"
                icon="৳"
                handleChange={handleChange}
                theme={theme}
              />

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className={`items-center flex-1 px-5 py-3 mr-2 ${theme.secondary} rounded-lg`}
                  onPress={() => setActiveTab('assets')}
                >
                  <Text className={`${theme.buttonText}`}>← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`items-center flex-1 px-5 py-3 ml-2 rounded-lg ${theme.primary}`}
                  onPress={calculateZakat}
                >
                  <Text className={`${theme.buttonText} font-bold`}>Calculate Zakat</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && results.calculated && (
            <View>
              <View className={`p-5 mb-4 ${theme.cardBackground} rounded-xl`}>
                <View className={`flex-row items-center justify-between pb-2 mb-5 border-b ${theme.border}`}>
                  <View>
                    <Text className={`text-lg font-semibold ${theme.text}`}>
                      Calculation Results
                    </Text>
                    <Text className={`text-xs ${theme.secondaryText}`}>
                      Based on your financial information
                    </Text>
                  </View>
                  {results.isEligible ? (
                    <View className={`px-3 py-1 rounded-full ${theme.success}`}>
                      <Text className={`text-xs ${theme.successText}`}>Eligible</Text>
                    </View>
                  ) : (
                    <View className={`px-3 py-1 rounded-full ${theme.warning}`}>
                      <Text className={`text-xs ${theme.warningText}`}>Not Required</Text>
                    </View>
                  )}
                </View>

                <View className={`p-4 mb-4 rounded-lg ${theme.secondaryBackground}`}>
                  <Text className={`mb-1 text-xs ${theme.secondaryText}`}>
                    Nisab Threshold Value:
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`text-lg font-medium ${theme.text}`}>
                      {results.nisabValue.toLocaleString()}
                    </Text>
                    <Text className={`ml-1 text-xs ${theme.secondaryText}`}>BDT</Text>
                  </View>
                  <Text className={`mt-1 text-xs ${theme.secondaryText}`}>
                    {formData.goldSilverType === 'gold'
                      ? `Based on ${goldNisabGrams}g of Gold at ${goldPricePerGram} BDT/g`
                      : `Based on ${silverNisabGrams}g of Silver at ${silverPricePerGram} BDT/g`}
                  </Text>
                </View>

                <View className={`p-4 mb-4 rounded-lg ${theme.secondaryBackground}`}>
                  <Text className={`mb-1 text-xs ${theme.secondaryText}`}>
                    Your Total Zakatable Assets:
                  </Text>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-lg font-medium ${
                        results.totalZakatableAssets >= results.nisabValue
                          ? theme.primaryText
                          : theme.text
                      }`}
                    >
                      {results.totalZakatableAssets.toLocaleString()}
                    </Text>
                    <Text className={`ml-1 text-xs ${theme.secondaryText}`}>BDT</Text>
                  </View>
                  <Text className={`mt-1 text-xs ${theme.secondaryText}`}>
                    {results.totalZakatableAssets >= results.nisabValue
                      ? 'Your wealth exceeds Nisab threshold'
                      : 'Your wealth is below Nisab threshold'}
                  </Text>
                </View>

                <View className={`p-4 mt-2 rounded-lg ${theme.success}`}>
                  <Text className={`mb-1 text-xs ${theme.successText}`}>
                    Your Zakat Amount (2.5%):
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`text-2xl font-bold ${theme.text}`}>
                      {results.zakatAmount.toLocaleString()}
                    </Text>
                    <Text className={`ml-1 text-sm ${theme.successText}`}>BDT</Text>
                  </View>
                  {!results.isEligible && (
                    <View className={`p-2 mt-2 rounded ${theme.warning}`}>
                      <Text className={`text-xs ${theme.warningText}`}>
                        Your assets are below Nisab threshold. Zakat is not obligatory this year.
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                  className={`items-center flex-1 px-5 py-3 mr-2 ${theme.secondary} rounded-lg`}
                  onPress={resetForm}
                >
                  <Text className={`${theme.buttonText}`}>Reset Calculator</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`items-center flex-1 px-5 py-3 ml-2 rounded-lg ${theme.primary}`}
                  onPress={() => setActiveTab('assets')}
                >
                  <Text className={`${theme.buttonText} font-bold`}>Recalculate</Text>
                </TouchableOpacity>
              </View>

              {/* Information Section */}
              <View className={`p-4 mb-6 ${theme.cardBackground} rounded-xl`}>
                <Text className={`mb-2 text-base font-semibold ${theme.text}`}>
                  About Zakat
                </Text>
                <Text className={`text-xs ${theme.secondaryText}`}>
                  Zakat is one of the five pillars of Islam, requiring Muslims to give 2.5% of their qualifying wealth to those in need. It's calculated annually on assets held for one lunar year (Hawl) and is only obligatory if your wealth exceeds the Nisab threshold.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}