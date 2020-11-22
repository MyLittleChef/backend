import { IsNotEmpty } from "class-validator";

export class GetMarkDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    apiKey: string;
}
