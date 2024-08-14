// ignore_for_file: implementation_imports

import 'package:dio/dio.dart';
import 'package:dio/src/options.dart' as dio_options;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shule_point_app/services/auth.dart';
import '../models/user.dart';

FlutterSecureStorage storage = const FlutterSecureStorage();

class UserService {
  final baseurl = dotenv.env['API_URL'];
  final userID = storage.read(key: 'userID');
  final _token = storage.read(key: 'authToken');

  Future<dynamic> getUser() async {
    String? queryUserID = await userID;
    String? token = await _token;

    try {
      final res = await Dio().get('$baseurl/user/',
          options: dio_options.Options(
            headers: {'authToken': token},
          ),
          queryParameters: {"userID": queryUserID});

      if (res.statusCode == 200) {
        return User.fromJson(res.data);
      } else {
        AuthService.removeToken();
        return null;
      }
    } on DioError catch (e) {
      print(e.response!.data['error']['response']['error']);
      return null;
    }
  }
}
