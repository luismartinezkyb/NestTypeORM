import { IsInt, IsNotEmpty, IsNumber, IsString, isInt } from "class-validator"

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  authorId: number;
}
