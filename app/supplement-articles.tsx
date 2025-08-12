import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SUPPLEMENT_ARTICLES, getArticlesByCategory } from '@/constants/SupplementArticles';

const CATEGORIES = [
  { name: '전체', width: 80 },
  { name: '면역 건강', width: 100 },
  { name: '스트레스 관리', width: 120 },
  { name: '시니어 건강', width: 110 }
];

export default function SupplementArticlesList() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredArticles = selectedCategory === '전체' 
    ? SUPPLEMENT_ARTICLES 
    : getArticlesByCategory(selectedCategory);

  const renderArticleCard = ({ item: article }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => router.push(`/supplement-article/${article.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.articleImageContainer}>
        <View style={styles.articleImagePlaceholder}>
          <Text style={styles.articleEmoji}>💊</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
      </View>
      
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.articleExcerpt} numberOfLines={3}>{article.excerpt}</Text>
        
        <View style={styles.articleMeta}>
          <View style={styles.authorInfo}>
            <Ionicons name="person-circle-outline" size={16} color={Colors.mediumGray} />
            <Text style={styles.authorName}>{article.author}</Text>
          </View>
          <View style={styles.metaInfo}>
            <Text style={styles.publishedDate}>{article.publishedAt}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.readTime}>{article.readTime} 읽기</Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {article.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>영양제 가이드</Text>
        <View style={styles.headerButton} />
      </View>

      {/* 서브 헤더 */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>전문가가 추천하는</Text>
        <Text style={styles.subHeaderSubtitle}>맞춤 영양제 가이드</Text>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScrollView}
        contentContainerStyle={styles.categoriesContainer}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[
              styles.categoryButton,
              { width: category.width },
              selectedCategory === category.name && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category.name)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category.name && styles.categoryButtonTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 아티클 목록 */}
      <FlatList
        data={filteredArticles}
        renderItem={renderArticleCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articlesContainer}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  subHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.card,
  },
  subHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  subHeaderSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  categoriesScrollView: {
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 76,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    height: 76,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: Colors.lightGray,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  articlesContainer: {
    padding: 20,
  },
  articleCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  articleImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  articleImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
  articleEmoji: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.primary + '90',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  articleExcerpt: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 13,
    color: Colors.mediumGray,
    fontWeight: '500',
    marginLeft: 6,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishedDate: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
  metaDot: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginHorizontal: 6,
  },
  readTime: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
});