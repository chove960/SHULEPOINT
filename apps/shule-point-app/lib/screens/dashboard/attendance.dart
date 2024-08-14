import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:page_transition/page_transition.dart';
import 'package:shule_point_app/models/user.dart';
import 'package:shule_point_app/models/student.dart';
import 'package:shule_point_app/screens/dashboard/home.dart';
import 'package:shule_point_app/services/student.dart';

import '../../theme.dart' as custom_theme;

class AttendancePage extends StatefulWidget {
  const AttendancePage({Key? key, required this.currentUser}) : super(key: key);

  final User currentUser;

  @override
  State<AttendancePage> createState() => _AttendancePageState();
}

class _AttendancePageState extends State<AttendancePage> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  bool loading = true;

  late Student _currentStudent = Student(
      id: '',
      schoolRegNumber: '',
      studentID: '',
      fullname: '',
      dateOfBirth: '',
      gender: '',
      photo: '',
      gradeLevel: '',
      verificationCode: '',
      address: Address(city: '', state: '', country: ''),
      parentalInformation: ParentsInfo(
        fatherInfo: ParentInfo(
          fullname: '',
          phoneNumber: '',
          email: '',
          address: Address(city: '', state: '', country: ''),
        ),
        motherInfo: ParentInfo(
          fullname: '',
          phoneNumber: '',
          email: '',
          address: Address(city: '', state: '', country: ''),
        ),
      ),
      outstandingFees: [],
      progressReport: [],
      attendanceReport: '');

  Future<void> getStudent() async {
    EasyLoading.show();

    _currentStudent = await StudentService().getStudent(
        widget.currentUser.schoolRegNumber, widget.currentUser.studentID);

    setState(() {
      loading = false;
      EasyLoading.dismiss();
    });
  }

  @override
  void initState() {
    super.initState();
    getStudent();
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
                      Navigator.pushReplacement(
                        context,
                        PageTransition(
                            type: PageTransitionType.leftToRightWithFade,
                            duration: const Duration(milliseconds: 800),
                            curve: Curves.ease,
                            child: const DashboardHomePage()),
                      );
                    },
                    style: ButtonStyle(
                      overlayColor: MaterialStateProperty.resolveWith(
                          (states) => Colors.transparent),
                    ),
                    child: FaIcon(
                      FontAwesomeIcons.arrowLeft,
                      color: custom_theme.secondaryBlue,
                      size: 30,
                    ),
                  ),
                ],
              ),
              Text(
                "Attendance for ${_currentStudent.fullname}",
                style: TextStyle(
                  color: custom_theme.secondaryBlue,
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
