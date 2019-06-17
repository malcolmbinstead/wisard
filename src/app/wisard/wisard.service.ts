import { Injectable } from '@angular/core';
import { LogService } from '../log/log.service';
import { Log } from './log';
import { Http } from './http';
import Core from './core';
import { Config } from './config';
import { IClassifier } from './iclassifier'
import { Classifier } from './classifier';
import { IWObject } from './iwobject';
import { IWObjectRef, IClassifierRef } from './weakref';
import { HttpClient } from '@angular/common/http';
// tslint:disable:no-redundant-jsdoc
/**
 *
 */
@Injectable({
  providedIn: 'root'
})
export class WisardService {
  /**
   *
   */
  constructor(private theLog: LogService, private theHttp: HttpClient) {
    // Make logging and Http available to all the local classes.
    Log.setLog(theLog);
    Http.setHttp(theHttp);
  }
  /**
   * Access the Code version.
   */
  getCodeVersion(): string {
    const aCore = Core.getInst();
    return aCore.getCodeVersion();
  }
  /**
   *
   */
  getTextureCount(): number {
    const aCore = Core.getInst();
    return aCore.getTextureCount();
  }
  /**
   *
   */
  getBufferCount(): number {
    const aCore = Core.getInst();
    return aCore.getBufferCount();
  }
  /**
   *
   */
  getFramebufferCount(): number {
    const aCore = Core.getInst();
    return aCore.getFramebufferCount();
  }
  /**
   *
   */
  getVertexArrayCount(): number {
    const aCore = Core.getInst();
    return aCore.getVertexArrayCount();
  }
  /**
   * How many frames have been rendered.
   */
  getRenderCounter(): number {
    const aCore = Core.getInst();
    return aCore.getRenderCounter();
  }
  /**
   * How many frames per second are being rendered.
   */
  getRenderRate(): number {
    const aCore = Core.getInst();
    return aCore.getRenderRate();
  }
  /**
   * testing - reallocate storage.
   */
  reallocate() {
    const aCore = Core.getInst();
    aCore.reallocate();
  }
  /**
   * What was the last open status message.
   */
  getStatus(): string {
    return Core.getInst().getStatus();
  }
  /**
   * Try to open the module
   * and attempt to start it.
   */
  open(): boolean {
    const aCore = Core.getInst();
    const aOpen = aCore.open();
    this.log('open ' + aOpen);
    if (aOpen === true) {
      // start rendering loop.
      aCore.start();
    }
    return aOpen;
  }
  /**
   * Attempt to create a classifier.
   * This can be configured using a parameter object.
   */
  createClassifier(theParams?: object) {
    const aCore = Core.getInst();
    const aOpen = aCore.open();
    if (aOpen === false) { return; }
    //
    this.log('createClassifier');
    //
    // create the configuration.
    const aConfig = new Config(theParams);
    //
    // create a classifier.
    const aClassifier = new Classifier();
    aClassifier.setConfig(aConfig);
    //
    // add to the core.
    aCore.addClassifier(aClassifier);
  }
  /**
   *
   */
  findElements() {
    this.log('findElements:');
    const aCore = Core.getInst();
    aCore.findElements();
  }
  /**
   * Attempt to locate a Classifier using its Class/Id string.
   */
  private findClassifierByClassId(theClassId: string): IClassifier {
    this.log('findClassifierByClassIdNameId:');
    const aCore = Core.getInst();
    const aReturn = aCore.findClassifierByClassId(theClassId);
    return aReturn;
  }
  /**
   * Attempt to locate a Classifier_Reference using its Class/Id string.
   * Returns an IClassifierRef which only weakly references the found object.
   */
  findClassifierRefByClassId(theClassId: string): IClassifierRef {
    this.log('findClassifierRefByClassIdNameId:');
    let aReturn: IClassifierRef = null;
    const aClassifier = this.findClassifierByClassId(theClassId);
    if (aClassifier !== null) {
      aReturn = new IClassifierRef(aClassifier);
    }
    return aReturn;
  }
  /**
   * Attempt to locate an Object using its Class/Id/Name/Id string.
   * @param theClassIdNameId
   */
  private findObjectByClassIdNameId(theClassIdNameId: string): IWObject {
    this.log('findObjectByClassIdNameId:');
    const aCore = Core.getInst();
    const aReturn = aCore.findObjectByClassIdNameId(theClassIdNameId);
    return aReturn;
  }
  /**
   * Attempt to locate an Object_Reference using its Class/Id/Name/Id string.
   * Returns an IWObjectRef which only weakly references the found object.
   */
  findObjectRefByClassIdNameId(theClassIdNameId: string): IWObjectRef {
    this.log('findObjectRefByClassIdNameId:');
    let aReturn: IWObjectRef = null;
    const aObj = this.findObjectByClassIdNameId(theClassIdNameId);
    if (aObj !== null) {
      aReturn = new IWObjectRef(aObj);
    }
    return aReturn;
  }
  // ----
  /**
   *
   */
  log(theMessage: string) {
    this.theLog.add('WisardService ' + theMessage);
  }
  //
}
