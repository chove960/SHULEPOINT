// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:page_transition/page_transition.dart';
import 'package:rounded_loading_button_plus/rounded_loading_button.dart';
import 'package:shule_point_app/screens/dashboard/home.dart';
import 'package:shule_point_app/screens/signup_page.dart';

import '../../theme.dart' as custom_theme;

import '../../services/auth.dart';

import '../../models/student.dart';

class StudentAccountPage extends StatefulWidget {
  const StudentAccountPage({
    Key? key,
    required this.studentInfo,
  }) : super(key: key);

  final Student studentInfo;

  @override
  State<StudentAccountPage> createState() => _StudentAccountPageState();
}

class _StudentAccountPageState extends State<StudentAccountPage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();

  late Student studentInfo;

  late String _firstName;
  late String _lastName;
  late String _username;
  late String _email;
  late String _password;

  final TextEditingController _passController = TextEditingController();

  final GlobalKey<FormState> _createAccountFormKey = GlobalKey<FormState>();
  final RoundedLoadingButtonController _createAccountBtnController =
      RoundedLoadingButtonController();

  void setStudent() {
    setState(() {
      studentInfo = widget.studentInfo;
    });
  }

  String getFirstName(String fullname) {
    final List names = fullname.split(" ");

    return names.first;
  }

  String getLastName(String fullname) {
    final List names = fullname.split(" ");

    return names.last;
  }

  void _signUpUser() async {
    if (!_createAccountFormKey.currentState!.validate()) {
      _createAccountBtnController.reset();
      return;
    }

    _createAccountFormKey.currentState?.save();

    Map<String, dynamic> regInfo = {
      "firstName": _firstName,
      "lastName": _lastName,
      "email": _email,
      'username': _username,
      'password': _password,
      'userRole': 'Student',
    };

    final res = await AuthService().register(
      regInfo,
      studentInfo.id,
      '',
    );

    try {
      AuthService.setToken(
        res['userID'],
        res['Token'],
      );

      EasyLoading.showToast(
        "Account Successfully Created",
        toastPosition: EasyLoadingToastPosition.top,
      );

      Navigator.pushReplacement(
        context,
        PageTransition(
          type: PageTransitionType.rightToLeftWithFade,
          duration: const Duration(milliseconds: 800),
          curve: Curves.ease,
          child: const DashboardHomePage(),
        ),
      );
    } on TypeError catch (err) {
      if (err.toString() != '') {
        EasyLoading.showToast(
          res,
          toastPosition: EasyLoadingToastPosition.top,
        );
      }
    }

    _createAccountBtnController.reset();
  }

  Widget _buildFirstNameField() {
    return Container(
      width: 325 / 2,
      padding: const EdgeInsets.symmetric(vertical: 7.5, horizontal: 5),
      child: TextFormField(
        initialValue: getFirstName(studentInfo.fullname),
        readOnly: true,
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        decoration: InputDecoration(
          alignLabelWithHint: true,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
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
          labelText: "First Name",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        cursorColor: custom_theme.secondaryBlue,
        validator: (String? value) {
          if (value!.isEmpty) {
            return 'First Name is required';
          }

          return null;
        },
        onSaved: (String? value) {
          _firstName = value!;
        },
      ),
    );
  }

  Widget _buildLastNameField() {
    return Container(
      width: 325 / 2,
      padding: const EdgeInsets.symmetric(vertical: 7.5, horizontal: 5),
      child: TextFormField(
        initialValue: getLastName(studentInfo.fullname),
        readOnly: true,
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
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
          labelText: "Last Name",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        cursorColor: custom_theme.secondaryBlue,
        validator: (String? value) {
          if (value!.isEmpty) {
            return 'Last Name is required';
          }

          return null;
        },
        onSaved: (String? value) {
          _lastName = value!;
        },
      ),
    );
  }

  Widget _buildUsernameField() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7.5, horizontal: 15),
      child: TextFormField(
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
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

  Widget _buildEmailField() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7.5, horizontal: 15),
      child: TextFormField(
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
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
          labelText: "Email",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        cursorColor: custom_theme.secondaryBlue,
        validator: (String? value) {
          if (value!.isEmpty) {
            return 'Email is required';
          }

          if (!RegExp(
                  r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,253}[a-zA-Z0-9])?)*$")
              .hasMatch(value)) {
            return "Please enter a valid email address";
          }

          return null;
        },
        onSaved: (String? value) {
          _email = value!;
        },
      ),
    );
  }

  Widget _buildPasswordField() {
    return Container(
      width: 325 / 2,
      padding: const EdgeInsets.symmetric(vertical: 2.5, horizontal: 5),
      child: TextFormField(
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        controller: _passController,
        maxLines: 1,
        obscureText: true,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
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

          if (value.isNotEmpty && value.length < 8) {
            return 'Password too short';
          }

          return null;
        },
        onSaved: (String? value) {
          _password = value!;
        },
      ),
    );
  }

  Widget _buildConfirmPasswordField() {
    return Container(
      width: 325 / 2,
      padding: const EdgeInsets.symmetric(vertical: 2.5, horizontal: 5),
      child: TextFormField(
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        maxLines: 1,
        obscureText: true,
        decoration: InputDecoration(
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
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
          labelText: "Confirm Password",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        cursorColor: custom_theme.secondaryBlue,
        validator: (String? value) {
          if (value!.isEmpty) {
            return 'Please Confirm Password';
          }

          if (value.isNotEmpty && value != _passController.text) {
            return 'Passwords don\'t match';
          }

          return null;
        },
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    setStudent();
  }

  @override
  void dispose() {
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
        alignment: Alignment.center,
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
        child: SingleChildScrollView(
          child: Container(
            alignment: Alignment.topCenter,
            width: 350,
            height: 410,
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
            child: Column(
              children: [
                Container(
                  width: 350,
                  height: 37.5,
                  decoration: BoxDecoration(
                    color: custom_theme.white,
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(25),
                    ),
                    boxShadow: [
                      BoxShadow(
                          color: custom_theme.dark.withOpacity(.45),
                          offset: const Offset(0, 3),
                          spreadRadius: 0,
                          blurRadius: 6,
                          blurStyle: BlurStyle.normal),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.only(left: 20, right: 5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Create Account",
                          style: TextStyle(
                            color: custom_theme.primaryBlue,
                            fontSize: 22.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        ElevatedButton(
                          style: ButtonStyle(
                            elevation: MaterialStateProperty.all(0),
                            backgroundColor: MaterialStateColor.resolveWith(
                                (states) => Colors.transparent),
                            overlayColor: MaterialStateColor.resolveWith(
                                (states) => Colors.transparent),
                            alignment: Alignment.centerRight,
                          ),
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              PageTransition(
                                type: PageTransitionType.topToBottom,
                                duration: const Duration(milliseconds: 800),
                                curve: Curves.ease,
                                child: const SignUpPage(),
                              ),
                            );
                          },
                          child: FaIcon(
                            FontAwesomeIcons.solidWindowClose,
                            color: custom_theme.error,
                            size: 30,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                Form(
                  key: _createAccountFormKey,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 2.5,
                      vertical: 20,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _buildFirstNameField(),
                            _buildLastNameField(),
                          ],
                        ),
                        _buildUsernameField(),
                        _buildEmailField(),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _buildPasswordField(),
                            _buildConfirmPasswordField(),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(right: 15, top: 5),
                              child: RoundedLoadingButton(
                                controller: _createAccountBtnController,
                                color: custom_theme.primaryBlue,
                                height: 40,
                                width: MediaQuery.of(context).size.width * 0.45,
                                borderRadius: 50,
                                onPressed: _signUpUser,
                                child: Text(
                                  "Sign Up",
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
