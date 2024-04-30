import {PlainObject} from '../../common.dto';

interface IBetween {
  key: string;
  from?: PlainObject;
  to?: PlainObject;
  value?: PlainObject;
}

interface ILike {
  key: string;
  values: string[] | string;
}

export interface FilteringOptions {
  filter: {
    customFilter: IBetween[];
    findBetween: IBetween[];
    findLike: ILike[];
    findIn: PlainObject[];
    notIn?: PlainObject[];
  };
}
