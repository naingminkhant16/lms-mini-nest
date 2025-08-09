import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
@Module({ imports: [TypeOrmModule.forFeature([Certificate])] })
export class CertificateModule {}
