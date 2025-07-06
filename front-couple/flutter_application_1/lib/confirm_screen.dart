import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ConfirmScreen extends StatefulWidget {
  const ConfirmScreen({super.key});

  @override
  State<ConfirmScreen> createState() => _ConfirmScreenState();
}

class _ConfirmScreenState extends State<ConfirmScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  String coupleId = '';
  bool isLoading = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)!.settings.arguments as Map?;
    if (args != null && args.containsKey('coupleId')) {
      coupleId = args['coupleId'];
      emailController.text = args['email'] ?? '';
    }
  }

  Future<void> confirm() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty || coupleId.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Tous les champs sont requis.")),
      );
      return;
    }

    setState(() => isLoading = true);

    final response = await http.post(
      Uri.parse('http://localhost:5000/api/register/confirm'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        "email": email,
        "password": password,
        "coupleId": coupleId,
      }),
    );

    if (!mounted) return;
    setState(() => isLoading = false);

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Partenaire confirmé 🎉")),
      );
      Navigator.popUntil(context, ModalRoute.withName('/'));
    } else {
      final error = jsonDecode(response.body)['error'] ?? 'Erreur';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur : $error")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Confirmation du partenaire")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: emailController,
              decoration: InputDecoration(labelText: "Votre email"),
            ),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(labelText: "Mot de passe"),
            ),
            SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(onPressed: confirm, child: Text("Confirmer")),
          ],
        ),
      ),
    );
  }
}
