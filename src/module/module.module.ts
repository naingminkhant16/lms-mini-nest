import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
@Module({ imports: [TypeOrmModule.forFeature([ModuleEntity])] })
export class ModuleModule {}
