import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../models/school.dart';

FlutterSecureStorage storage = const FlutterSecureStorage();

class SchoolService {
  final baseurl = dotenv.env['API_URL'];

  Future<dynamic> getSchools() async {
    final res = await Dio().get('$baseurl/school/all');

    if (res.statusCode == 200) {
      Iterable resData = res.data;

      final schools = resData
          .map(
            (school) => School.fromJson(school),
          )
          .toList();

      return schools;
    } else {
      return <School>[];
    }
  }

  Future<dynamic> getSchool(schoolRegNumber) async {
    return;
  }
}
