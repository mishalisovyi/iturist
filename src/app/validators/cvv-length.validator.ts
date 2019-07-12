import { FormControl } from '@angular/forms';

import { Object } from 'src/app/models/models';

export class CvvLengthValidator {

  public static cvvLength(control: FormControl) {
    const errors: Object = {};
    const input: HTMLInputElement = document.getElementsByTagName('input')[1];

    if (input) {
      if (input.value.length > 0 && input.value.length < 3 || input.value.length > 3) {
        errors.length = true;
        return errors;
      }
      return null;
    }
    return null;
  }
}
