// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'execute_toss_dto.dart';

// **************************************************************************
// BorshSerializableGenerator
// **************************************************************************

mixin _$ExecuteTossDto {
  bool get won => throw UnimplementedError();

  Uint8List toBorsh() {
    final writer = BinaryWriter();

    const BBool().write(writer, won);

    return writer.toArray();
  }
}

class _ExecuteTossDto extends ExecuteTossDto {
  _ExecuteTossDto({required this.won}) : super._();

  final bool won;
}

class BExecuteTossDto implements BType<ExecuteTossDto> {
  const BExecuteTossDto();

  @override
  void write(BinaryWriter writer, ExecuteTossDto value) {
    writer.writeStruct(value.toBorsh());
  }

  @override
  ExecuteTossDto read(BinaryReader reader) {
    return ExecuteTossDto(won: const BBool().read(reader));
  }
}

ExecuteTossDto _$ExecuteTossDtoFromBorsh(Uint8List data) {
  final reader = BinaryReader(data.buffer.asByteData());

  return const BExecuteTossDto().read(reader);
}
