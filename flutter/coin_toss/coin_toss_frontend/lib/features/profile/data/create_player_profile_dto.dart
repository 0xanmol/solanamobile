import 'package:borsh_annotation/borsh_annotation.dart';

part 'create_player_profile_dto.g.dart';

@BorshSerializable()
class CreatePlayerProfileDto with _$CreatePlayerProfileDto {
  factory CreatePlayerProfileDto({
    @BString() required String name,
  }) = _CreatePlayerProfileDto;

  CreatePlayerProfileDto._();

  factory CreatePlayerProfileDto.fromBorsh(Uint8List data) =>
      _$CreatePlayerProfileDtoFromBorsh(data);
}
