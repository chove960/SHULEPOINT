// ignore_for_file: use_build_context_synchronously

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:page_transition/page_transition.dart';
import 'package:shule_point_app/models/user.dart';
import 'package:shule_point_app/screens/dashboard/progressReport.dart';
import 'package:shule_point_app/screens/dashboard/attendance.dart';
import 'package:shule_point_app/screens/splash_login_page.dart';
import 'package:shule_point_app/services/auth.dart';
import 'package:shule_point_app/services/user.dart';

import '../../theme.dart' as custom_theme;
// import 'package:flutter_svg/flutter_svg.dart';
// import 'package:modals/modals.dart';

class DashboardHomePage extends StatefulWidget {
  const DashboardHomePage({Key? key}) : super(key: key);

  @override
  State<DashboardHomePage> createState() => _DashboardHomePageState();
}

class _DashboardHomePageState extends State<DashboardHomePage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  bool loading = true;

  User _currentUser = User(
    id: '',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    userType: '',
    userRole: '',
    schoolRegNumber: '',
    studentID: '',
    dateJoined: '',
    hasProfile: false,
    profile: Profile(
      profilePic: '',
      dateOfBirth: '',
      gender: '',
      phoneNumber: '',
      address: Address(
        city: '',
        state: '',
        country: '',
      ),
    ),
  );

  Future<void> getUser() async {
    EasyLoading.show();

    _currentUser = await UserService().getUser();

    setState(() {
      loading = false;
      EasyLoading.dismiss();
    });

    if (_currentUser.username.isNotEmpty) {
      checkUserType();
    } else {
      logOutUser();
    }
  }

  void checkUserType() {
    if (_currentUser.userType == "Staff") {
      EasyLoading.showError("ERROR! \n You're not a student or a parent!");

      logOutUser();
    }
  }

  void logOutUser() {
    AuthService.removeToken();

    Navigator.pushReplacement(
      context,
      PageTransition(
        type: PageTransitionType.leftToRightWithFade,
        duration: const Duration(milliseconds: 800),
        curve: Curves.ease,
        child: const LogInSplashPage(
          appLoaded: true,
        ),
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    getUser();
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
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  TextButton(
                    onPressed: () {
                      logOutUser();
                    },
                    style: ButtonStyle(
                      overlayColor: MaterialStateProperty.resolveWith(
                          (states) => Colors.transparent),
                    ),
                    child: FaIcon(
                      FontAwesomeIcons.rightFromBracket,
                      color: custom_theme.secondaryBlue,
                      size: 30,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    style: ButtonStyle(
                      overlayColor: MaterialStateProperty.resolveWith(
                          (states) => Colors.transparent),
                    ),
                    child: FaIcon(
                      FontAwesomeIcons.bell,
                      color: custom_theme.secondaryBlue,
                      size: 30,
                    ),
                  ),
                ],
              ),
              SizedBox(
                width: 350,
                height: 200,
                child: Stack(
                  alignment: Alignment.topCenter,
                  children: [
                    Positioned(
                      left: 20,
                      top: 25,
                      child: Text(
                        "👋 Hello,",
                        style: TextStyle(
                          color: custom_theme.imperialRed,
                          fontSize: 40,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 15,
                      child: Container(
                        height: 100,
                        width: 340,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 15, vertical: 7.5),
                        decoration: BoxDecoration(
                          color: custom_theme.honeydew.withOpacity(0.85),
                          borderRadius: const BorderRadius.only(
                            bottomLeft: Radius.circular(15),
                            bottomRight: Radius.circular(15),
                            topLeft: Radius.circular(15),
                            topRight: Radius.circular(15),
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: custom_theme.dark.withOpacity(.35),
                              offset: const Offset(-6, 6),
                              spreadRadius: -2.5,
                              blurRadius: 20,
                              blurStyle: BlurStyle.normal,
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Text(
                              "${_currentUser.firstName} ${_currentUser.username.isNotEmpty ? _currentUser.lastName[0] : ''}.",
                              style: TextStyle(
                                color: custom_theme.secondaryBlue,
                                fontSize: 27.5,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Positioned(
                      right: 25,
                      top: 25,
                      child: Container(
                        alignment: Alignment.center,
                        width: 117.5,
                        height: 117.5,
                        clipBehavior: Clip.antiAlias,
                        decoration: BoxDecoration(
                          color: custom_theme.honeydew,
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [
                              custom_theme.powderBlue,
                              custom_theme.honeydew,
                            ],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            stops: const [0.3, 0.85],
                          ),
                        ),
                        child: Container(
                          height: 110,
                          width: 110,
                          clipBehavior: Clip.antiAlias,
                          decoration: const BoxDecoration(
                            shape: BoxShape.circle,
                          ),
                          child: _currentUser.profile.profilePic != ''
                              ? Image.network(
                                  _currentUser.profile.profilePic,
                                  fit: BoxFit.cover,
                                )
                              : Image.asset(
                                  'assets/images/userImage_Placeholder.png',
                                  fit: BoxFit.cover,
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(
                height: 20,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 12),
                    child: Text(
                      "Quick Action",
                      style: TextStyle(
                        color: custom_theme.secondaryBlue,
                        fontSize: 25,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  const SizedBox(
                    height: 5,
                  ),
                  SizedBox(
                    width: 350,
                    child: Wrap(
                      spacing: 10,
                      runSpacing: 12.5,
                      runAlignment: WrapAlignment.center,
                      alignment: WrapAlignment.center,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              PageTransition(
                                type: PageTransitionType.rightToLeftWithFade,
                                duration: const Duration(milliseconds: 800),
                                curve: Curves.ease,
                                child: ProgressReportPage(
                                  currentUser: _currentUser,
                                ),
                              ),
                            );
                          },
                          style: ButtonStyle(
                            elevation:
                                MaterialStateProperty.resolveWith<double>(
                                    (states) {
                              if (states.contains(MaterialState.pressed)) {
                                return 18;
                              }
                              return 10;
                            }),
                            padding: MaterialStateProperty.all<EdgeInsets>(
                              const EdgeInsets.all(0),
                            ),
                            backgroundColor: MaterialStateColor.resolveWith(
                              (states) => Colors.transparent,
                            ),
                            shape: MaterialStateProperty.all<
                                RoundedRectangleBorder>(
                              const RoundedRectangleBorder(
                                borderRadius: BorderRadius.all(
                                  Radius.circular(15),
                                ),
                              ),
                            ),
                          ),
                          child: Container(
                            height: 115,
                            width: 105,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 5, vertical: 2.5),
                            decoration: BoxDecoration(
                              color: custom_theme.honeydew,
                              borderRadius: const BorderRadius.only(
                                bottomLeft: Radius.circular(15),
                                bottomRight: Radius.circular(15),
                                topLeft: Radius.circular(15),
                                topRight: Radius.circular(15),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Text(
                                  "Progress Report",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: custom_theme.primaryBlue,
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pushReplacement(
                              context,
                              PageTransition(
                                type: PageTransitionType.rightToLeftWithFade,
                                duration: const Duration(milliseconds: 800),
                                curve: Curves.ease,
                                child: AttendancePage(
                                  currentUser: _currentUser,
                                ),
                              ),
                            );
                          },
                          style: ButtonStyle(
                            elevation:
                                MaterialStateProperty.resolveWith<double>(
                                    (states) {
                              if (states.contains(MaterialState.pressed)) {
                                return 18;
                              }
                              return 10;
                            }),
                            padding: MaterialStateProperty.all<EdgeInsets>(
                              const EdgeInsets.all(0),
                            ),
                            backgroundColor: MaterialStateColor.resolveWith(
                              (states) => Colors.transparent,
                            ),
                            shape: MaterialStateProperty.all<
                                RoundedRectangleBorder>(
                              const RoundedRectangleBorder(
                                borderRadius: BorderRadius.all(
                                  Radius.circular(15),
                                ),
                              ),
                            ),
                          ),
                          child: Container(
                            height: 115,
                            width: 105,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 5, vertical: 2.5),
                            decoration: BoxDecoration(
                              color: custom_theme.honeydew,
                              borderRadius: const BorderRadius.only(
                                bottomLeft: Radius.circular(15),
                                bottomRight: Radius.circular(15),
                                topLeft: Radius.circular(15),
                                topRight: Radius.circular(15),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Text(
                                  "Class Attendance",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: custom_theme.primaryBlue,
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        ElevatedButton(
                          onPressed: () {},
                          style: ButtonStyle(
                            elevation:
                                MaterialStateProperty.resolveWith<double>(
                                    (states) {
                              if (states.contains(MaterialState.pressed)) {
                                return 18;
                              }
                              return 10;
                            }),
                            padding: MaterialStateProperty.all<EdgeInsets>(
                              const EdgeInsets.all(0),
                            ),
                            backgroundColor: MaterialStateColor.resolveWith(
                              (states) => Colors.transparent,
                            ),
                            shape: MaterialStateProperty.all<
                                RoundedRectangleBorder>(
                              const RoundedRectangleBorder(
                                borderRadius: BorderRadius.all(
                                  Radius.circular(15),
                                ),
                              ),
                            ),
                          ),
                          child: Container(
                            height: 115,
                            width: 105,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 5, vertical: 2.5),
                            decoration: BoxDecoration(
                              color: custom_theme.honeydew,
                              borderRadius: const BorderRadius.only(
                                bottomLeft: Radius.circular(15),
                                bottomRight: Radius.circular(15),
                                topLeft: Radius.circular(15),
                                topRight: Radius.circular(15),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Text(
                                  "Announcements",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: custom_theme.primaryBlue,
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
