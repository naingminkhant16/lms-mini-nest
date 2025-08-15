import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';

@Injectable()
@ValidatorConstraint({ name: 'IsUnique', async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entityClass, property] = args.constraints;
    const repository = this.dataSource.getRepository(entityClass);
    const exists = await repository.findOne({ where: { [property]: value } });
    return !exists;
  }

  defaultMessage(args: ValidationArguments): string {
    const [_, property] = args.constraints;
    return `${property} "${args.value}" already exists.`;
  }
}
