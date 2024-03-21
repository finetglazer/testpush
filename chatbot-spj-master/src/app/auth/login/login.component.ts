import { Component, OnInit, AfterViewInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../@core/services/auth.service';
import { SimpleMessageService } from '../../shared/simple-message.service';
import { TranslateService } from '@ngx-translate/core';
import {AppConfigService} from '../../shared/app-config.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
    document.body.classList.add('p-0');
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        () => {
          if (this.appConfigService.loadBotCode())
            this.router.navigateByUrl(this.returnUrl);
          else
            this.router.navigate(['/pages/bots']);
        },
        (error) => {
          this.loading = false;
          // this.error = error;
          this.error = this.translateService.instant('Username or password is incorrect, Please try again!');
        },
      );
  }
}
