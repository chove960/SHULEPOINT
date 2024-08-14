import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/student.dart';

FlutterSecureStorage storage = const FlutterSecureStorage();

class StudentService {
  final baseurl = dotenv.env['API_URL'];

  Future<dynamic> getStudentByVerificationCode(
    String schoolRegNumber,
    String verificationCode,
  ) async {
    final res = await Dio().get('$baseurl/student/', queryParameters: {
      "schoolRegNumber": schoolRegNumber,
      "studentVerificationCode": verificationCode
    });

    if (res.statusCode == 200) {
      return Student.fromJson(res.data);
    } else {
      return <Student>{};
    }
  }

  Future<dynamic> getStudent(
    String schoolRegNumber,
    String studentID,
  ) async {
    final res = await Dio().get('$baseurl/student/', queryParameters: {
      "schoolRegNumber": schoolRegNumber,
      "studentID": studentID
    });

    if (res.statusCode == 200) {
      return Student.fromJson(res.data);
    } else {
      return <Student>{};
    }
  }
}
