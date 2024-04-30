import {FixInterface} from './fix.interface';

export class Fix {
  id: number | undefined;

  timestamp: number;

  name: string;

  runAt: number;

  instance?: FixInterface;

  constructor(id: number | undefined, timestamp: number, name: string, runAt: number, instance?: FixInterface) {
    this.id = id;
    this.timestamp = timestamp;
    this.name = name;
    this.runAt = runAt;
    this.instance = instance;
  }
}
