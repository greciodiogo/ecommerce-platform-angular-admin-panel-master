import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BannersService, Banner } from '../banners.service';

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.scss'],
})
export class BannerFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  bannerId?: number;
  loading = false;
  imagePtFile?: File;
  imageEnFile?: File;
  imagePtPreview?: string;
  imageEnPreview?: string;
  currentBanner?: Banner;

  constructor(
    private fb: FormBuilder,
    private bannersService: BannersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      linkUrl: ['', [Validators.maxLength(500)]],
      order: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.bannerId = +id;
      this.loadBanner(this.bannerId);
    }
  }

  loadBanner(id: number): void {
    this.loading = true;
    this.bannersService.findOne(id).subscribe({
      next: (data) => {
        this.currentBanner = data;
        this.form.patchValue(data);
        if (data.imageUrlPt) {
          this.imagePtPreview = this.bannersService.getImageUrl(data.imageUrlPt);
        }
        if (data.imageUrlEn) {
          this.imageEnPreview = this.bannersService.getImageUrl(data.imageUrlEn);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar banner:', error);
        this.loading = false;
        this.router.navigate(['/banners']);
      },
    });
  }

  onImagePtSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imagePtFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePtPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imagePtFile);
    }
  }

  onImageEnSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageEnFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageEnPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.imageEnFile);
    }
  }

  removeImagePt(): void {
    if (this.isEditMode && this.currentBanner?.imageUrlPt) {
      if (confirm('Tem certeza que deseja remover a imagem PT?')) {
        this.bannersService.deleteImage(this.bannerId!, 'pt').subscribe({
          next: (banner) => {
            this.currentBanner = banner;
            this.imagePtPreview = undefined;
            this.imagePtFile = undefined;
          },
          error: (error) => {
            console.error('Erro ao remover imagem:', error);
            alert('Erro ao remover imagem');
          },
        });
      }
    } else {
      this.imagePtPreview = undefined;
      this.imagePtFile = undefined;
    }
  }

  removeImageEn(): void {
    if (this.isEditMode && this.currentBanner?.imageUrlEn) {
      if (confirm('Tem certeza que deseja remover a imagem EN?')) {
        this.bannersService.deleteImage(this.bannerId!, 'en').subscribe({
          next: (banner) => {
            this.currentBanner = banner;
            this.imageEnPreview = undefined;
            this.imageEnFile = undefined;
          },
          error: (error) => {
            console.error('Erro ao remover imagem:', error);
            alert('Erro ao remover imagem');
          },
        });
      }
    } else {
      this.imageEnPreview = undefined;
      this.imageEnFile = undefined;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    if (!this.isEditMode && !this.imagePtFile && !this.imageEnFile) {
      alert('Por favor, adicione pelo menos uma imagem (PT ou EN)');
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Adicionar campos do formulário
    Object.keys(this.form.value).forEach(key => {
      const value = this.form.value[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Adicionar imagens
    if (this.imagePtFile) {
      formData.append('imagePt', this.imagePtFile);
    }
    if (this.imageEnFile) {
      formData.append('imageEn', this.imageEnFile);
    }

    const request = this.isEditMode
      ? this.bannersService.update(this.bannerId!, formData)
      : this.bannersService.create(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/banners']);
      },
      error: (error) => {
        console.error('Erro ao salvar:', error);
        this.loading = false;
        alert('Erro ao salvar banner. Verifique os dados e tente novamente.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/banners']);
  }
}
