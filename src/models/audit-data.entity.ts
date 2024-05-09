import { Column } from 'typeorm';

export class AuditDataEntity {
    @Column()
    created_by!: number;

    @Column()
    updated_by!: number;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updated_at?: Date;
}
