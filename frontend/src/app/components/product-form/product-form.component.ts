import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  readonly NAME_MAX = 180;
  readonly SKU_MAX = 50;

  product: Product = { name: '', sku: '', price: null as unknown as number, quantity: null as unknown as number, status: true };
  id?: number;
  errorMessage = '';
  confirmingDelete = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = Number(paramId);
      this.productService.getById(this.id).subscribe(product => (this.product = product));
    }
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const request = this.id
      ? this.productService.update(this.id, this.product)
      : this.productService.create(this.product);

    request.subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: HttpErrorResponse) =>
        (this.errorMessage = err.error?.error ?? 'Não foi possível salvar o produto.')
    });
  }

  remove(): void {
    this.productService.delete(this.id!).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => (this.errorMessage = 'Não foi possível excluir o produto.')
    });
  }
}
