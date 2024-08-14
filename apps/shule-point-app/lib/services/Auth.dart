import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

FlutterSecureStorage storage = const FlutterSecureStorage();

class AuthService {
  final baseurl = dotenv.env['API_URL'];

  Future<dynamic> register(
    Map userReg,
    String studentInfoID,
    String parentType,
  ) async {
    try {
      final res = await Dio().post(
        '$baseurl/auth/register/?userRole=${userReg['userRole']}&studentInfoID=$studentInfoID&parentType=$parentType',
        data: json.encode(userReg),
      );

      return res.data;
    } on DioException catch (e) {
      return e.response!.data['error']['response']['error'];
    }
  }

  Future<dynamic> login(Map userCred) async {
    try {
      final res = await Dio().post(
        '$baseurl/auth/login/',
        data: json.encode(userCred),
      );

      return res.data;
    } on DioException catch (e) {
      return e.response!.data['error'];
    }
  }

  static setToken(String userID, String authToken) async {
    await storage.write(key: 'userID', value: userID);
    await storage.write(key: 'authToken', value: authToken);
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'authToken');
  }

  Future<bool> isLoggedIn() async {
    return await storage.containsKey(key: 'authToken');
  }

  static removeToken() async {
    await storage.deleteAll();
  }
}
