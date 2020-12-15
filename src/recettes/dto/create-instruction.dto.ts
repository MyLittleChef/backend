import { IsNotEmpty } from "class-validator";

export class CreateInstructionDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  index: number;

}
