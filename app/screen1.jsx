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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Input field component to reduce repetition
const InputField = ({
  label,
  value,
  name,
  placeholder = 'Enter amount',
  icon = null,
  handleChange,
}) => (
  <View className="mb-4">
    <Text className="mb-1 text-base text-white">{label}</Text>
    <View className="flex-row items-center overflow-hidden bg-gray-800 border border-gray-700 rounded-md">
      {icon && (
        <View className="px-3 py-3 bg-gray-700">
          <Text className="font-bold text-yellow-400">{icon}</Text>
        </View>
      )}
      <TextInput
        className="flex-1 px-4 py-3 text-white bg-gray-800"
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => handleChange(name, text)}
      />
    </View>
  </View>
);

export default function ZakatCalculator() {
  // State for input fields
  const [formData, setFormData] = useState({
    cash: '',
    goldSilverType: 'gold', // gold or silver
    goldSilver: '',
    goldSilverUnit: 'grams', // grams or bdt
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

  // Constants for gold and silver prices (Update these regularly)
  const goldPricePerGram = 7500; // BDT per gram
  const silverPricePerGram = 100; // BDT per gram

  // Nisab threshold (87.48 grams of gold or 612.36 grams of silver)
  const goldNisabGrams = 87.48;
  const silverNisabGrams = 612.36;

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle between grams and BDT for gold/silver
  const toggleGoldSilverUnit = () => {
    setFormData((prev) => ({
      ...prev,
      goldSilverUnit: prev.goldSilverUnit === 'grams' ? 'bdt' : 'grams',
      goldSilver: '', // Reset the input value when toggling
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
  };

  // Function to calculate Zakat
  const calculateZakat = () => {
    // Convert inputs to numbers
    const cashValue = parseFloat(formData.cash) || 0;
    const goldSilverValue =
      formData.goldSilverUnit === 'grams'
        ? (parseFloat(formData.goldSilver) || 0) *
          (formData.goldSilverType === 'gold'
            ? goldPricePerGram
            : silverPricePerGram)
        : parseFloat(formData.goldSilver) || 0;
    const investmentsValue = parseFloat(formData.investments) || 0;
    const loansGivenValue = parseFloat(formData.loansGiven) || 0;
    const liabilitiesValue = parseFloat(formData.liabilities) || 0;
    const stocksValue = parseFloat(formData.stocks) || 0;
    const rentalIncomeValue = parseFloat(formData.rentalIncome) || 0;
    const agricultureValue = parseFloat(formData.agriculture) || 0;
    const fdrSavingsValue = parseFloat(formData.fdrSavings) || 0;

    // Calculate total zakatable assets
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

    // Calculate Nisab value (using current gold/silver prices)
    const nisabValue =
      formData.goldSilverType === 'gold'
        ? goldNisabGrams * goldPricePerGram
        : silverNisabGrams * silverPricePerGram;

    // Check if assets exceed Nisab threshold
    const isEligible = totalAssets >= nisabValue;

    // Calculate Zakat amount (2.5% of total zakatable assets)
    const zakat = isEligible ? totalAssets * 0.025 : 0;

    // Update state
    setResults({
      totalZakatableAssets: totalAssets,
      zakatAmount: zakat,
      nisabValue: nisabValue,
      isEligible: isEligible,
      calculated: true,
    });

    // Show results tab
    setActiveTab('results');
  };

  // Tab navigation component
  const TabNav = () => (
    <View className="flex-row p-1 mb-4 bg-gray-800 rounded-xl">
      <TouchableOpacity
        className={`flex-1 py-2 px-3 rounded-lg ${
          activeTab === 'assets' ? 'bg-emerald-800' : 'bg-transparent'
        }`}
        onPress={() => setActiveTab('assets')}
      >
        <Text
          className={`text-center ${
            activeTab === 'assets' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          Assets
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-2 px-3 rounded-lg ${
          activeTab === 'liabilities' ? 'bg-emerald-800' : 'bg-transparent'
        }`}
        onPress={() => setActiveTab('liabilities')}
      >
        <Text
          className={`text-center ${
            activeTab === 'liabilities'
              ? 'text-white font-bold'
              : 'text-gray-400'
          }`}
        >
          Liabilities
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-2 px-3 rounded-lg ${
          activeTab === 'results' ? 'bg-emerald-800' : 'bg-transparent'
        }`}
        onPress={() => setActiveTab('results')}
        disabled={!results.calculated}
      >
        <Text
          className={`text-center ${
            activeTab === 'results' ? 'text-white font-bold' : 'text-gray-400'
          }`}
        >
          Results
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Gold/Silver Tab Component
  const GoldSilverTab = () => (
    <View className="mb-4">
      <Text className="mb-1 text-base text-white">Select Gold or Silver</Text>
      <View className="flex-row p-1 bg-gray-700 rounded-lg">
        <TouchableOpacity
          className={`flex-1 py-2 px-3 rounded-lg ${
            formData.goldSilverType === 'gold'
              ? 'bg-emerald-600'
              : 'bg-transparent'
          }`}
          onPress={() => handleChange('goldSilverType', 'gold')}
        >
          <Text
            className={`text-center ${
              formData.goldSilverType === 'gold'
                ? 'text-white font-bold'
                : 'text-gray-400'
            }`}
          >
            Gold
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 px-3 rounded-lg ${
            formData.goldSilverType === 'silver'
              ? 'bg-emerald-600'
              : 'bg-transparent'
          }`}
          onPress={() => handleChange('goldSilverType', 'silver')}
        >
          <Text
            className={`text-center ${
              formData.goldSilverType === 'silver'
                ? 'text-white font-bold'
                : 'text-gray-400'
            }`}
          >
            Silver
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 ">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-white">
              Zakat Calculator
            </Text>
            <Text className="text-xs text-gray-400">
              Calculate your annual Islamic charity
            </Text>
          </View>
          <View className="px-3 py-1 rounded-full bg-emerald-900">
            <Text className="text-xs font-medium text-emerald-200">2.5%</Text>
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
            <View className="p-4 mb-4 bg-gray-800/80 rounded-xl">
              <View className="pb-2 mb-5 border-b border-gray-700">
                <Text className="text-lg font-semibold text-white">
                  Your Financial Assets
                </Text>
                <Text className="text-xs text-gray-400">
                  Enter the value of your assets in BDT
                </Text>
              </View>

              <InputField
                label="Cash & Bank Balances"
                value={formData.cash}
                name="cash"
                icon="৳"
                handleChange={handleChange}
              />
              {/* <TextInput
                className="flex-1 px-4 py-3 text-white bg-gray-800"
                placeholder={'Hello'}
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={formData.cash}
                onChangeText={({ name = 'cash', text }) =>
                  handleChange(name, text)
                }
              /> */}

              {/* Gold/Silver Tab Selection */}
              <GoldSilverTab />

              {/* Toggle between grams and BDT */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base text-white">
                  Enter in{' '}
                  {formData.goldSilverUnit === 'grams' ? 'Grams' : 'BDT'}
                </Text>
                <Switch
                  value={formData.goldSilverUnit === 'bdt'}
                  onValueChange={toggleGoldSilverUnit}
                  trackColor={{ false: '#6B7280', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <InputField
                label={`${
                  formData.goldSilverType === 'gold' ? 'Gold' : 'Silver'
                } (${
                  formData.goldSilverUnit === 'grams' ? 'in grams' : 'in BDT'
                })`}
                value={formData.goldSilver}
                name="goldSilver"
                placeholder={`Enter ${
                  formData.goldSilverUnit === 'grams' ? 'grams' : 'BDT'
                }`}
                icon={formData.goldSilverUnit === 'grams' ? 'g' : '৳'}
                handleChange={handleChange}
              />

              {/* Rest of the input fields */}
              <InputField
                label="Business & Investment Profits"
                value={formData.investments}
                name="investments"
                icon="৳"
                handleChange={handleChange}
              />

              <InputField
                label="Loans Given to Others"
                value={formData.loansGiven}
                name="loansGiven"
                icon="৳"
                handleChange={handleChange}
              />

              <InputField
                label="Stocks & Shares Value"
                value={formData.stocks}
                name="stocks"
                icon="৳"
                handleChange={handleChange}
              />

              <InputField
                label="Rental Income"
                value={formData.rentalIncome}
                name="rentalIncome"
                icon="৳"
                handleChange={handleChange}
              />

              <InputField
                label="Agricultural Produce Value"
                value={formData.agriculture}
                name="agriculture"
                icon="৳"
                handleChange={handleChange}
              />

              <InputField
                label="FDR & Savings Certificates"
                value={formData.fdrSavings}
                name="fdrSavings"
                icon="৳"
                handleChange={handleChange}
              />

              <TouchableOpacity
                className="items-center px-4 py-2 mt-2 bg-gray-700 rounded-lg"
                onPress={() => setActiveTab('liabilities')}
              >
                <Text className="text-white">Next: Add Liabilities →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Liabilities Tab */}
          {activeTab === 'liabilities' && (
            <View className="p-4 mb-4 bg-gray-800/80 rounded-xl">
              <View className="pb-2 mb-5 border-b border-gray-700">
                <Text className="text-lg font-semibold text-white">
                  Your Liabilities
                </Text>
                <Text className="text-xs text-gray-400">
                  Enter your outstanding debts and loans
                </Text>
              </View>

              <InputField
                label="Debts & Loans to Pay"
                value={formData.liabilities}
                name="liabilities"
                icon="৳"
                handleChange={handleChange}
              />

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="items-center flex-1 px-5 py-3 mr-2 bg-gray-700 rounded-lg"
                  onPress={() => setActiveTab('assets')}
                >
                  <Text className="text-white">← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center flex-1 px-5 py-3 ml-2 rounded-lg bg-emerald-600"
                  onPress={calculateZakat}
                >
                  <Text className="font-bold text-white">Calculate Zakat</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && results.calculated && (
            <View>
              <View className="p-5 mb-4 bg-gray-800/80 rounded-xl">
                <View className="flex-row items-center justify-between pb-2 mb-5 border-b border-gray-700">
                  <View>
                    <Text className="text-lg font-semibold text-white">
                      Calculation Results
                    </Text>
                    <Text className="text-xs text-gray-400">
                      Based on your financial information
                    </Text>
                  </View>
                  {results.isEligible ? (
                    <View className="px-3 py-1 rounded-full bg-emerald-700">
                      <Text className="text-xs text-white">Eligible</Text>
                    </View>
                  ) : (
                    <View className="px-3 py-1 bg-yellow-700 rounded-full">
                      <Text className="text-xs text-white">Not Required</Text>
                    </View>
                  )}
                </View>

                <View className="p-4 mb-4 rounded-lg bg-gray-700/60">
                  <Text className="mb-1 text-xs text-gray-400">
                    Nisab Threshold Value:
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-lg font-medium text-white">
                      {results.nisabValue.toLocaleString()}
                    </Text>
                    <Text className="ml-1 text-xs text-gray-400">BDT</Text>
                  </View>
                  <Text className="mt-1 text-xs text-gray-400">
                    {formData.goldSilverType === 'gold'
                      ? `Based on ${goldNisabGrams}g of Gold at ${goldPricePerGram} BDT/g`
                      : `Based on ${silverNisabGrams}g of Silver at ${silverPricePerGram} BDT/g`}
                  </Text>
                </View>

                <View className="p-4 mb-4 rounded-lg bg-gray-700/60">
                  <Text className="mb-1 text-xs text-gray-400">
                    Your Total Zakatable Assets:
                  </Text>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-lg font-medium ${
                        results.totalZakatableAssets >= results.nisabValue
                          ? 'text-emerald-400'
                          : 'text-white'
                      }`}
                    >
                      {results.totalZakatableAssets.toLocaleString()}
                    </Text>
                    <Text className="ml-1 text-xs text-gray-400">BDT</Text>
                  </View>
                  <Text className="mt-1 text-xs text-gray-400">
                    {results.totalZakatableAssets >= results.nisabValue
                      ? 'Your wealth exceeds Nisab threshold'
                      : 'Your wealth is below Nisab threshold'}
                  </Text>
                </View>

                <View className="p-4 mt-2 rounded-lg bg-emerald-900/80">
                  <Text className="mb-1 text-xs text-emerald-200">
                    Your Zakat Amount (2.5%):
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-bold text-white">
                      {results.zakatAmount.toLocaleString()}
                    </Text>
                    <Text className="ml-1 text-sm text-emerald-200">BDT</Text>
                  </View>
                  {!results.isEligible && (
                    <View className="p-2 mt-2 rounded bg-yellow-600/40">
                      <Text className="text-xs text-yellow-200">
                        Your assets are below Nisab threshold. Zakat is not
                        obligatory this year.
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                  className="items-center flex-1 px-5 py-3 mr-2 bg-gray-700 rounded-lg"
                  onPress={resetForm}
                >
                  <Text className="text-white">Reset Calculator</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center flex-1 px-5 py-3 ml-2 rounded-lg bg-emerald-700"
                  onPress={() => setActiveTab('assets')}
                >
                  <Text className="font-bold text-white">Recalculate</Text>
                </TouchableOpacity>
              </View>

              {/* Information Section */}
              <View className="p-4 mb-6 bg-gray-800/80 rounded-xl">
                <Text className="mb-2 text-base font-semibold text-white">
                  About Zakat
                </Text>
                <Text className="text-xs text-gray-400">
                  Zakat is one of the five pillars of Islam, requiring Muslims
                  to give 2.5% of their qualifying wealth to those in need. It's
                  calculated annually on assets held for one lunar year (Hawl)
                  and is only obligatory if your wealth exceeds the Nisab
                  threshold.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
