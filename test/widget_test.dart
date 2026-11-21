import 'package:flutter_test/flutter_test.dart';
import 'package:lugha_flutter/main.dart';

void main() {
  testWidgets('Lugha opens the Flutter workspace', (tester) async {
    await tester.pumpWidget(const LughaApp());
    expect(find.text('WORKSPACE'), findsOneWidget);
    expect(find.textContaining('Flutter client foundation'), findsOneWidget);
  });
}
