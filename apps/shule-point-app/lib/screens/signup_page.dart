// ignore_for_file: use_build_context_synchronously

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';

import '../theme.dart' as custom_theme;
import 'package:flutter_svg/flutter_svg.dart';
import 'package:page_transition/page_transition.dart';

import 'splash_login_page.dart';
import 'user_account/student_account_page.dart';
import 'user_account/parent_account_page.dart';

import '../services/school.dart';
import '../services/student.dart';

import '../models/school.dart';
import '../models/student.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({Key? key}) : super(key: key);

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> with TickerProviderStateMixin {
  final schoolService = SchoolService();
  List<School> _schoolsList = <School>[];
  final List<String> _parentsList = ["Father", "Mother"];

  final _scaffoldKey = GlobalKey<ScaffoldState>();
  bool loading = true;

  late String _schoolRegNumber;
  late String _studentVerificationCode;
  String _parentSelection = "";

  final GlobalKey<FormState> _studentSignUpFormKey = GlobalKey<FormState>();
  final GlobalKey<FormState> _parentSignUpFormKey = GlobalKey<FormState>();

  Future<void> getSchools() async {
    _schoolsList = await schoolService.getSchools();

    setState(() {
      loading = false;
    });
  }

  _fetchStudent() async {
    if (!_studentSignUpFormKey.currentState!.validate()) {
      return;
    }

    _studentSignUpFormKey.currentState?.save();

    EasyLoading.show(status: 'Fetching Student Info...');

    try {
      final Student student =
          await StudentService().getStudentByVerificationCode(
        _schoolRegNumber,
        _studentVerificationCode,
      );

      EasyLoading.dismiss();

      Navigator.pushReplacement(
        context,
        PageTransition(
          type: PageTransitionType.bottomToTop,
          duration: const Duration(milliseconds: 800),
          curve: Curves.ease,
          child: StudentAccountPage(studentInfo: student),
        ),
      );
    } catch (e) {
      EasyLoading.showError("Student Not Found!");
    }
  }

  _fetchParent() async {
    if (!_parentSignUpFormKey.currentState!.validate()) {
      return;
    }

    _parentSignUpFormKey.currentState?.save();

    EasyLoading.show(status: 'Fetching Parent Info...');

    try {
      final Student student = await StudentService()
          .getStudentByVerificationCode(
              _schoolRegNumber, _studentVerificationCode);

      EasyLoading.dismiss();

      Navigator.pushReplacement(
        context,
        PageTransition(
          type: PageTransitionType.bottomToTop,
          duration: const Duration(milliseconds: 800),
          curve: Curves.ease,
          child: ParentAccountPage(
            studentInfo: student,
            selectedParent: _parentSelection,
          ),
        ),
      );
    } catch (e) {
      EasyLoading.showError("Parent Not Found!");
    }
  }

  Widget _buildParentSelectionField() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
      child: DropdownButtonFormField<String>(
        isExpanded: true,
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
          labelText: "Select Parent",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        iconEnabledColor: custom_theme.secondaryBlue,
        items: _parentsList.map<DropdownMenuItem<String>>((value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        validator: (String? value) {
          if (value == null) {
            return 'School is required';
          }

          return null;
        },
        onChanged: (String? value) {
          _parentSelection = value!;
        },
      ),
    );
  }

  Widget _buildSchoolsField() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
      child: DropdownButtonFormField<String>(
        isExpanded: true,
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
          labelText: "School",
          labelStyle:
              TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
          errorStyle:
              TextStyle(color: custom_theme.error, fontSize: 12.0, height: 0.5),
        ),
        style: TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
        iconEnabledColor: custom_theme.secondaryBlue,
        items: _schoolsList.map<DropdownMenuItem<String>>((School value) {
          return DropdownMenuItem<String>(
            value: value.registrationNumber,
            child: Text(value.name),
          );
        }).toList(),
        validator: (String? value) {
          if (value == null) {
            return 'School is required';
          }

          return null;
        },
        onChanged: (String? value) {
          _schoolRegNumber = value!;
        },
      ),
    );
  }

  Widget _buildFetchStudentWidget() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 15),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 200,
            child: TextFormField(
              style: TextStyle(
                color: custom_theme.secondaryBlue,
                fontSize: 16,
              ),
              maxLines: 1,
              decoration: InputDecoration(
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 15, vertical: 0),
                filled: true,
                fillColor: custom_theme.white,
                enabledBorder: OutlineInputBorder(
                    borderRadius: const BorderRadius.horizontal(
                      right: Radius.circular(0),
                      left: Radius.circular(15),
                    ),
                    borderSide:
                        BorderSide(color: custom_theme.gray, width: 2.0)),
                focusedBorder: OutlineInputBorder(
                    borderRadius: const BorderRadius.horizontal(
                      right: Radius.circular(0),
                      left: Radius.circular(15),
                    ),
                    borderSide: BorderSide(
                        color: custom_theme.secondaryBlue, width: 3.0)),
                errorBorder: OutlineInputBorder(
                    borderRadius: const BorderRadius.horizontal(
                      right: Radius.circular(0),
                      left: Radius.circular(15),
                    ),
                    borderSide:
                        BorderSide(color: custom_theme.error, width: 3.0)),
                focusedErrorBorder: OutlineInputBorder(
                    borderRadius: const BorderRadius.horizontal(
                      right: Radius.circular(0),
                      left: Radius.circular(15),
                    ),
                    borderSide:
                        BorderSide(color: custom_theme.error, width: 3.0)),
                labelText: "Verification Code",
                labelStyle:
                    TextStyle(color: custom_theme.secondaryBlue, fontSize: 16),
                errorStyle: TextStyle(
                    color: custom_theme.error, fontSize: 12.0, height: .5),
              ),
              cursorColor: custom_theme.secondaryBlue,
              validator: (String? value) {
                if (value!.isEmpty) {
                  return 'verification code is required';
                }

                return null;
              },
              onSaved: (String? value) {
                _studentVerificationCode = value!;
              },
            ),
          ),
          ElevatedButton(
            onPressed: () => {
              if (_parentSelection.isEmpty)
                {_fetchStudent()}
              else
                {_fetchParent()}
            },
            style: ButtonStyle(
              padding: MaterialStateProperty.all<EdgeInsets>(
                const EdgeInsets.symmetric(horizontal: 5, vertical: 10),
              ),
              backgroundColor: MaterialStateColor.resolveWith(
                (states) => custom_theme.primaryBlue,
              ),
              shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                RoundedRectangleBorder(
                  borderRadius: const BorderRadius.horizontal(
                    left: Radius.circular(0),
                    right: Radius.circular(15),
                  ),
                  side: BorderSide(
                    color: custom_theme.primaryBlue,
                    width: 2,
                  ),
                ),
              ),
            ),
            child: Text(
              "Fetch Info",
              style: TextStyle(
                  color: custom_theme.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    getSchools();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
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
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(
                  height: 50,
                ),
                SizedBox(
                  width: 350,
                  height: 225,
                  child: Stack(
                    children: [
                      Positioned(
                        left: 20,
                        child: SvgPicture.asset(
                          'assets/images/characters/SignUp_Character.svg',
                          width: 110,
                        ),
                      ),
                      Positioned(
                        right: 10,
                        bottom: 2.5,
                        child: SvgPicture.asset(
                          'assets/images/pageBanners/SignUp_text.svg',
                          width: 245,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                Container(
                  alignment: Alignment.topCenter,
                  width: 325,
                  height: 265,
                  decoration: BoxDecoration(
                    color: custom_theme.honeydew,
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
                      SizedBox(
                        height: 37.5,
                        child: TabBar(
                          indicator: BoxDecoration(
                            color: custom_theme.white,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(25),
                              topRight: Radius.circular(25),
                            ),
                          ),
                          tabs: [
                            Tab(
                              child: Text(
                                "Student",
                                style: TextStyle(
                                  color: custom_theme.primaryBlue,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            Tab(
                              child: Text(
                                "Parent",
                                style: TextStyle(
                                  color: custom_theme.primaryBlue,
                                  fontSize: 22,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        height: 227.5,
                        decoration: BoxDecoration(
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(25),
                            bottomRight: Radius.circular(25),
                          ),
                          color: custom_theme.white,
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 5),
                        child: TabBarView(
                          children: [
                            Form(
                              key: _studentSignUpFormKey,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  _buildSchoolsField(),
                                  _buildFetchStudentWidget(),
                                ],
                              ),
                            ),
                            Form(
                              key: _parentSignUpFormKey,
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  _buildSchoolsField(),
                                  _buildParentSelectionField(),
                                  _buildFetchStudentWidget(),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 25, vertical: 17.5),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Already have an account?",
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
                              type: PageTransitionType.rightToLeftWithFade,
                              duration: const Duration(milliseconds: 800),
                              curve: Curves.ease,
                              child: const LogInSplashPage(
                                appLoaded: true,
                              ),
                            ),
                          );
                        },
                        style: ButtonStyle(
                          overlayColor: MaterialStateColor.resolveWith(
                              (states) => Colors.transparent),
                        ),
                        child: Text(
                          "Sign In",
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
