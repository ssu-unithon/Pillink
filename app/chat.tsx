import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  LayoutAnimation,
  UIManager,
  Alert,
  Clipboard,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { Colors } from '@/constants/Colors';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatService, { ChatMessage } from '@/services/ChatService';
import { useFocusEffect } from 'expo-router';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// --- Memoized MessageItem for Performance ---
const MessageItem = memo(({ message, onLongPress }: { message: Message, onLongPress: (text: string) => void }) => {
  return (
    <TouchableOpacity onLongPress={() => onLongPress(message.text)} activeOpacity={0.8}>
        <View
        style={[
            styles.messageWrapper,
            message.isUser ? styles.userMessageWrapper : styles.aiMessageWrapper,
        ]}
        >
        <View
            style={[
            styles.messageBubble,
            message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
        >
            <Text
            style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText,
            ]}
            >
            {message.text}
            </Text>
        </View>
        <Text
            style={[
            styles.messageTime,
            message.isUser ? styles.userMessageTime : styles.aiMessageTime,
            ]}
        >
            {formatTime(message.timestamp)}
        </Text>
        </View>
    </TouchableOpacity>
  );
});

// --- Typing Indicator ---
const TypingIndicator = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot: Animated.Value, delay: number) => Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true })
        ]);

        Animated.loop(
            Animated.parallel([animate(dot1, 0), animate(dot2, 200), animate(dot3, 400)])
        ).start();
    }, []);

    const dotStyle = (anim: Animated.Value) => ({
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }]
    });

    return (
        <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
            <View style={[styles.messageBubble, styles.aiMessage, styles.typingMessage]}>
                <View style={styles.typingIndicator}>
                    <Animated.View style={[styles.typingDot, dotStyle(dot1)]} />
                    <Animated.View style={[styles.typingDot, dotStyle(dot2)]} />
                    <Animated.View style={[styles.typingDot, dotStyle(dot3)]} />
                </View>
            </View>
        </View>
    );
};


export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const scrollButtonAnim = useRef(new Animated.Value(0)).current;

  // 채팅 히스토리 로드
  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const chatHistory = await ChatService.getChatHistory();
      console.log('💬 Chat history loaded:', chatHistory.length, 'messages');
      
      // API 데이터를 앱의 Message 형식으로 변환
      const convertedMessages: Message[] = chatHistory.map((msg: ChatMessage) => ({
        id: msg.id.toString(),
        text: msg.content,
        isUser: msg.sender_type === 'user',
        timestamp: new Date(msg.createdAt)
      }));
      
      // 기본 웰컴 메시지가 없으면 추가
      if (convertedMessages.length === 0) {
        convertedMessages.unshift({
          id: 'welcome',
          text: '안녕하세요! 저는 PillLink AI입니다 🤖\n약물 복용, 부작용, 상호작용에 대해 궁금한 점이 있으시면 언제든 물어보세요!',
          isUser: false,
          timestamp: new Date(),
        });
      }
      
      setMessages(convertedMessages);
    } catch (error: any) {
      console.error('❌ Failed to load chat history:', error);
      
      // 에러 유형별 메시지 설정
      let errorMessage = '채팅 기록을 불러오는데 실패했습니다.';
      
      if (error.message?.includes('네트워크 연결')) {
        errorMessage = '네트워크 연결을 확인해주세요.';
      } else if (error.message?.includes('401') || error.message?.includes('인증')) {
        errorMessage = '로그인이 필요합니다. 설정에서 다시 로그인해주세요.';
      } else if (error.message?.includes('404')) {
        // 404는 채팅 기록이 없다는 의미일 수 있으므로 에러로 처리하지 않음
        errorMessage = '';
      }
      
      if (errorMessage) {
        setError(errorMessage);
      }
      
      // 에러 발생 시 기본 웰컴 메시지 표시
      setMessages([{
        id: 'welcome',
        text: '안녕하세요! 저는 PillLink AI입니다 🤖\n약물 복용, 부작용, 상호작용에 대해 궁금한 점이 있으시면 언제든 물어보세요!\n\n💡 채팅 기록이 없어 새로운 대화를 시작합니다.',
        isUser: false,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 화면 포커스 시 채팅 히스토리 로드
  useFocusEffect(
    React.useCallback(() => {
      loadChatHistory();
    }, [])
  );

  useEffect(() => {
    Animated.timing(scrollButtonAnim, {
        toValue: showScrollToBottom ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
    }).start();
  }, [showScrollToBottom]);

  const quickQuestions = [
    '💊 내 약물 상호작용을 분석해주세요',
    '⚠️ 부작용 증상을 확인하고 싶어요',
    '⏰ 복용 시간을 조정하고 싶어요',
    '🍽️ 음식과 함께 먹어도 되나요?',
  ];

  const handleSendMessage = async (text: string, isQuickQuestion = false) => {
    const content = text.trim();
    if (!content || isTyping) return;

    if (isQuickQuestion) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: content,
      isUser: true,
      timestamp: new Date(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, userMessage]);
    if (!isQuickQuestion) setInputText('');
    
    setIsTyping(true);
    setError(null);

    try {
      console.log('🔄 Sending message to AI:', content);
      
      // 약물 상호작용 분석 요청인지 확인
      if (content.includes('상호작용을 분석') || content.includes('상호작용 분석')) {
        await handleDrugInteractionAnalysis();
        return;
      }
      
      // API를 통해 메시지 전송
      const aiResponse = await ChatService.sendMessage(content);
      console.log('✅ AI response received:', aiResponse);
      
      const aiMessage: Message = {
        id: aiResponse.id.toString(),
        text: aiResponse.content,
        isUser: false,
        timestamp: new Date(aiResponse.createdAt),
      };
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, aiMessage]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (error: any) {
      console.error('❌ Failed to send message:', error);
      
      // 에러 유형별 맞춤 응답
      let errorText = '죄송합니다. 현재 서비스에 일시적인 문제가 발생했습니다.';
      
      if (error.message?.includes('네트워크 연결')) {
        errorText = '네트워크 연결을 확인해주세요.\n\n📶 WiFi 또는 모바일 데이터 연결 상태를 확인하거나 잠시 후 다시 시도해주세요.';
      } else if (error.message?.includes('401') || error.message?.includes('인증')) {
        errorText = '로그인이 만료되었습니다.\n\n🔐 설정에서 다시 로그인해주세요.';
      } else if (error.message?.includes('400')) {
        errorText = '요청 형식에 오류가 있습니다.\n\n🔧 앱을 최신 버전으로 업데이트하거나 개발자에게 문의해주세요.\n\n기술적 오류: API 요청 파라미터 문제';
      } else if (error.message?.includes('500')) {
        errorText = '서버에 일시적인 문제가 발생했습니다.\n\n⚙️ 서버 복구 중이니 잠시 후 다시 시도해주세요.';
      } else if (error.message?.includes('404')) {
        errorText = 'API 엔드포인트를 찾을 수 없습니다.\n\n🔧 앱을 최신 버전으로 업데이트해주세요.';
      } else {
        errorText = '알 수 없는 오류가 발생했습니다.\n\n🔄 앱을 재시작하거나 잠시 후 다시 시도해주세요.';
      }
      
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, fallbackResponse]);
      setError(error.message || '메시지 전송에 실패했습니다.');
    } finally {
      setIsTyping(false);
    }
  };

  // 약물 상호작용 분석 처리
  const handleDrugInteractionAnalysis = async () => {
    try {
      console.log('🔍 Performing drug interaction analysis...');
      
      const analysis = await ChatService.getDrugInteractionAnalysis();
      console.log('📊 Drug interaction analysis result:', analysis);
      
      const riskInfo = ChatService.getRiskLevel(analysis.riskRate);
      
      // 분석 결과를 포맷팅
      let analysisText = `🔍 **약물 상호작용 분석 결과**\n\n`;
      
      analysisText += `📊 **전체 위험도: ${analysis.riskRate}% (${riskInfo.text})**\n`;
      analysisText += `💊 **분석된 약물 수:** ${analysis.count}개\n`;
      analysisText += `⚠️ **상호작용 쌍:** ${analysis.pairCount}개\n\n`;
      
      if (analysis.duplicateCount > 0) {
        analysisText += `🔄 **중복 성분 발견:** ${analysis.duplicateCount}개\n`;
        analysisText += `• ${analysis.duplicates.join(', ')}\n\n`;
      }
      
      if (analysis.collisionCount > 0) {
        analysisText += `⚡ **위험한 상호작용:** ${analysis.collisionCount}개\n`;
        analysisText += `• ${analysis.collisions.join(', ')}\n\n`;
      }
      
      if (analysis.warnings.length > 0) {
        analysisText += `⚠️ **주의사항:**\n`;
        analysis.warnings.forEach((warning, index) => {
          analysisText += `${index + 1}. ${warning.type} ${warning.ingredient}`;
          if (warning.reason) {
            analysisText += ` - ${warning.reason}`;
          }
          analysisText += '\n';
        });
        analysisText += '\n';
      }
      
      if (analysis.errors.length > 0) {
        analysisText += `❌ **오류:**\n• ${analysis.errors.join('\n• ')}\n\n`;
      }
      
      analysisText += `💡 **권장사항:**\n`;
      if (analysis.riskRate >= 70) {
        analysisText += `• 즉시 의사 또는 약사와 상담하세요\n• 약물 복용을 중단하고 전문가의 조언을 구하세요`;
      } else if (analysis.riskRate >= 40) {
        analysisText += `• 의사 또는 약사와 상담하여 복용법을 조정하세요\n• 복용 시간을 조절하거나 용량을 변경할 필요가 있을 수 있습니다`;
      } else {
        analysisText += `• 현재 복용 중인 약물들은 비교적 안전합니다\n• 정기적인 검진을 통해 지속적으로 모니터링하세요`;
      }
      
      analysisText += `\n\n⚠️ **중요:** 이 분석은 참고용이며, 정확한 진단과 처방은 의료 전문가와 상담하시기 바랍니다.`;
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        text: analysisText,
        isUser: false,
        timestamp: new Date(),
      };
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, analysisMessage]);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
    } catch (error: any) {
      console.error('❌ Failed to analyze drug interactions:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: '죄송합니다. 약물 상호작용 분석 중 오류가 발생했습니다.\n\n현재 등록된 약물이 없거나 서비스에 일시적인 문제가 있을 수 있습니다.\n\n약물을 먼저 등록하시거나 잠시 후 다시 시도해주세요.',
        isUser: false,
        timestamp: new Date(),
      };
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setShowScrollToBottom(!isAtBottom);
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleLongPress = (text: string) => {
    Clipboard.setString(text);
    Alert.alert('복사 완료', '메시지가 클립보드에 복사되었습니다.');
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.aiAvatar}>
          <Text style={styles.aiAvatarText}>🤖</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>PillLink AI</Text>
          <Text style={styles.headerSubtitle}>약물 상담 전문 AI • 온라인</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{flex: 1}}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <TypingIndicator />
                    <Text style={styles.loadingText}>채팅 기록을 불러오는 중...</Text>
                  </View>
                ) : (
                  <>
                    {error && (
                      <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={24} color={Colors.danger} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity 
                          style={styles.retryButton}
                          onPress={loadChatHistory}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.retryText}>다시 시도</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    {messages.map((msg) => (
                      <MessageItem key={msg.id} message={msg} onLongPress={handleLongPress} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </>
                )}
            </ScrollView>
            <Animated.View style={[styles.scrollToBottomButton, {opacity: scrollButtonAnim, transform: [{scale: scrollButtonAnim}]}]}>
                <TouchableOpacity onPress={scrollToBottom}>
                    <Ionicons name="arrow-down-circle" size={40} color={Colors.primary} />
                </TouchableOpacity>
            </Animated.View>
        </View>

        <View>
          {messages.length < 3 && (
              <View style={styles.quickQuestionsContainer}>
              <Text style={styles.quickQuestionsTitle}>자주 묻는 질문</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
              {quickQuestions.map((question, index) => (
                  <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => handleSendMessage(question.replace(/^[💊⚠️⏰🍽️]\s/, ''), true)}
                  activeOpacity={0.7}
                  >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                  </TouchableOpacity>
              ))}
              </ScrollView>
              </View>
          )}

          <View style={styles.inputContainer}>
            {error?.includes('네트워크') && (
              <View style={styles.connectionStatus}>
                <Ionicons name="wifi-outline" size={16} color={Colors.danger} />
                <Text style={styles.connectionText}>연결 상태를 확인해주세요</Text>
                <TouchableOpacity onPress={loadChatHistory} style={styles.reconnectButton}>
                  <Text style={styles.reconnectText}>재연결</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={[styles.inputWrapper, { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 8}]}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="약물에 대해 궁금한 점을 물어보세요..."
                placeholderTextColor={Colors.mediumGray}
                multiline
                maxLength={500}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                editable={!isTyping && !error?.includes('로그인')}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: (inputText.trim() && !isTyping) ? Colors.primary : Colors.lightGray },
                ]}
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isTyping || error?.includes('로그인')}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-up" size={20} color={(inputText.trim() && !isTyping) ? '#fff' : Colors.mediumGray} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <BottomNavigationBar activeIndex={3} />
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
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiAvatarText: {
    fontSize: 22,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  aiMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginHorizontal: 8,
  },
  userMessageTime: {
    alignSelf: 'flex-end',
  },
  aiMessageTime: {
    alignSelf: 'flex-end',
  },
  typingMessage: {
    paddingVertical: 12,
    width: 70,
    alignItems: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mediumGray,
  },
  quickQuestionsContainer: {
    paddingTop: 8,
    paddingBottom: 12,
    paddingLeft: 16,
    backgroundColor: '#f9f9f9',
  },
  quickQuestionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickQuestionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,        // 상단 여백 추가
    paddingBottom: 12,     // 하단 여백 고정
    gap: 12,
  },
  inputWrapperFocused: {
    // Add a subtle shadow or border color change on focus
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  scrollToBottomButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      zIndex: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.mediumGray,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  connectionText: {
    fontSize: 14,
    color: Colors.danger,
    marginLeft: 8,
    flex: 1,
  },
  reconnectButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reconnectText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
