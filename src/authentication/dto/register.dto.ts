import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Match } from '../../utils/match.decorator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  // @IsString()
  // @IsNotEmpty()
  // name: string;

  @ApiProperty({
    deprecated: true,
    description: 'Use the name property instead',
  })
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @Match('password')
  passwordConfirm: string;
}
