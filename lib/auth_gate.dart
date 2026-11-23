import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

const _firebaseOptions = FirebaseOptions(
  apiKey: 'AIzaSyB_I37Yxrd_yum1eFQlBuGjtbEd5vUz7rM',
  appId: '1:680348733551:web:994fdab2ed100a6c80bd9a',
  messagingSenderId: '680348733551',
  projectId: 'lugha-22c6c',
  authDomain: 'lugha-22c6c.firebaseapp.com',
  storageBucket: 'lugha-22c6c.firebasestorage.app',
);

/// Restores the existing Lugha Firebase session before opening the workspace.
/// Guest mode remains available and never creates a Firebase account.
class AuthGate extends StatefulWidget {
  const AuthGate({super.key, required this.authenticatedBuilder});
  final Widget Function(BuildContext context, String? email, VoidCallback onSignOut)
      authenticatedBuilder;

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  FirebaseAuth? _auth;
  bool _initializing = true;
  String? _setupError;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  Future<void> _initialize() async {
    try {
      await Firebase.initializeApp(options: _firebaseOptions);
      _auth = FirebaseAuth.instance;
    } catch (e) {
      _setupError = 'Lugha sign-in could not initialize. Check the Firebase app configuration.';
    }
    if (mounted) setState(() => _initializing = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_initializing) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final auth = _auth;
    if (auth == null) {
      return _SignInScreen(
        setupError: _setupError,
        onGuest: () => Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => widget.authenticatedBuilder(context, null, () {})),
        ),
      );
    }
    return StreamBuilder<User?>(
      stream: auth.authStateChanges(),
      initialData: auth.currentUser,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting && !snapshot.hasData) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        final user = snapshot.data;
        if (user == null) {
          return _SignInScreen(
            onGuest: () => Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => widget.authenticatedBuilder(context, null, () {})),
            ),
          );
        }
        return widget.authenticatedBuilder(context, user.email, () async {
          await auth.signOut();
        });
      },
    );
  }
}

class _SignInScreen extends StatefulWidget {
  const _SignInScreen({this.setupError, required this.onGuest});
  final String? setupError;
  final VoidCallback onGuest;

  @override
  State<_SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<_SignInScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _creating = false, _busy = false, _showPassword = false;
  String? _message;
  bool _error = false;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  void _feedback(String message, {bool error = false}) {
    if (!mounted) return;
    setState(() { _message = message; _error = error; });
  }

  Future<void> _run(Future<void> Function() action) async {
    if (_busy) return;
    setState(() { _busy = true; _message = null; });
    try {
      await action();
    } on FirebaseAuthException catch (e) {
      final message = switch (e.code) {
        'invalid-credential' || 'wrong-password' || 'user-not-found' =>
          'Email or password is incorrect.',
        'email-already-in-use' => 'An account already exists for this email.',
        'weak-password' => 'Choose a stronger password (at least 6 characters).',
        'invalid-email' => 'Enter a valid email address.',
        'network-request-failed' => 'Network error. Check your connection and try again.',
        'too-many-requests' => 'Too many attempts. Wait a little and try again.',
        _ => e.message ?? 'Authentication failed. Please try again.',
      };
      _feedback(message, error: true);
    } catch (_) {
      _feedback('Could not complete sign-in. Check your connection and try again.', error: true);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _submit() async {
    final email = _email.text.trim();
    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email)) {
      _feedback('Enter a valid email address.', error: true);
      return;
    }
    if (_password.text.length < 6) {
      _feedback('Use a password of at least 6 characters.', error: true);
      return;
    }
    await _run(() async {
      if (_creating) {
        await FirebaseAuth.instance.createUserWithEmailAndPassword(
          email: email, password: _password.text,
        );
        _feedback('Account created. Welcome to Lugha!');
      } else {
        await FirebaseAuth.instance.signInWithEmailAndPassword(
          email: email, password: _password.text,
        );
      }
    });
  }

  Future<void> _reset() async {
    final email = _email.text.trim();
    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email)) {
      _feedback('Enter your email address first.', error: true);
      return;
    }
    await _run(() => FirebaseAuth.instance.sendPasswordResetEmail(email: email));
    if (_message == null) _feedback('If an account exists, a reset email has been sent.');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                const Icon(Icons.translate_rounded, size: 54, color: Color(0xFF80A0FF)),
                const SizedBox(height: 12),
                const Text('LUGHA', textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900, letterSpacing: 3)),
                const SizedBox(height: 8),
                const Text('Your language journey starts here.', textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF9AA8BC))),
                const SizedBox(height: 28),
                Card(child: Padding(padding: const EdgeInsets.all(22), child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                    Text(_creating ? 'Create your account' : 'Welcome back',
                      style: Theme.of(context).textTheme.titleLarge),
                    const SizedBox(height: 16),
                    TextField(controller: _email, keyboardType: TextInputType.emailAddress,
                      autofillHints: const [AutofillHints.email],
                      decoration: const InputDecoration(labelText: 'Email address', prefixIcon: Icon(Icons.email_outlined))),
                    const SizedBox(height: 12),
                    TextField(controller: _password, obscureText: !_showPassword,
                      autofillHints: [_creating ? AutofillHints.newPassword : AutofillHints.password],
                      onSubmitted: (_) => _submit(),
                      decoration: InputDecoration(labelText: 'Password', prefixIcon: const Icon(Icons.lock_outline),
                        suffixIcon: IconButton(onPressed: () => setState(() => _showPassword = !_showPassword),
                          icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility)))),
                    if (!_creating) Align(alignment: Alignment.centerRight,
                      child: TextButton(onPressed: _busy ? null : _reset, child: const Text('Forgot password?'))),
                    if (widget.setupError != null) Padding(padding: const EdgeInsets.only(top: 8),
                      child: Text(widget.setupError!, style: const TextStyle(color: Colors.orangeAccent))),
                    if (_message != null) Padding(padding: const EdgeInsets.only(top: 12),
                      child: Text(_message!, style: TextStyle(color: _error ? Colors.redAccent : Colors.lightGreenAccent))),
                    const SizedBox(height: 16),
                    FilledButton(onPressed: _busy ? null : _submit,
                      child: _busy ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                        : Text(_creating ? 'Create account' : 'Sign in')),
                    TextButton(onPressed: _busy ? null : () => setState(() { _creating = !_creating; _message = null; }),
                      child: Text(_creating ? 'I already have an account' : 'Create an account')),
                  ],
                ))),
                const SizedBox(height: 10),
                OutlinedButton.icon(onPressed: widget.onGuest,
                  icon: const Icon(Icons.explore_outlined), label: const Text('Continue as guest')),
                const SizedBox(height: 10),
                const Text('Guest progress stays on this device until you sign in.',
                  textAlign: TextAlign.center, style: TextStyle(color: Color(0xFF9AA8BC), fontSize: 12)),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}
