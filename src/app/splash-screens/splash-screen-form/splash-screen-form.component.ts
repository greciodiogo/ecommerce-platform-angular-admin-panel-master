import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SplashScreensService, SplashScreen } from '../splash-screens.service';

@Component({
  selector: 'app-splash-screen-form',
  templateUrl: './splash-screen-form.component.html',
  styleUrls: ['./splash-screen-form.component.scss'],
})
export class SplashScreenFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  splashScreenId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private splashScreensService: SplashScreensService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      imageUrl: ['', [Validators.required, Validators.maxLength(500)]],
      order: [0, [Validators.required, Validators.min(0)]],
      duration: [3000, [Validators.required, Validators.min(1000)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.splashScreenId = +id;
      this.loadSplashScreen(this.splashScreenId);
    }
  }

  loadSplashScreen(id: number): void {
    this.loading = true;
    this.splashScreensService.findOne(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar splash screen:', error);
        this.loading = false;
        this.router.navigate(['/splash-screens']);
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    const request = this.isEditMode
      ? this.splashScreensService.update(this.splashScreenId!, formData)
      : this.splashScreensService.create(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/splash-screens']);
      },
      error: (error) => {
        console.error('Erro ao salvar:', error);
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/splash-screens']);
  }
}
