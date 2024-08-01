import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useGlobalContext } from "../../context/GlobalProvider";

import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import { router, useLocalSearchParams } from "expo-router";
import { createVideo, SearchPosts } from "../../lib/appwrite";
import SearchInput from "../../components/SearchImput";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import EmptyState from "../../components/EmptyState";

const BookMark = () => {
  const { user } = useGlobalContext();
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => SearchPosts(query));
  const [uploading, setUploading] = useState(false);

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      return Alert.alert("Error", "Please fill all fields");
    }

    setUploading(true);
    try {
      await createVideo({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-2xl text-white font-psemibold">
              Saved Videos
            </Text>

            <Text className="text-2xl font-psemibold text-white">{query}</Text>

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found matching your search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default BookMark;
