import {Instruction} from "./entities/instructions.entity";
import {EntityRepository, Repository} from "typeorm";
import {ForbiddenException, InternalServerErrorException, Logger} from "@nestjs/common";
import {CreateInstructionDto} from "./dto/create-instruction.dto";
import {Recette} from "./entities/recette.entity";

@EntityRepository(Instruction)
export class InstructionRepository extends Repository<Instruction> {
    private logger = new Logger('IngredientRepository');
    async createInstruction(createInstructionDto: CreateInstructionDto, createdRecipe:Recette): Promise<Instruction> {
        const { index, content} = createInstructionDto;
        const instruction = this.create();
        instruction.recette = createdRecipe;
        instruction.index = index;
        instruction.content = content;

        try {
            await instruction.save();
        } catch (error) {
            if (error.code == 23505) {
                //Duplicate nom
                const existing = this.findOne({where: {}});
                return existing;
            } else {
                this.logger.verbose(
                    `Problem while saving the Recette: ${instruction}, error is : ${error} !`,
                );
                throw new InternalServerErrorException(error);
            }
        }
        return instruction;
    }
}
