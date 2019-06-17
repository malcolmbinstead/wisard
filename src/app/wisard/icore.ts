//
import { IClassifier } from './iclassifier';
import { Classifier } from './classifier';
import { IWObject } from './iwobject';
/**
 *
 */
export interface ICore {
  //
  // Diagnostics.
  getCodeVersion(): string;
  getTextureCount(): number;
  getBufferCount(): number;
  getFramebufferCount(): number;
  getVertexArrayCount(): number;
  getRenderCounter(): number;
  getRenderRate(): number;
  //
  addClassifier(theClassifier: Classifier);
  getClassifierCount(): number;
  getClassifierByIndex(theIndex: number): IClassifier;
  findClassifierById(theId: number): IClassifier;
  findClassifierIndexById(theId: number): number;
  removeClassifierById(theId: number);
  removeClassifierByIndex(theIndex: number);
  removeAllClassifiers();
  //
  findClassifierByClassId(theClassId: string): IClassifier;
  findObjectByClassIdNameId(theClassIdNameId: string): IWObject;
  //
  open(): boolean;
  close();
  //
  start();
  stop();
  isRunning(): boolean;

  //
  findElements();
  //
  reallocate();
  //
}
