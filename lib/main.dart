import 'package:flutter/material.dart';

const _background = Color(0xFF10151F);
const _surface = Color(0xFF192231);
const _muted = Color(0xFF9AA8BC);
const _accent = Color(0xFF80A0FF);

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const LughaApp());
}

class LughaApp extends StatelessWidget {
  const LughaApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Lugha',
    debugShowCheckedModeBanner: false,
    theme: ThemeData(brightness: Brightness.dark, scaffoldBackgroundColor: _background,
      colorScheme: ColorScheme.fromSeed(seedColor: _accent, brightness: Brightness.dark), useMaterial3: true),
    home: const _Home(),
  );
}

class _Module {
  const _Module(this.name, this.icon, this.description);
  final String name;
  final IconData icon;
  final String description;
}

const _modules = <_Module>[
  _Module('Learn', Icons.school_outlined, 'Lessons and guided practice.'),
  _Module('Flashcards', Icons.style_outlined, 'Review vocabulary with spaced practice.'),
  _Module('Speaking', Icons.record_voice_over_outlined, 'Practice pronunciation and listening.'),
  _Module('Dictionary', Icons.menu_book_outlined, 'Explore words and meanings.'),
  _Module('Progress', Icons.trending_up_outlined, 'Track your learning progress.'),
  _Module('Profile', Icons.person_outline, 'Manage your learning preferences.'),
];

class _Home extends StatefulWidget {
  const _Home();
  @override
  State<_Home> createState() => _HomeState();
}

class _HomeState extends State<_Home> {
  int _index = 0;
  @override
  Widget build(BuildContext context) {
    final compact = MediaQuery.sizeOf(context).width < 760;
    final module = _modules[_index];
    return Scaffold(
      body: SafeArea(child: Row(children: [
        if (!compact) Container(
          width: 228, color: _surface, padding: const EdgeInsets.all(16),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const SizedBox(height: 12),
            const Text('LUGHA', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, letterSpacing: 2)),
            const SizedBox(height: 5),
            const Text('Learn a language by using it', style: TextStyle(color: _muted, fontSize: 11)),
            const SizedBox(height: 32),
            const Text('WORKSPACE', style: TextStyle(color: _muted, fontSize: 10, letterSpacing: 1.5)),
            const SizedBox(height: 12),
            Expanded(child: ListView.builder(
              itemCount: _modules.length,
              itemBuilder: (context, i) => Padding(
                padding: const EdgeInsets.only(bottom: 5),
                child: ListTile(
                  dense: true, selected: _index == i, selectedTileColor: const Color(0xFF2A3956),
                  leading: Icon(_modules[i].icon, color: _index == i ? _accent : _muted),
                  title: Text(_modules[i].name, style: TextStyle(color: _index == i ? Colors.white : _muted, fontSize: 13)),
                  onTap: () => setState(() => _index = i),
                ),
              ),
            )),
            const Divider(color: Color(0xFF2A3546)),
            const Text('Services not connected', style: TextStyle(color: _muted, fontSize: 11)),
          ]),
        ),
        Expanded(child: Column(children: [
          Container(height: 66, padding: const EdgeInsets.symmetric(horizontal: 22),
            decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: Color(0xFF2A3546)))),
            child: Row(children: [
              if (compact) const Text('Lugha', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1.5)),
              const Spacer(),
              const Icon(Icons.cloud_off_outlined, color: _muted, size: 18),
              const SizedBox(width: 8),
              const Text('Connect services to begin', style: TextStyle(color: _muted, fontSize: 11)),
            ]),
          ),
          Expanded(child: SingleChildScrollView(
            padding: EdgeInsets.all(compact ? 18 : 34),
            child: Center(child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1000),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(module.name.toUpperCase(), style: const TextStyle(color: _accent, fontWeight: FontWeight.w800, fontSize: 10, letterSpacing: 2)),
                const SizedBox(height: 12),
                Text(module.description, style: TextStyle(fontSize: compact ? 25 : 34, fontWeight: FontWeight.w700)),
                const SizedBox(height: 24),
                Container(width: double.infinity, padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(color: const Color(0xFF1D2A3D), borderRadius: BorderRadius.circular(16), border: Border.all(color: const Color(0xFF344A70))),
                  child: const Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Icon(Icons.info_outline, color: _accent), SizedBox(width: 12),
                    Expanded(child: Text('Flutter client foundation. Existing backend, authentication, media and device capabilities are not yet connected. No sample accounts, jobs or progress records are displayed.', style: TextStyle(height: 1.5, color: Color(0xFFD5DDF0)))),
                  ]),
                ),
                const SizedBox(height: 22),
                Card(color: _surface, child: Padding(padding: const EdgeInsets.all(24),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Lugha ' + module.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    const Text('This module will be connected to the existing project services through a typed Flutter repository layer.', style: TextStyle(color: _muted, height: 1.5)),
                  ]),
                )),
              ]),
            )),
          )),
        ])),
      ])),
      bottomNavigationBar: compact ? NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: _modules.map((m) => NavigationDestination(icon: Icon(m.icon), label: m.name)).toList(),
      ) : null,
    );
  }
}
