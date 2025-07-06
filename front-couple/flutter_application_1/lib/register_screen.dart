import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final partnerEmailController = TextEditingController();
  bool isLoading = false;

  final String backendUrl = 'http://localhost:5000'; 

  Future<void> register() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();
    final partnerEmail = partnerEmailController.text.trim();

    if (email.isEmpty || password.isEmpty || partnerEmail.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Tous les champs sont requis.")),
      );
      return;
    }

    setState(() => isLoading = true);

    try {
      final response = await http.post(
        Uri.parse('$backendUrl/api/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "email": email,
          "password": password,
          "partner_email": partnerEmail
        }),
      );

      setState(() => isLoading = false);

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final coupleId = data["coupleId"];
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Compte créé ! Code envoyé au partenaire.")),
        );

        Navigator.pushNamed(
          context,
          '/confirm',
          arguments: {
            'email': email,
            'coupleId': coupleId,
          },
        );
      } else {
        final error = jsonDecode(response.body)['error'] ?? 'Erreur';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Erreur : $error")),
        );
      }
    } catch (e) {
      setState(() => isLoading = false);
      print('Erreur lors de l’inscription : $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Erreur de connexion au serveur.")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Créer un compte")),
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
            TextField(
              controller: partnerEmailController,
              decoration: InputDecoration(labelText: "Email du partenaire"),
            ),
            SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: register,
                    child: Text("S'inscrire"),
                  ),
          ],
        ),
      ),
    );
  }
}
