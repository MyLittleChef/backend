import { Repository, EntityRepository } from 'typeorm';
import {
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Instruction } from './entities/instruction.entity';
import { CreateInstructionDto } from './dto/create-instruction.dto';
@EntityRepository(Instruction)
export class InstructionRepository extends Repository<Instruction> {
  private logger = new Logger('IngredientQuantityRepository');

  async createInstruction(createInstructionDto:CreateInstructionDto):Promise<Instruction>{
    const { content, index } = createInstructionDto;
    const instruction = this.create();
    instruction.content = content;
    instruction.index = index;

    try {
      await instruction.save();
    } catch (error) {
      this.logger.verbose(
        `Problem while saving the instruction: ${instruction}, error is : ${error} !`,
      );
      throw new InternalServerErrorException(error);
    }
    return instruction;
  }
}