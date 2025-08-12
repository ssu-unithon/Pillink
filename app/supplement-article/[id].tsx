import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { getArticleById } from '@/constants/SupplementArticles';

export default function SupplementArticleDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const article = getArticleById(id as string);

  if (!article) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>아티클을 찾을 수 없습니다.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSupplementPress = (supplementId: string) => {
    // 영양제 상세 정보나 구매 링크로 이동
    console.log('영양제 상세:', supplementId);
  };

  const handleShare = () => {
    // 공유 기능 구현
    console.log('아티클 공유');
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <Text style={styles.contentText}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // **텍스트** 형식을 볼드로 렌더링
            const boldText = part.slice(2, -2);
            return (
              <Text key={index} style={styles.boldText}>
                {boldText}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/');
          }
        }} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>영양제 가이드</Text>
        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 아티클 헤더 */}
        <View style={styles.articleHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>{article.subtitle}</Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.authorInfo}>
              <View style={styles.authorAvatar}>
                <Ionicons name="person" size={20} color={Colors.primary} />
              </View>
              <View style={styles.authorDetails}>
                <Text style={styles.authorName}>{article.author}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.publishedDate}>{article.publishedAt}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.readTime}>{article.readTime} 읽기</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 태그 */}
        <View style={styles.tagsContainer}>
          {article.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* 아티클 내용 */}
        <View style={styles.contentContainer}>
          {renderFormattedText(article.content)}
        </View>

        {/* 추천 영양제 섹션 */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>💊 추천 영양제</Text>
          <Text style={styles.sectionSubtitle}>
            전문가가 엄선한 고품질 영양제를 확인해보세요
          </Text>
          
          {article.recommendations.map((supplement, index) => (
            <TouchableOpacity
              key={supplement.id}
              style={styles.supplementCard}
              onPress={() => handleSupplementPress(supplement.id)}
              activeOpacity={0.8}
            >
              <View style={styles.supplementHeader}>
                <View style={styles.supplementIcon}>
                  <Ionicons name="medical" size={24} color={Colors.primary} />
                </View>
                <View style={styles.supplementInfo}>
                  <Text style={styles.supplementName}>{supplement.name}</Text>
                  <Text style={styles.supplementDescription}>{supplement.description}</Text>
                </View>
                {supplement.price && (
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>{supplement.price}</Text>
                  </View>
                )}
              </View>

              <View style={styles.supplementDetails}>
                <View style={styles.dosageInfo}>
                  <View style={styles.dosageRow}>
                    <Text style={styles.dosageLabel}>복용법:</Text>
                    <Text style={styles.dosageValue}>{supplement.dosage}</Text>
                  </View>
                  <View style={styles.dosageRow}>
                    <Text style={styles.dosageLabel}>복용시간:</Text>
                    <Text style={styles.dosageValue}>{supplement.timing}</Text>
                  </View>
                </View>

                {/* 효능 */}
                <View style={styles.benefitsContainer}>
                  <Text style={styles.benefitsTitle}>주요 효능</Text>
                  <View style={styles.benefitsList}>
                    {supplement.benefits.map((benefit, idx) => (
                      <View key={idx} style={styles.benefitItem}>
                        <Text style={styles.benefitBullet}>✓</Text>
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 주의사항 */}
                <View style={styles.precautionsContainer}>
                  <Text style={styles.precautionsTitle}>주의사항</Text>
                  <View style={styles.precautionsList}>
                    {supplement.precautions.map((precaution, idx) => (
                      <View key={idx} style={styles.precautionItem}>
                        <Text style={styles.precautionBullet}>⚠️</Text>
                        <Text style={styles.precautionText}>{precaution}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 면책 조항 */}
        <View style={styles.disclaimerContainer}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.mediumGray} />
            <Text style={styles.disclaimerTitle}>의학적 면책 조항</Text>
          </View>
          <Text style={styles.disclaimerText}>
            본 내용은 일반적인 건강 정보 제공을 목적으로 하며, 개별적인 의학적 조언을 대체할 수 없습니다. 
            영양제 복용 전 의사나 약사와 상담하시기 바랍니다.
          </Text>
        </View>

        {/* 관련 아티클 */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>📚 관련 아티클</Text>
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => router.push('/supplement-articles')}
          >
            <Text style={styles.viewMoreText}>더 많은 건강 정보 보기</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  articleHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.card,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  metaInfo: {
    marginTop: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  publishedDate: {
    fontSize: 13,
    color: Colors.mediumGray,
  },
  metaDot: {
    fontSize: 13,
    color: Colors.mediumGray,
    marginHorizontal: 8,
  },
  readTime: {
    fontSize: 13,
    color: Colors.mediumGray,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 26,
    color: Colors.text,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.text,
  },
  recommendationsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.card,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  supplementCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supplementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  supplementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  supplementDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  supplementDetails: {
    marginTop: 8,
  },
  dosageInfo: {
    backgroundColor: Colors.lightGray + '50',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  dosageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dosageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    width: 80,
  },
  dosageValue: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  benefitsList: {
    marginLeft: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  benefitBullet: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
    marginRight: 8,
    marginTop: 2,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  precautionsContainer: {
    marginBottom: 8,
  },
  precautionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  precautionsList: {
    marginLeft: 8,
  },
  precautionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  precautionBullet: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  precautionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  disclaimerContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.lightGray + '30',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.mediumGray,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.mediumGray,
    marginLeft: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  relatedSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.card,
    marginTop: 8,
    marginBottom: 20,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});