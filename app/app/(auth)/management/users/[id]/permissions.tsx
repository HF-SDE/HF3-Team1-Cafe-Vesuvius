import { StyleSheet, View, Text } from "react-native";
import TemplateLayout from "@/components/TemplateLayout";

export default function PermissionPage() {
  return (
    <TemplateLayout
      pageName="ManagementPage"
      title="Permissions"
      buttonTitle="Cancel"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Manage User Permissions</Text>
        <Text>Here you can edit permissions for users.</Text>
      </View>
    </TemplateLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
