import { DataSource } from "typeorm";

export abstract class BaseSeed {
    
    abstract run(dataSource: DataSource): Promise<void>;
}