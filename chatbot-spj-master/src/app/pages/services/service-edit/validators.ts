import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export function uniqueBusinessParamValidator(mappings: FormArray): ValidatorFn {
  return (control: AbstractControl) => {
    if (!mappings) {
      return null;
    }
    const mappingCtrls = mappings.controls;
    for (let i = 0; i < mappingCtrls.length; i++) {
      const toCompare = mappingCtrls[i].get('businessParam');
      if (toCompare !== control && toCompare.value === control.value && control.value != null) {
        return { duplicateParam: true };
      }
    }
    return null;
  };
}
