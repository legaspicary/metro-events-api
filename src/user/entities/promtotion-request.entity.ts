import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class PromotionRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: "organizer" })
    promoteTo: string;

    @ManyToOne(() => User, (user) => user.requests)
    requestingUser: User;

    @Column({ default: false })
    isApproved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}