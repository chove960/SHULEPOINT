import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import './theme.dart' as custom_theme;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';

import 'screens/splash_login_page.dart';

Future main() async {
  await dotenv.load(fileName: ".env");
  configLoading();
  runApp(const MyApp());
}

void configLoading() {
  EasyLoading.instance
    ..displayDuration = const Duration(milliseconds: 3000)
    ..indicatorType = EasyLoadingIndicatorType.threeBounce
    ..loadingStyle = EasyLoadingStyle.light
    ..indicatorSize = 45.0
    ..radius = 10.0
    ..progressColor = Colors.yellow
    ..backgroundColor = Colors.green
    ..indicatorColor = Colors.yellow
    ..textColor = Colors.yellow
    ..maskColor = custom_theme.dark.withOpacity(0.65)
    ..userInteractions = false
    ..dismissOnTap = true
    ..maskType = EasyLoadingMaskType.custom;
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersive);
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const LogInSplashPage(appLoaded: false),
      builder: EasyLoading.init(),
      theme: ThemeData(
        fontFamily: 'Rajdhani',
        scaffoldBackgroundColor: custom_theme.honeydew,
        primaryColor: custom_theme.primaryBlue,
      ),
    );
  }
}
