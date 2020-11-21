import {IsOptional} from 'class-validator';

export class GetSuggestedRecipesDto {
    @IsOptional()
    nb: string;
}
