import './user.dart';

class Student {
  final String id;
  final String schoolRegNumber;
  final String studentID;
  final String fullname;
  final String dateOfBirth;
  final String gender;
  final String photo;
  final String gradeLevel;
  final String verificationCode;
  final Address address;
  final ParentsInfo parentalInformation;
  final List outstandingFees;
  final List<StudentReport> progressReport;
  final Object attendanceReport;

  Student({
    required this.id,
    required this.schoolRegNumber,
    required this.studentID,
    required this.fullname,
    required this.dateOfBirth,
    required this.gender,
    required this.photo,
    required this.gradeLevel,
    required this.verificationCode,
    required this.address,
    required this.parentalInformation,
    required this.outstandingFees,
    required this.progressReport,
    required this.attendanceReport,
  });

  factory Student.fromJson(dynamic json) {
    var studentReportList = json['progressReport'] as List;

    List<StudentReport> studentReports = studentReportList
        .map((reportJson) => StudentReport.fromJson(reportJson))
        .toList();

    return Student(
      id: json['_id'] ?? '',
      schoolRegNumber: json['schoolRegNumber'] ?? '',
      studentID: json['studentID'] ?? '',
      fullname: json['fullname'] ?? '',
      dateOfBirth: json['dateOfBirth'] ?? '',
      gender: json['gender'] ?? '',
      photo: json['photo'] ?? '',
      gradeLevel: json['gradeLevel'] ?? '',
      verificationCode: json['verificationCode'] ?? '',
      address: Address.fromJson(json['address'] ?? {}),
      parentalInformation: ParentsInfo.fromJson(json['parentalInformation']),
      outstandingFees: json['outstandingFees'] as List,
      progressReport: studentReports,
      attendanceReport: json['attendanceReport'] ?? [],
    );
  }
}

class ParentsInfo {
  final ParentInfo fatherInfo;
  final ParentInfo motherInfo;

  ParentsInfo({
    required this.fatherInfo,
    required this.motherInfo,
  });

  factory ParentsInfo.fromJson(dynamic json) {
    return ParentsInfo(
      fatherInfo: ParentInfo.fromJson(json["fatherInfo"] ?? {}),
      motherInfo: ParentInfo.fromJson(json["motherInfo"] ?? {}),
    );
  }
}

class ParentInfo {
  final String fullname;
  final String phoneNumber;
  final String email;
  final Address address;

  ParentInfo({
    required this.fullname,
    required this.phoneNumber,
    required this.email,
    required this.address,
  });

  factory ParentInfo.fromJson(dynamic json) {
    return ParentInfo(
      fullname: json['fullname'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      email: json['email'] ?? '',
      address: Address.fromJson(json['address'] ?? {}),
    );
  }
}

class SubjectAssessment {
  final String assessmentName;
  final String marks;

  SubjectAssessment({
    required this.assessmentName,
    required this.marks,
  });

  factory SubjectAssessment.fromJson(dynamic json) {
    return SubjectAssessment(
      assessmentName: json['assessmentName'] ?? '',
      marks: json['marks'] ?? '',
    );
  }
}

class StudentAssessment {
  final String subject;
  final List<SubjectAssessment> assessments;
  final String totalScore;

  StudentAssessment({
    required this.subject,
    required this.assessments,
    required this.totalScore,
  });

  factory StudentAssessment.fromJson(dynamic json) {
    var subjectAssessmentsList = json['assessments'] as List;

    List<SubjectAssessment> subjectAssessments = subjectAssessmentsList
        .map((reportJson) => SubjectAssessment.fromJson(reportJson))
        .toList();

    return StudentAssessment(
      subject: json['subject'] ?? '',
      assessments: subjectAssessments,
      totalScore: json['totalScore'] ?? '',
    );
  }
}

class TermAssessment {
  final String name;
  final double value;

  TermAssessment({required this.name, required this.value});

  factory TermAssessment.fromJson(dynamic json) {
    return TermAssessment(
        name: json['name'] ?? '', value: json['value'] ?? 0.0);
  }
}

class StudentReport {
  final String year;
  final String gradeLevel;
  final String schoolTerm;
  final List<TermAssessment> termAssessments;
  final List<StudentAssessment> assessments;

  StudentReport({
    required this.year,
    required this.gradeLevel,
    required this.schoolTerm,
    required this.termAssessments,
    required this.assessments,
  });

  factory StudentReport.fromJson(dynamic json) {
    var studentAssessmentsList = json['assessments'] as List;
    var termAssessmentsList = json['termAssessments'] as List;

    List<StudentAssessment> studentAssessments = studentAssessmentsList
        .map((reportJson) => StudentAssessment.fromJson(reportJson))
        .toList();

    List<TermAssessment> termAssessments = termAssessmentsList
        .map((reportJson) => TermAssessment.fromJson(reportJson))
        .toList();

    return StudentReport(
      year: json['year'] ?? '',
      gradeLevel: json['gradeLevel'] ?? '',
      schoolTerm: json['schoolTerm'] ?? '',
      termAssessments: termAssessments,
      assessments: studentAssessments,
    );
  }
}
