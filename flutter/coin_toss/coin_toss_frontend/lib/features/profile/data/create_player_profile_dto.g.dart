// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_player_profile_dto.dart';

// **************************************************************************
// BorshSerializableGenerator
// **************************************************************************

mixin _$CreatePlayerProfileDto {
  String get name => throw UnimplementedError();

  Uint8List toBorsh() {
    final writer = BinaryWriter();

    const BString().write(writer, name);

    return writer.toArray();
  }
}

class _CreatePlayerProfileDto extends CreatePlayerProfileDto {
  _CreatePlayerProfileDto({required this.name}) : super._();

  final String name;
}

class BCreatePlayerProfileDto implements BType<CreatePlayerProfileDto> {
  const BCreatePlayerProfileDto();

  @override
  void write(BinaryWriter writer, CreatePlayerProfileDto value) {
    writer.writeStruct(value.toBorsh());
  }

  @override
  CreatePlayerProfileDto read(BinaryReader reader) {
    return CreatePlayerProfileDto(name: const BString().read(reader));
  }
}

CreatePlayerProfileDto _$CreatePlayerProfileDtoFromBorsh(Uint8List data) {
  final reader = BinaryReader(data.buffer.asByteData());

  return const BCreatePlayerProfileDto().read(reader);
}
