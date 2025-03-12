import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { settings, updateSettings } = useStore();

  const toggleNotifications = () => {
    updateSettings({ notifications: !settings.notifications });
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'en' ? 'bn' : 'en' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Ionicons name="notifications" size={24} color="#F59E0B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get reminded before Sehri and Iftar
                </Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: '#475569', true: '#F59E0B' }}
                thumbColor="#F8FAFC"
              />
            </View>

            <Pressable style={styles.settingItem} onPress={toggleLanguage}>
              <View style={styles.settingIcon}>
                <Ionicons name="globe" size={24} color="#F59E0B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Language</Text>
                <Text style={styles.settingDescription}>
                  {settings.language === 'en' ? 'English' : 'বাংলা'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#64748B" />
            </Pressable>

            <Pressable style={styles.settingItem} onPress={toggleTheme}>
              <View style={styles.settingIcon}>
                <Ionicons name="moon" size={24} color="#F59E0B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingDescription}>
                  {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#64748B" />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Version</Text>
                <Text style={styles.settingDescription}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  settingsList: {
    backgroundColor: '#334155',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#94A3B8',
  },
});