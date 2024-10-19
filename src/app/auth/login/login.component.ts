import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  afterRender,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  private form = viewChild<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    const savedForm = window.localStorage.getItem('saved-login-form');
    if (savedForm) {
      const loadedForm = JSON.parse(savedForm);
      const savedEmail = loadedForm.email;
      this.form()?.controls['email'].setValue(savedEmail);
    }
    afterRender(() => {
      const subscription = this.form()?.valueChanges?.subscribe({
        next: (value) => {
          window.localStorage.setItem(
            'saved-login-form',
            JSON.stringify({ email: value.email })
          );
        },
      });

      this.destroyRef.onDestroy(() => subscription?.unsubscribe());
    });
  }
  OnSubmitForm(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }

    console.log(formData.form.value.email);
    console.log(formData.form.value.password);
    console.log(formData);
  }
}
