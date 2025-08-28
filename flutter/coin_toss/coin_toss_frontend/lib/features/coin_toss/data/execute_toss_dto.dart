import 'package:borsh_annotation/borsh_annotation.dart';
import 'package:solana/solana.dart';

part 'execute_toss_dto.g.dart';

@BorshSerializable()
class ExecuteTossDto with _$ExecuteTossDto {
  factory ExecuteTossDto({
    @BBool() required bool won,
  }) = _ExecuteTossDto;

  ExecuteTossDto._();

  factory ExecuteTossDto.fromBorsh(Uint8List data) =>
      _$ExecuteTossDtoFromBorsh(data);
}

