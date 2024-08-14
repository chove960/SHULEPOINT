class School {
  final String id;
  final String logo;
  final String name;
  final String shortName;
  final String registrationNumber;
  final String phoneNumber;
  final String email;
  final String website;
  final Address address;
  final List<GradeLevel> gradeLevels;

  School({
    required this.id,
    required this.logo,
    required this.name,
    required this.shortName,
    required this.registrationNumber,
    required this.phoneNumber,
    required this.email,
    required this.website,
    required this.address,
    required this.gradeLevels,
  });

  factory School.fromJson(dynamic json) {
    return School(
      id: json['_id'] as String,
      logo: json['logo'] as String,
      name: json['name'] as String,
      shortName: json['shortName'] as String,
      registrationNumber: json['registrationNumber'] as String,
      phoneNumber: json['phoneNumber'] as String,
      email: json['email'] as String,
      website: json['website'] as String,
      address: Address.fromJson(json['address']),
      gradeLevels: json['gradeLevels']
          .map<GradeLevel>(
            (json) => GradeLevel.fromJson(json),
          )
          .toList(),
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
      city: json['city'] as String,
      state: json['state'] as String,
      country: json['country'] as String,
    );
  }
}

class GradeLevel {
  final String name;
  final List subjectsOffered;

  GradeLevel({
    required this.name,
    required this.subjectsOffered,
  });

  factory GradeLevel.fromJson(dynamic json) {
    return GradeLevel(
      name: json['name'] as String,
      subjectsOffered: json['subjectsOffered'] as List,
    );
  }
}
