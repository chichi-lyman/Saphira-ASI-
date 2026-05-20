import 'dart:async';
import '../speech/tts_service.dart';

class ChatMessage {
  final String id;
  final String text;
  final bool isUser;
  final DateTime timestamp;

  ChatMessage({
    required this.id,
    required this.text,
    required this.isUser,
    required this.timestamp,
  });
}

class ChatService {
  // In a full production flutter app, this would connect to Firebase Firestore or SQFLite.
  // We use an in-memory stream controller for this demonstration.
  final List<ChatMessage> _messages = [];
  final StreamController<List<ChatMessage>> _controller = StreamController<List<ChatMessage>>.broadcast();

  Stream<List<ChatMessage>> get messagesStream => _controller.stream;

  void sendMessage(String text) {
    if (text.isEmpty) return;

    // Record user message
    _messages.add(ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      text: text,
      isUser: true,
      timestamp: DateTime.now(),
    ));
    _controller.add(List.from(_messages));

    // Simulate Saphira AI processing lag and response
    Future.delayed(const Duration(milliseconds: 1500), () {
      final response = "I have synthesized your directive regarding '$text'. Variables have been aligned securely.";
      _messages.add(ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        text: response,
        isUser: false,
        timestamp: DateTime.now(),
      ));
      _controller.add(List.from(_messages));
      
      // Execute text-to-speech
      TTSService().speak(response);
    });
  }

  void clearHistory() {
    _messages.clear();
    _controller.add(List.from(_messages));
  }
  
  void dispose() {
    _controller.close();
  }
}
