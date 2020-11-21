import {IsNotEmpty} from 'class-validator';

export class DeleteSuggestedRecipesDto {
    @IsNotEmpty()
    id: string[];
}
