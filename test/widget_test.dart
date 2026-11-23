import 'package:flutter_test/flutter_test.dart';
import 'package:lugha_flutter/main.dart';

void main() {
  testWidgets('Lugha offers account access and guest entry', (tester) async {
    await tester.pumpWidget(const LughaApp());
    await tester.pumpAndSettle();
    expect(find.text('LUGHA'), findsOneWidget);
    expect(find.text('Continue as guest'), findsOneWidget);
    await tester.tap(find.text('Continue as guest'));
    await tester.pumpAndSettle();
    expect(find.text('WORKSPACE'), findsOneWidget);
    expect(find.textContaining('Flutter client foundation'), findsOneWidget);
  });
}
