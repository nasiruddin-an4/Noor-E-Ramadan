import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  Animated,
  Share,
  TextInput,
  ScrollView,
  Clipboard,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HadithDisplay() {
  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedHadith, setExpandedHadith] = useState(null);
  const [filterGrade, setFilterGrade] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const flatListRef = useRef(null);
  const colorScheme = useColorScheme(); // Detect system color scheme

  // Animation value for hadith expansion
  const animatedHeight = new Animated.Value(0);

  // Define light and dark mode colors
  const colors = {
    light: {
      background: '#F9FAFB',
      cardBackground: '#FFFFFF',
      text: '#1F2937',
      primary: '#4F46E5',
      secondary: '#6B7280',
      border: '#E5E7EB',
      error: '#DC2626',
      success: '#10B981',
      warning: '#F59E0B',
    },
    dark: {
      background: '#111827',
      cardBackground: '#1F2937',
      text: '#F9FAFB',
      primary: '#818CF8',
      secondary: '#9CA3AF',
      border: '#374151',
      error: '#EF4444',
      success: '#34D399',
      warning: '#FBBF24',
    },
  };

  const theme = colors[colorScheme]; // Current theme based on color scheme

  const fetchHadiths = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ben-abudawud.json'
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setHadiths(data.hadiths);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHadiths();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHadiths();
  }, []);

  const toggleExpand = (hadithNumber) => {
    setExpandedHadith(expandedHadith === hadithNumber ? null : hadithNumber);
    
    Animated.timing(animatedHeight, {
      toValue: expandedHadith === hadithNumber ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleFavorite = (hadithNumber) => {
    if (favorites.includes(hadithNumber)) {
      setFavorites(favorites.filter(id => id !== hadithNumber));
    } else {
      setFavorites([...favorites, hadithNumber]);
    }
  };

  const shareHadith = async (hadith) => {
    try {
      await Share.share({
        message: `Hadith #${hadith.hadithnumber} from Sunan Abu Dawud:\n\n${hadith.text}\n\nGrade: ${hadith.grades.map(g => g.grade).join(', ')}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    alert('Hadith copied to clipboard!');
  };

  const filterHadiths = () => {
    let filtered = hadiths;
    
    // Filter by grade if selected
    if (filterGrade) {
      filtered = filtered.filter((hadith) =>
        hadith.grades.some((grade) =>
          grade.grade.toLowerCase().includes(filterGrade.toLowerCase())
        )
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((hadith) =>
        hadith.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by favorites if showing only favorites
    if (showOnlyFavorites) {
      filtered = filtered.filter((hadith) => 
        favorites.includes(hadith.hadithnumber)
      );
    }
    
    return filtered;
  };

  const setActiveFilter = (tab, grade = null) => {
    setActiveTab(tab);
    setFilterGrade(grade);
    setShowOnlyFavorites(tab === 'favorites');
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <View style={{ backgroundColor: theme.cardBackground, padding: 32, borderRadius: 16, shadowColor: theme.text, shadowOpacity: 0.1, shadowRadius: 10 }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 16, fontSize: 18, color: theme.text, textAlign: 'center' }}>Loading Hadiths...</Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: theme.secondary, textAlign: 'center' }}>Please wait while we retrieve the collection</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, padding: 24 }}>
        <View style={{ backgroundColor: theme.cardBackground, padding: 32, borderRadius: 16, shadowColor: theme.text, shadowOpacity: 0.1, shadowRadius: 10, width: '80%', alignItems: 'center' }}>
          <Ionicons name="alert-circle" size={64} color={theme.error} />
          <Text style={{ fontSize: 24, color: theme.error, fontWeight: 'bold', marginTop: 16 }}>Error Loading Data</Text>
          <Text style={{ fontSize: 18, color: theme.text, textAlign: 'center', marginTop: 8, marginBottom: 24 }}>{error}</Text>
          <TouchableOpacity
            style={{ marginTop: 8, backgroundColor: theme.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, width: '100%', alignItems: 'center' }}
            onPress={fetchHadiths}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const filteredHadiths = filterHadiths();

  const renderHadithItem = ({ item }) => {
    const isFavorite = favorites.includes(item.hadithnumber);
    const isExpanded = expandedHadith === item.hadithnumber;
    
    return (
      <View style={{ marginBottom: 16, backgroundColor: theme.cardBackground, borderRadius: 12, shadowColor: theme.text, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: isExpanded ? 1 : 0, borderColor: theme.primary }}>
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, backgroundColor: theme.primary + '20', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ color: theme.primary, fontWeight: 'bold' }}>{item.hadithnumber}</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>
                Hadith #{item.hadithnumber}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity 
                onPress={() => toggleFavorite(item.hadithnumber)}
                style={{ padding: 8 }}
              >
                <Ionicons
                  name={isFavorite ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isFavorite ? theme.primary : theme.secondary}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => shareHadith(item)}
                style={{ padding: 8 }}
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={theme.secondary}
                />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => copyToClipboard(item.text)}
                style={{ padding: 8 }}
              >
                <Ionicons
                  name="copy-outline"
                  size={20}
                  color={theme.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={() => toggleExpand(item.hadithnumber)}
            style={{ activeOpacity: 0.8, borderRadius: 8, padding: 8, margin: -8 }}
          >
            <Text style={{ color: theme.text, lineHeight: 24 }}>
              {isExpanded ? item.text : `${item.text.substring(0, 120)}...`}
            </Text>
            
            {item.grades && item.grades.length > 0 && isExpanded && (
              <View style={{ marginTop: 16, flexDirection: 'row', flexWrap: 'wrap' }}>
                {item.grades.map((grade, index) => (
                  <View 
                    key={index} 
                    style={{ 
                      marginRight: 8, 
                      marginBottom: 8, 
                      paddingHorizontal: 12, 
                      paddingVertical: 6, 
                      borderRadius: 20,
                      backgroundColor: 
                        grade.grade.toLowerCase().includes('sahih') ? theme.success + '20' : 
                        grade.grade.toLowerCase().includes('hasan') ? theme.primary + '20' : 
                        theme.warning + '20',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 14, 
                      fontWeight: '500', 
                      color: 
                        grade.grade.toLowerCase().includes('sahih') ? theme.success : 
                        grade.grade.toLowerCase().includes('hasan') ? theme.primary : 
                        theme.warning,
                    }}>
                      {grade.grade}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 }}>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.primary}
              />
              <Text style={{ color: theme.primary, marginLeft: 4, fontSize: 14 }}>
                {isExpanded ? "Show less" : "Read more"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar backgroundColor={colorScheme === 'dark' ? '#1F2937' : '#4F46E5'} barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={{ backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 16, shadowColor: theme.text, shadowOpacity: 0.1, shadowRadius: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#FFFFFF" />
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>Sunan Abu Dawud</Text>
          <TouchableOpacity onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}>
            <Ionicons name="bookmark" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>


      {/* Filter Tabs */}
      <View style={{ backgroundColor: theme.cardBackground, shadowColor: theme.text, shadowOpacity: 0.1, shadowRadius: 10 }}>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}
        >
          <TouchableOpacity
            style={{ paddingHorizontal: 10, paddingVertical: 12, marginRight: 5, borderBottomWidth: activeTab === 'all' ? 2 : 0, borderBottomColor: theme.primary }}
            onPress={() => setActiveFilter('all', null)}
          >
            <Text style={{ fontWeight: '500', color: activeTab === 'all' ? theme.primary : theme.secondary }}>
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 12, marginRight: 8, borderBottomWidth: activeTab === 'sahih' ? 2 : 0, borderBottomColor: theme.primary }}
            onPress={() => setActiveFilter('sahih', 'sahih')}
          >
            <Text style={{ fontWeight: '500', color: activeTab === 'sahih' ? theme.primary : theme.secondary }}>
              Sahih
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 12, marginRight: 8, borderBottomWidth: activeTab === 'hasan' ? 2 : 0, borderBottomColor: theme.primary }}
            onPress={() => setActiveFilter('hasan', 'hasan')}
          >
            <Text style={{ fontWeight: '500', color: activeTab === 'hasan' ? theme.primary : theme.secondary }}>
              Hasan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 12, marginRight: 8, borderBottomWidth: activeTab === 'daif' ? 2 : 0, borderBottomColor: theme.primary }}
            onPress={() => setActiveFilter('daif', 'daif')}
          >
            <Text style={{ fontWeight: '500', color: activeTab === 'daif' ? theme.primary : theme.secondary }}>
              Daif
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{ paddingHorizontal: 16, paddingVertical: 12, marginRight: 8, borderBottomWidth: activeTab === 'favorites' ? 2 : 0, borderBottomColor: theme.primary }}
            onPress={() => setActiveFilter('favorites')}
          >
            <Text style={{ fontWeight: '500', color: activeTab === 'favorites' ? theme.primary : theme.secondary }}>
              Favorites
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Hadith Count */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.background, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: theme.text }}>
            Showing <Text style={{ fontWeight: 'bold' }}>{filteredHadiths.length}</Text> hadiths
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={onRefresh}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Ionicons name="refresh" size={16} color={theme.primary} style={{ marginRight: 4 }} />
          <Text style={{ color: theme.primary, fontWeight: '500' }}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Hadith List */}
      <FlatList
        ref={flatListRef}
        data={filteredHadiths}
        renderItem={renderHadithItem}
        keyExtractor={(item) => item.hadithnumber.toString()}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: theme.cardBackground, borderRadius: 12, shadowColor: theme.text, shadowOpacity: 0.1, shadowRadius: 10, padding: 24, marginTop: 8 }}>
            <Ionicons name="search-outline" size={64} color={theme.secondary} />
            <Text style={{ marginTop: 16, fontSize: 18, color: theme.text, textAlign: 'center', fontWeight: '500' }}>
              {showOnlyFavorites
                ? "You haven't saved any favorites yet"
                : searchQuery
                ? "No hadiths match your search"
                : "No hadiths match your filter"}
            </Text>
            <Text style={{ marginTop: 8, fontSize: 14, color: theme.secondary, textAlign: 'center', marginBottom: 24 }}>
              {showOnlyFavorites
                ? "Bookmark hadiths you want to revisit later"
                : searchQuery
                ? "Try different keywords or clear your search"
                : "Try selecting a different category"}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 8, backgroundColor: theme.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center' }}
              onPress={() => {
                setSearchQuery('');
                setActiveFilter('all', null);
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '500' }}>Show All Hadiths</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Quick Actions Floating Button */}
      <View style={{ position: 'absolute', bottom: 24, right: 24 }}>
        <TouchableOpacity
          style={{ width: 56, height: 56, backgroundColor: theme.primary, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: theme.text, shadowOpacity: 0.2, shadowRadius: 10 }}
          onPress={scrollToTop}
        >
          <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}