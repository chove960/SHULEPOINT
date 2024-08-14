// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import '../theme.dart' as custom_theme;

import 'package:lottie/lottie.dart';
import 'package:page_transition/page_transition.dart';
import 'package:rounded_loading_button_plus/rounded_loading_button.dart';
import 'package:awesome_dialog/awesome_dialog.dart';

import '../services/auth.dart';
import 'signup_page.dart';
import 'dashboard/home.dart';

class LogInSplashPage extends StatefulWidget {
  const LogInSplashPage({
    Key? key,
    required this.appLoaded,
  }) : super(key: key);

  final bool appLoaded;

  @override
  State<LogInSplashPage> createState() => _LogInSplashPageState();
}

class _LogInSplashPageState extends State<LogInSplashPage>
    with TickerProviderStateMixin {
  late AnimationController _splashAnimationController;

  final _scaffoldKey = GlobalKey<ScaffoldState>();
  bool loading = true;
  bool appLoaded = false;

  late String _username;
  late String _password;
  final GlobalKey<FormState> _signInFormKey = GlobalKey<FormState>();
  final RoundedLoadingButtonController _logInBtnController =
      RoundedLoadingButtonController();

  void _toggle() {
    setState(() {
      loading = !loading;
    });
  }

  void _logInUser() async {
    if (!_signInFormKey.currentState!.validate()) {
      _logInBtnController.reset();
      return;
    }

    _signInFormKey.currentState?.save();

    Map<String, dynamic> credInfo = {
      'username': _username,
      'password': _password
    };

    final res = await AuthService().login(credInfo);

    try {
      await AuthService.setToken(
        res['userID'],
        res['Token'],
      );

      _logInBtnController.success();

      Navigator.pushReplacement(
        context,
        PageTransition(
          type: PageTransitionType.rightToLeftWithFade,
          duration: const Duration(milliseconds: 800),
          curve: Curves.ease,
          child: const DashboardHomePage(),
        ),
      );
    } catch (err) {
      _logInBtnController.stop();

      if (err.toString() != '') {
        AwesomeDialog(
          context: context,
          dialogType: DialogType.error,
          width: MediaQuery.of(context).size.width * 0.8,
          buttonsBorderRadius: const BorderRadius.all(
            Radius.circular(5),
          ),
          body: Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Column(
              children: [
                Text(
                  "ERROR",
                  style: TextStyle(
                    color: custom_theme.secondaryBlue,
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  '$res',
                  style: TextStyle(
                    color: custom_theme.secondaryBlue,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                )
              ],
            ),
          ),
          dialogBackgroundColor: custom_theme.powderBlue,
          keyboardAware: true,
          headerAnimationLoop: false,
          animType: AnimType.bottomSlide,
          autoHide: const Duration(seconds: 5),
          showCloseIcon: false,
        ).show();
      }
    }
  }

  Widget _buildUsernameField() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
      child: TextFormField(
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 15, vertical: 0),
          filled: true,
          fillColor: custom_theme.white,
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: custom_theme.gray, width: 2.0)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide:
                  BorderSide(color: custom_theme.secondaryBlue, width: 3.0)),
          errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: custom_theme.error, width: 3.0)),
          focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: custom_theme.error, width: 3.0)),
          labelText: "Username",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        cursorColor: custom_theme.secondaryBlue,
        validator: (String? value) {
          if (value!.isEmpty) {
            return 'Username is required';
          }

          return null;
        },
        onSaved: (String? value) {
          _username = value!;
        },
      ),
    );
  }

  Widget _buildPasswordField() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
      child: TextFormField(
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        obscureText: true,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 15, vertical: 0),
          filled: true,
          fillColor: custom_theme.white,
          enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: custom_theme.gray, width: 2.0)),
          focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide:
                  BorderSide(color: custom_theme.secondaryBlue, width: 3.0)),
          errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: custom_theme.error, width: 3.0)),
          focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide(color: custom_theme.error, width: 3.0)),
          labelText: "Password",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        cursorColor: custom_theme.secondaryBlue,
        validator: (String? value) {
          if (value!.isEmpty) {
            return 'Password is required';
          }

          return null;
        },
        onSaved: (String? value) {
          _password = value!;
        },
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    appLoaded = widget.appLoaded;

    _splashAnimationController = AnimationController(vsync: this);
  }

  @override
  void dispose() {
    _splashAnimationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: custom_theme.honeydew,
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              custom_theme.honeydew,
              custom_theme.powderBlue,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            stops: const [0.3, 0.85],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Lottie.asset(
              'assets/lottieAnimations/Loading-Splash.json',
              width: 350,
              fit: BoxFit.cover,
              controller: _splashAnimationController,
              onLoaded: !appLoaded
                  ? (composition) {
                      _splashAnimationController
                        ..duration = composition.duration
                        ..forward();

                      _splashAnimationController.addStatusListener(
                        (status) async {
                          if (status == AnimationStatus.completed) {
                            if (!await AuthService().isLoggedIn()) {
                              _toggle();
                            } else {
                              Navigator.pushReplacement(
                                context,
                                PageTransition(
                                  type: PageTransitionType.fade,
                                  duration: const Duration(milliseconds: 800),
                                  curve: Curves.ease,
                                  child: const DashboardHomePage(),
                                ),
                              );
                            }
                          }
                        },
                      );
                    }
                  : (composition) async {
                      _splashAnimationController.animateTo(
                        1.0,
                        duration: const Duration(microseconds: 1),
                      );

                      _toggle();
                    },
            ),
            const SizedBox(height: 10),
            AnimatedContainer(
              duration: appLoaded
                  ? const Duration(microseconds: 0)
                  : const Duration(milliseconds: 650),
              curve: Curves.easeInOut,
              alignment: Alignment.topCenter,
              padding: const EdgeInsets.only(top: 10),
              width: 325,
              height: loading ? 0 : 200,
              decoration: BoxDecoration(
                color: custom_theme.white,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(25),
                  bottomRight: Radius.circular(25),
                  topLeft: Radius.circular(25),
                  topRight: Radius.circular(25),
                ),
                boxShadow: [
                  BoxShadow(
                      color: custom_theme.dark.withOpacity(.45),
                      offset: const Offset(-6, 6),
                      spreadRadius: 0,
                      blurRadius: 16,
                      blurStyle: BlurStyle.normal),
                ],
              ),
              child: Form(
                key: _signInFormKey,
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      _buildUsernameField(),
                      _buildPasswordField(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(right: 15, top: 5),
                            child: RoundedLoadingButton(
                              controller: _logInBtnController,
                              color: custom_theme.primaryBlue,
                              height: 35,
                              width: 125,
                              borderRadius: 50,
                              onPressed: _logInUser,
                              child: Text(
                                "Sign In",
                                style: TextStyle(
                                    color: custom_theme.white,
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 25,
                vertical: 5,
              ),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 450),
                height: loading ? 0 : 60,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have an account yet?",
                      style: TextStyle(
                          color: custom_theme.primaryBlue,
                          fontSize: 18,
                          fontWeight: FontWeight.w500),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.pushReplacement(
                          context,
                          PageTransition(
                            type: PageTransitionType.leftToRightWithFade,
                            duration: const Duration(milliseconds: 800),
                            curve: Curves.ease,
                            child: const SignUpPage(),
                          ),
                        );
                      },
                      style: ButtonStyle(
                        overlayColor: MaterialStateColor.resolveWith(
                            (states) => Colors.transparent),
                      ),
                      child: Text(
                        "Sign Up",
                        style: TextStyle(
                          color: custom_theme.primaryBlue,
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
