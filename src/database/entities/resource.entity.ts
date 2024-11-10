// src/resources/resource.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  url_pattern: string;

  @Column({ default: false })
  is_premium: boolean;
}
