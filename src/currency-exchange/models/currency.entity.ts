import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sellCurrency: string;

  @Column()
  buyCurrency: string;

  @Column('decimal', { precision: 10, scale: 6 })
  rate: number;
}
