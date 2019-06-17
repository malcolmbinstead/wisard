// tslint:disable:no-redundant-jsdoc
// tslint:disable:variable-name
/**
 *
 */
export class Consts {
  //
  static readonly CodeVersion = '1.0';
  //
  static readonly Core_Canvas = 'W_Canvas';
  // Processing Modes.
  static readonly Mode_None = 0;
  static readonly Mode_Fill = 1;
  static readonly Mode_Copy = 2;
  static readonly Mode_Threshold = 3;
  static readonly Mode_Scramble = 4;
  static readonly Mode_Tuple = 5;
  static readonly Mode_Address = 6;
  static readonly Mode_Decode = 7;
  static readonly Mode_Match = 8;
  static readonly Mode_Merge = 9;
  static readonly Mode_ScoreIn = 10;
  static readonly Mode_ScoreOut = 11;
  //
  static readonly ViewWH_Min = 1;
  static readonly ViewWH_Max = 1024;
  static readonly ViewWH_Def = 32;
  //
  static readonly ScrambleSeed_Def = 32;
  //
  static readonly TupleW_Min = 1;
  static readonly TupleW_Max = 10;
  static readonly TupleW_Def = 8;
  //
  static readonly StoreCount_Min = 0;
  static readonly StoreCount_Max = 26;
  static readonly StoreCount_Def = 0;
  //
  static readonly Assets_Input  = './assets/input/';
  static readonly Assets_Images = './assets/images/';
  static readonly Assets_Icons = './assets/icons/';
  //
}
