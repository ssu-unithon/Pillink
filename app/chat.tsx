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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '안녕하세요! 저는 PillLink AI입니다 🤖\n약물 복용, 부작용, 상호작용에 대해 궁금한 점이 있으시면 언제든 물어보세요!',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const scrollButtonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scrollButtonAnim, {
        toValue: showScrollToBottom ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
    }).start();
  }, [showScrollToBottom]);

  const quickQuestions = [
    '💊 약물 상호작용이 궁금해요',
    '⚠️ 부작용 증상을 확인하고 싶어요',
    '⏰ 복용 시간을 조정하고 싶어요',
    '🍽️ 음식과 함께 먹어도 되나요?',
  ];

  const handleSendMessage = (text: string, isQuickQuestion = false) => {
    const content = text.trim();
    if (!content) return;

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

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(content),
        isUser: false,
        timestamp: new Date(),
      };
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const getAIResponse = (userText: string): string => {
    const text = userText.toLowerCase();

    if (text.includes('상호작용') || text.includes('같이') || text.includes('함께')) {
      return '약물 상호작용에 대해 문의해주셨네요! 🔍\n\n현재 복용 중인 약물들을 알려주시면 더 정확한 상호작용 정보를 제공해드릴 수 있습니다.\n\n⚠️ 중요: 이 정보는 참고용이며, 정확한 진단과 처방은 의사나 약사와 상담하시기 바랍니다.';
    }

    if (text.includes('부작용') || text.includes('증상')) {
      return '부작용 증상에 대해 궁금하시군요! 💡\n\n어떤 약물의 부작용이 궁금하신가요? 구체적인 약물명을 알려주시면 해당 약물의 주요 부작용과 대처법을 안내해드리겠습니다.\n\n🚨 심각한 부작용이 의심되시면 즉시 의료진과 상담하세요.';
    }

    if (text.includes('시간') || text.includes('언제')) {
      return '복용 시간에 대해 문의해주셨네요! ⏰\n\n대부분의 약물은 일정한 시간 간격으로 복용하는 것이 중요합니다.\n\n• 하루 1회: 매일 같은 시간\n• 하루 2회: 12시간 간격\n• 하루 3회: 8시간 간격\n\n구체적인 약물명을 알려주시면 더 정확한 복용법을 안내해드릴게요!';
    }

    if (text.includes('음식') || text.includes('식사')) {
      return '음식과의 복용에 대해 궁금하시군요! 🍽️\n\n약물마다 음식과의 상호작용이 다릅니다:\n\n• 식전 복용: 위산 분비 전, 흡수율 높임\n• 식후 복용: 위장 보호, 부작용 감소\n• 공복 복용: 빠른 흡수 필요시\n\n어떤 약물에 대해 궁금하신가요?';
    }

    return '질문해주셔서 감사합니다! 😊\n\n더 정확한 답변을 위해 구체적인 약물명이나 상황을 알려주시면 좋겠어요.\n\n약물 상호작용, 부작용, 복용법 등 무엇이든 물어보세요!\n\n💡 언제나 전문의와의 상담을 우선으로 하시기 바랍니다.';
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
                {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} onLongPress={handleLongPress} />
                ))}
                {isTyping && <TypingIndicator />}
            </ScrollView>
            <Animated.View style={[styles.scrollToBottomButton, {opacity: scrollButtonAnim, transform: [{scale: scrollButtonAnim}]}]}>
                <TouchableOpacity onPress={scrollToBottom}>
                    <Ionicons name="arrow-down-circle" size={40} color={Colors.light.primary} />
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
            <View style={[styles.inputWrapper, { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 8}]}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="약물에 대해 궁금한 점을 물어보세요..."
                placeholderTextColor={Colors.light.mediumGray}
                multiline
                maxLength={500}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: inputText.trim() ? Colors.light.primary : Colors.light.lightGray },
                ]}
                onPress={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-up" size={20} color={inputText.trim() ? '#fff' : Colors.light.mediumGray} />
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
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  aiAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primaryLight,
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
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.light.secondary,
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
    backgroundColor: Colors.light.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  aiMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: Colors.light.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.light.mediumGray,
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
    backgroundColor: Colors.light.mediumGray,
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
    color: Colors.light.text,
    marginBottom: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quickQuestionText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
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
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.light.border,
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
  }
});
