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

class ProgressReportPage extends StatefulWidget {
  const ProgressReportPage({Key? key, required this.currentUser})
      : super(key: key);

  final User currentUser;

  @override
  State<ProgressReportPage> createState() => _ProgressReportPageState();
}

class _ProgressReportPageState extends State<ProgressReportPage> {
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
                      padding: MaterialStateProperty.all<EdgeInsets>(
                        const EdgeInsets.all(0),
                      ),
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
                "Progress Report",
                style: TextStyle(
                  color: custom_theme.secondaryBlue,
                  fontSize: 20,
                  height: 0.8,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.vertical,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      for (final report in _currentStudent.progressReport)
                        SizedBox(
                          width: MediaQuery.of(context).size.width * .95,
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const SizedBox(
                                height: 5,
                              ),
                              Text(
                                "${report.gradeLevel} - ${report.schoolTerm}",
                                style: TextStyle(
                                  color: custom_theme.primaryBlue,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(
                                height: 1.5,
                              ),
                              Container(
                                clipBehavior: Clip.antiAlias,
                                decoration: const BoxDecoration(
                                  borderRadius: BorderRadius.all(
                                    Radius.circular(10),
                                  ),
                                ),
                                child: Table(
                                  border: TableBorder(
                                    verticalInside: BorderSide(
                                      width: 1,
                                      style: BorderStyle.solid,
                                      color: custom_theme.primaryBlue,
                                    ),
                                  ),
                                  defaultVerticalAlignment:
                                      TableCellVerticalAlignment.bottom,
                                  columnWidths: const {
                                    0: FixedColumnWidth(85),
                                    1: FlexColumnWidth(1),
                                    2: FlexColumnWidth(1),
                                    3: FlexColumnWidth(1),
                                    4: FlexColumnWidth(1),
                                  },
                                  children: [
                                    TableRow(
                                      decoration: BoxDecoration(
                                          color: custom_theme.primaryBlue),
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.only(
                                            left: 5,
                                          ),
                                          child: Text(
                                            'Subject',
                                            textAlign: TextAlign.start,
                                            style: TextStyle(
                                              color: custom_theme.white,
                                              height: 1.125,
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                        for (final assessment
                                            in report.termAssessments)
                                          Text(
                                            assessment.name,
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              color: custom_theme.white,
                                              height: 1.125,
                                              fontSize: 12,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        Text(
                                          "Total",
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            color: custom_theme.white,
                                            height: 1.125,
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    ),
                                    for (final assessment in report.assessments)
                                      TableRow(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.only(
                                              left: 5,
                                            ),
                                            child: Text(
                                              assessment.subject,
                                              style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: custom_theme
                                                      .secondaryBlue),
                                            ),
                                          ),
                                          for (final subjectAssessment
                                              in assessment.assessments)
                                            Container(
                                              padding: const EdgeInsets.only(
                                                right: 5,
                                              ),
                                              child: Text(
                                                subjectAssessment.marks,
                                                textAlign: TextAlign.end,
                                                style: TextStyle(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w600,
                                                    color: custom_theme
                                                        .secondaryBlue),
                                              ),
                                            ),
                                          Container(
                                            padding: const EdgeInsets.only(
                                              right: 5,
                                            ),
                                            child: Text(
                                              assessment.totalScore,
                                              textAlign: TextAlign.end,
                                              style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.w600,
                                                  color: custom_theme
                                                      .secondaryBlue),
                                            ),
                                          ),
                                        ],
                                      ),
                                  ],
                                ),
                              ),
                              const SizedBox(
                                height: 15,
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
