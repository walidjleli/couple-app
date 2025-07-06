import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class WallScreen extends StatefulWidget {
  final String coupleId;
  final String userId;

  const WallScreen({required this.coupleId, required this.userId, super.key});

  @override
  State<WallScreen> createState() => _WallScreenState();
}

class _WallScreenState extends State<WallScreen> {
  final contentController = TextEditingController();
  bool isLoading = false;
  List posts = [];


  final String backendUrl = 'http://localhost:5000'; 

  Future<void> loadPosts() async {
    try {
      final response = await http.get(
        Uri.parse('$backendUrl/api/posts/${widget.coupleId}'),
      );

      if (response.statusCode == 200) {
        setState(() {
          posts = jsonDecode(response.body);
        });
      } else {
        print('Erreur: ${response.statusCode}');
      }
    } catch (e) {
      print('Erreur chargement des posts : $e');
    }
  }

  Future<void> addPost() async {
    final content = contentController.text.trim();
    if (content.isEmpty) return;

    setState(() => isLoading = true);

    try {
      final response = await http.post(
        Uri.parse('$backendUrl/api/posts/${widget.coupleId}'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'coupleId': widget.coupleId,
          'content': content,
          'createdBy': widget.userId,
        }),
      );

      if (response.statusCode == 201) {
        contentController.clear();
        await loadPosts(); // recharge les posts
      } else {
        print('Erreur post: ${response.statusCode}');
      }
    } catch (e) {
      print('Erreur création post : $e');
    }

    setState(() => isLoading = false);
  }

  @override
  void initState() {
    super.initState();
    loadPosts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Mur du couple")),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                TextField(
                  controller: contentController,
                  decoration: InputDecoration(labelText: "Exprimez-vous 💬"),
                ),
                SizedBox(height: 10),
                isLoading
                    ? CircularProgressIndicator()
                    : ElevatedButton(
                        onPressed: addPost, child: Text("Publier")),
              ],
            ),
          ),
          Divider(),
          Expanded(
            child: ListView.builder(
              itemCount: posts.length,
              itemBuilder: (context, index) {
                final post = posts[index];
                return ListTile(
                  title: Text(post['content']),
                  subtitle: Text("Posté le ${post['createdAt'] ?? ''}"),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
