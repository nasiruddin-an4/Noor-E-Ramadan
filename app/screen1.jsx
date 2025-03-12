import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function ZakatCalculator() {
  // State for input fields
  const [formData, setFormData] = useState({
    cash: "",
    goldSilverType: "gold", // gold or silver
    goldSilver: "",
    goldSilverUnit: "grams", // grams or bdt
    investments: "",
    loansGiven: "",
    liabilities: "",
    stocks: "",
    rentalIncome: "",
    agriculture: "",
    fdrSavings: "",
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
  const [activeTab, setActiveTab] = useState("assets");

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
      goldSilverUnit: prev.goldSilverUnit === "grams" ? "bdt" : "grams",
      goldSilver: "", // Reset the input value when toggling
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      cash: "",
      goldSilverType: "gold",
      goldSilver: "",
      goldSilverUnit: "grams",
      investments: "",
      loansGiven: "",
      liabilities: "",
      stocks: "",
      rentalIncome: "",
      agriculture: "",
      fdrSavings: "",
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
      formData.goldSilverUnit === "grams"
        ? (parseFloat(formData.goldSilver) || 0) *
          (formData.goldSilverType === "gold" ? goldPricePerGram : silverPricePerGram)
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
      formData.goldSilverType === "gold"
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
    setActiveTab("results");
  };

  // Input field component to reduce repetition
  const InputField = ({ label, value, name, placeholder = "Enter amount", icon = null }) => (
    <View className="mb-4">
      <Text className="text-white text-base mb-1">{label}</Text>
      <View className="flex-row items-center bg-gray-800 rounded-md overflow-hidden border border-gray-700">
        {icon && (
          <View className="px-3 py-3 bg-gray-700">
            <Text className="text-yellow-400 font-bold">{icon}</Text>
          </View>
        )}
        <TextInput
          className="bg-gray-800 text-white px-4 py-3 flex-1"
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={value}
          onChangeText={(text) => handleChange(name, text)}
          onBlur={() => {}} // Ensure the input doesn't lose focus
        />
      </View>
    </View>
  );

  // Tab navigation component
  const TabNav = () => (
    <View className="flex-row bg-gray-800 rounded-xl mb-4 p-1">
      <TouchableOpacity
        className={`flex-1 py-2 px-3 rounded-lg ${activeTab === "assets" ? "bg-emerald-800" : "bg-transparent"}`}
        onPress={() => setActiveTab("assets")}
      >
        <Text className={`text-center ${activeTab === "assets" ? "text-white font-bold" : "text-gray-400"}`}>
          Assets
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-2 px-3 rounded-lg ${activeTab === "liabilities" ? "bg-emerald-800" : "bg-transparent"}`}
        onPress={() => setActiveTab("liabilities")}
      >
        <Text className={`text-center ${activeTab === "liabilities" ? "text-white font-bold" : "text-gray-400"}`}>
          Liabilities
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-2 px-3 rounded-lg ${activeTab === "results" ? "bg-emerald-800" : "bg-transparent"}`}
        onPress={() => setActiveTab("results")}
        disabled={!results.calculated}
      >
        <Text className={`text-center ${activeTab === "results" ? "text-white font-bold" : "text-gray-400"}`}>
          Results
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Gold/Silver Tab Component
  const GoldSilverTab = () => (
    <View className="mb-4">
      <Text className="text-white text-base mb-1">Select Gold or Silver</Text>
      <View className="flex-row bg-gray-700 rounded-lg p-1">
        <TouchableOpacity
          className={`flex-1 py-2 px-3 rounded-lg ${
            formData.goldSilverType === "gold" ? "bg-emerald-600" : "bg-transparent"
          }`}
          onPress={() => handleChange("goldSilverType", "gold")}
        >
          <Text
            className={`text-center ${
              formData.goldSilverType === "gold" ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            Gold
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 px-3 rounded-lg ${
            formData.goldSilverType === "silver" ? "bg-emerald-600" : "bg-transparent"
          }`}
          onPress={() => handleChange("goldSilverType", "silver")}
        >
          <Text
            className={`text-center ${
              formData.goldSilverType === "silver" ? "text-white font-bold" : "text-gray-400"
            }`}
          >
            Silver
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-900 pt-7">
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* Header */}
      <View className="px-5 py-4 border-b border-gray-800">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-bold">Zakat Calculator</Text>
            <Text className="text-gray-400 text-xs">Calculate your annual Islamic charity</Text>
          </View>
          <View className="bg-emerald-900 px-3 py-1 rounded-full">
            <Text className="text-emerald-200 text-xs font-medium">2.5%</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-3 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Tab Navigation */}
          <TabNav />

          {/* Assets Tab */}
          {activeTab === "assets" && (
            <View className="bg-gray-800/80 rounded-xl p-4 mb-4">
              <View className="mb-5 border-b border-gray-700 pb-2">
                <Text className="text-white text-lg font-semibold">Your Financial Assets</Text>
                <Text className="text-gray-400 text-xs">Enter the value of your assets in BDT</Text>
              </View>

              <InputField
                label="Cash & Bank Balances"
                value={formData.cash}
                name="cash"
                icon="৳"
              />

              {/* Gold/Silver Tab Selection */}
              <GoldSilverTab />

              {/* Toggle between grams and BDT */}
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-base">Enter in {formData.goldSilverUnit === "grams" ? "Grams" : "BDT"}</Text>
                <Switch
                  value={formData.goldSilverUnit === "bdt"}
                  onValueChange={toggleGoldSilverUnit}
                  trackColor={{ false: "#6B7280", true: "#10B981" }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <InputField
                label={`${formData.goldSilverType === "gold" ? "Gold" : "Silver"} (${
                  formData.goldSilverUnit === "grams" ? "in grams" : "in BDT"
                })`}
                value={formData.goldSilver}
                name="goldSilver"
                placeholder={`Enter ${formData.goldSilverUnit === "grams" ? "grams" : "BDT"}`}
                icon={formData.goldSilverUnit === "grams" ? "g" : "৳"}
              />

              {/* Rest of the input fields */}
              <InputField
                label="Business & Investment Profits"
                value={formData.investments}
                name="investments"
                icon="৳"
              />

              <InputField
                label="Loans Given to Others"
                value={formData.loansGiven}
                name="loansGiven"
                icon="৳"
              />

              <InputField
                label="Stocks & Shares Value"
                value={formData.stocks}
                name="stocks"
                icon="৳"
              />

              <InputField
                label="Rental Income"
                value={formData.rentalIncome}
                name="rentalIncome"
                icon="৳"
              />

              <InputField
                label="Agricultural Produce Value"
                value={formData.agriculture}
                name="agriculture"
                icon="৳"
              />

              <InputField
                label="FDR & Savings Certificates"
                value={formData.fdrSavings}
                name="fdrSavings"
                icon="৳"
              />

              <TouchableOpacity
                className="bg-gray-700 py-2 px-4 rounded-lg items-center mt-2"
                onPress={() => setActiveTab("liabilities")}
              >
                <Text className="text-white">Next: Add Liabilities →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Liabilities Tab */}
          {activeTab === "liabilities" && (
            <View className="bg-gray-800/80 rounded-xl p-4 mb-4">
              <View className="mb-5 border-b border-gray-700 pb-2">
                <Text className="text-white text-lg font-semibold">Your Liabilities</Text>
                <Text className="text-gray-400 text-xs">Enter your outstanding debts and loans</Text>
              </View>

              <InputField
                label="Debts & Loans to Pay"
                value={formData.liabilities}
                name="liabilities"
                icon="৳"
              />

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  className="bg-gray-700 py-3 px-5 rounded-lg flex-1 mr-2 items-center"
                  onPress={() => setActiveTab("assets")}
                >
                  <Text className="text-white">← Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-emerald-600 py-3 px-5 rounded-lg flex-1 ml-2 items-center"
                  onPress={calculateZakat}
                >
                  <Text className="text-white font-bold">Calculate Zakat</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Results Tab */}
          {activeTab === "results" && results.calculated && (
            <View>
              <View className="bg-gray-800/80 rounded-xl p-5 mb-4">
                <View className="mb-5 border-b border-gray-700 pb-2 flex-row items-center justify-between">
                  <View>
                    <Text className="text-white text-lg font-semibold">Calculation Results</Text>
                    <Text className="text-gray-400 text-xs">Based on your financial information</Text>
                  </View>
                  {results.isEligible ? (
                    <View className="bg-emerald-700 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs">Eligible</Text>
                    </View>
                  ) : (
                    <View className="bg-yellow-700 px-3 py-1 rounded-full">
                      <Text className="text-white text-xs">Not Required</Text>
                    </View>
                  )}
                </View>

                <View className="bg-gray-700/60 p-4 rounded-lg mb-4">
                  <Text className="text-gray-400 text-xs mb-1">Nisab Threshold Value:</Text>
                  <View className="flex-row items-center">
                    <Text className="text-white text-lg font-medium">{results.nisabValue.toLocaleString()}</Text>
                    <Text className="text-gray-400 text-xs ml-1">BDT</Text>
                  </View>
                  <Text className="text-gray-400 text-xs mt-1">
                    {formData.goldSilverType === "gold"
                      ? `Based on ${goldNisabGrams}g of Gold at ${goldPricePerGram} BDT/g`
                      : `Based on ${silverNisabGrams}g of Silver at ${silverPricePerGram} BDT/g`}
                  </Text>
                </View>

                <View className="bg-gray-700/60 p-4 rounded-lg mb-4">
                  <Text className="text-gray-400 text-xs mb-1">Your Total Zakatable Assets:</Text>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-lg font-medium ${
                        results.totalZakatableAssets >= results.nisabValue ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {results.totalZakatableAssets.toLocaleString()}
                    </Text>
                    <Text className="text-gray-400 text-xs ml-1">BDT</Text>
                  </View>
                  <Text className="text-gray-400 text-xs mt-1">
                    {results.totalZakatableAssets >= results.nisabValue
                      ? "Your wealth exceeds Nisab threshold"
                      : "Your wealth is below Nisab threshold"}
                  </Text>
                </View>

                <View className="bg-emerald-900/80 p-4 rounded-lg mt-2">
                  <Text className="text-emerald-200 text-xs mb-1">Your Zakat Amount (2.5%):</Text>
                  <View className="flex-row items-center">
                    <Text className="text-white text-2xl font-bold">{results.zakatAmount.toLocaleString()}</Text>
                    <Text className="text-emerald-200 text-sm ml-1">BDT</Text>
                  </View>
                  {!results.isEligible && (
                    <View className="bg-yellow-600/40 p-2 rounded mt-2">
                      <Text className="text-yellow-200 text-xs">
                        Your assets are below Nisab threshold. Zakat is not obligatory this year.
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                  className="bg-gray-700 py-3 px-5 rounded-lg flex-1 mr-2 items-center"
                  onPress={resetForm}
                >
                  <Text className="text-white">Reset Calculator</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-emerald-700 py-3 px-5 rounded-lg flex-1 ml-2 items-center"
                  onPress={() => setActiveTab("assets")}
                >
                  <Text className="text-white font-bold">Recalculate</Text>
                </TouchableOpacity>
              </View>

              {/* Information Section */}
              <View className="bg-gray-800/80 rounded-xl p-4 mb-6">
                <Text className="text-white text-base font-semibold mb-2">About Zakat</Text>
                <Text className="text-gray-400 text-xs">
                  Zakat is one of the five pillars of Islam, requiring Muslims to give 2.5% of their
                  qualifying wealth to those in need. It's calculated annually on assets held for one
                  lunar year (Hawl) and is only obligatory if your wealth exceeds the Nisab threshold.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}