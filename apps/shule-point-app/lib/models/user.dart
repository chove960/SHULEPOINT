class User {
  final String id;
  final String firstName;
  final String lastName;
  final String username;
  final String email;
  final String userType;
  final String userRole;
  final String schoolRegNumber;
  final String studentID;
  final String dateJoined;
  final bool hasProfile;
  final Profile profile;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.username,
    required this.email,
    required this.userType,
    required this.userRole,
    required this.schoolRegNumber,
    required this.studentID,
    required this.dateJoined,
    required this.hasProfile,
    required this.profile,
  });

  factory User.fromJson(dynamic json) {
    return User(
      id: json['_id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      userType: json['userType'] ?? '',
      userRole: json['userRole'] ?? '',
      schoolRegNumber: json['schoolRegNumber'] ?? '',
      studentID: json['studentID'] ?? '',
      dateJoined: json['dateJoined'] ?? '',
      hasProfile: json['hasProfile'] ?? false,
      profile: Profile.fromJson(json['Profile'] ?? {}),
    );
  }
}

class Profile {
  final String profilePic;
  final String dateOfBirth;
  final String gender;
  final String phoneNumber;
  final Address address;

  Profile({
    required this.profilePic,
    required this.dateOfBirth,
    required this.gender,
    required this.phoneNumber,
    required this.address,
  });

  factory Profile.fromJson(dynamic json) {
    return Profile(
      profilePic: json['profilePic'] ?? '',
      dateOfBirth: json['dateOfBirth'] ?? '',
      gender: json['gender'] ?? '',
      phoneNumber: json['phoneNumber'] ?? '',
      address: Address.fromJson(json['address'] ?? {}),
    );
  }
}

class Address {
  final String city;
  final String state;
  final String country;

  Address({
    required this.city,
    required this.state,
    required this.country,
  });

  factory Address.fromJson(dynamic json) {
    return Address(
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      country: json['country'] ?? '',
    );
  }
}
