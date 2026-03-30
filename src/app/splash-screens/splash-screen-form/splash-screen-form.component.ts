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
  imageFile?: File;
  imagePreview?: string;
  currentSplashScreen?: SplashScreen;

  constructor(
    private fb: FormBuilder,
    private splashScreensService: SplashScreensService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
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
        this.currentSplashScreen = data;
        this.form.patchValue(data);
        if (data.imageUrl) {
          this.imagePreview = this.splashScreensService.getImageUrl(data.imageUrl);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar splash screen:', error);
        this.loading = false;
        this.router.navigate(['/splash-screens']);
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  removeImage(): void {
    if (this.isEditMode && this.currentSplashScreen?.imageUrl) {
      if (confirm('Tem certeza que deseja remover a imagem?')) {
        this.splashScreensService.deleteImage(this.splashScreenId!).subscribe({
          next: (splashScreen) => {
            this.currentSplashScreen = splashScreen;
            this.imagePreview = undefined;
            this.imageFile = undefined;
          },
          error: (error) => {
            console.error('Erro ao remover imagem:', error);
            alert('Erro ao remover imagem');
          },
        });
      }
    } else {
      this.imagePreview = undefined;
      this.imageFile = undefined;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (!this.isEditMode && !this.imageFile) {
      alert('Por favor, adicione uma imagem');
      return;
    }

    this.loading = true;
    const formData = new FormData();

    Object.keys(this.form.value).forEach(key => {
      const value = this.form.value[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

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
        alert('Erro ao salvar splash screen. Verifique os dados e tente novamente.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/splash-screens']);
  }
}
