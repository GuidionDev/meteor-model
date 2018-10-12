import {ValidationRule} from '../validation'

import * as Match from 'mtr-match'

interface DataTypeValidatorParams { type: string }

export class DataTypeValidator extends ValidationRule<DataTypeValidatorParams> {
  constructor(params){
    super(params);
    this.params = params;
  }
  protected conditions:Array<Function> = [
    () => {
      let match:Boolean = true;
      for(let attrName in this.toValue){
        let attrDef = this.params[attrName];
        if(attrDef){
          let actualAttr = this.toValue[attrName];
          var valid = this.match(actualAttr, attrDef);
          if(!valid){
            match = false;
          }
        } else {
            match = false;
            this.addInvalidMessage(attrName + ' is not an allowed attribute for this object');
        }
      }
      return match;
    }
  ]
  
  //Wrapper for some faulty code in mtr-match
  public match(actualAttr, attrDef){
    try { 
      return Match.test(actualAttr, attrDef);
    } catch (e) {
      if (e instanceof Error)
      {
        this.addInvalidMessage(e.message); 
        return false;
      }
      // Rethrow other errors.
      throw e;
    }
  }
}
