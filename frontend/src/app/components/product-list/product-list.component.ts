import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

export type StatusFilter = 'all' | 'active' | 'inactive';
export type StockFilter = 'all' | 'low' | 'out';
export type SortKey = 'name' | 'sku' | 'price' | 'quantity' | 'status';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly LOW_STOCK = 5;
  readonly pageSize = 8;

  products: Product[] = [];      // resultado filtrado (tabela)
  allProducts: Product[] = [];   // todos os produtos (KPIs, independentes do filtro)
  private refreshSub?: Subscription;
  searchName = '';
  searchStatus: StatusFilter = 'all';
  stockFilter: StockFilter = 'all';

  sortKey: SortKey = 'name';
  sortAsc = true;
  page = 1;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.load();
    // Mantém tabela e KPIs em dia com mudanças feitas direto no banco
    this.refreshSub = interval(5000).subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  private get statusFilter(): boolean | undefined {
    return this.searchStatus === 'active' ? true :
           this.searchStatus === 'inactive' ? false :
           undefined;
  }

  /** Recarrega os dados sem voltar para a página 1 (usado no refresh automático). */
  refresh(): void {
    this.productService.list({ name: this.searchName, status: this.statusFilter })
      .subscribe(products => {
        this.products = products;
        this.goTo(this.page);
      });
    this.productService.list().subscribe(all => (this.allProducts = all));
  }

  /** Busca/filtro alterado pelo usuário: recarrega e volta para a página 1. */
  load(): void {
    this.productService.list({ name: this.searchName, status: this.statusFilter })
      .subscribe(products => {
        this.products = products;
        this.page = 1;
      });
    this.productService.list().subscribe(all => (this.allProducts = all));
  }

  /** Valor total em estoque (preço × quantidade) dos produtos ativos. */
  get stockValue(): number {
    return this.allProducts
      .filter(p => p.status)
      .reduce((sum, p) => sum + p.price * p.quantity, 0);
  }

  get activeCount(): number {
    return this.allProducts.filter(p => p.status).length;
  }

  /** Ativos com estoque baixo, mas ainda não zerado. */
  get lowStockCount(): number {
    return this.allProducts.filter(p => p.status && p.quantity > 0 && p.quantity <= this.LOW_STOCK).length;
  }

  get outOfStockCount(): number {
    return this.allProducts.filter(p => p.status && p.quantity === 0).length;
  }

  stockLevel(p: Product): 'out' | 'low' | 'ok' {
    if (p.quantity === 0) return 'out';
    return p.quantity <= this.LOW_STOCK ? 'low' : 'ok';
  }

  /** Produtos da tabela: resultado da busca + filtro de estoque escolhido nos KPIs. */
  get visibleProducts(): Product[] {
    if (this.stockFilter === 'low') {
      return this.products.filter(p => p.quantity > 0 && p.quantity <= this.LOW_STOCK);
    }
    if (this.stockFilter === 'out') {
      return this.products.filter(p => p.quantity === 0);
    }
    return this.products;
  }

  /** Clique num KPI: aplica o filtro que ele representa (clicar de novo limpa). */
  applyKpi(kpi: 'all' | 'active' | 'low' | 'out'): void {
    const alreadyActive = this.isKpiActive(kpi);
    this.stockFilter = 'all';
    this.searchStatus = 'all';

    if (!alreadyActive) {
      if (kpi === 'active') this.searchStatus = 'active';
      if (kpi === 'low' || kpi === 'out') {
        this.stockFilter = kpi;
        this.searchStatus = 'active'; // os KPIs contam só produtos ativos
      }
    }
    this.load();
  }

  isKpiActive(kpi: 'all' | 'active' | 'low' | 'out'): boolean {
    if (kpi === 'low' || kpi === 'out') return this.stockFilter === kpi;
    if (this.stockFilter !== 'all') return false;
    if (kpi === 'active') return this.searchStatus === 'active';
    return this.searchStatus === 'all' && !this.searchName;
  }

  get sortedProducts(): Product[] {
    const dir = this.sortAsc ? 1 : -1;
    const key = this.sortKey;
    return [...this.visibleProducts].sort((a, b) => {
      if (key === 'name' || key === 'sku') {
        return a[key].localeCompare(b[key], 'pt-BR', { sensitivity: 'base' }) * dir;
      }
      const av = key === 'status' ? Number(!!a.status) : a[key];
      const bv = key === 'status' ? Number(!!b.status) : b[key];
      return (av - bv) * dir;
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.visibleProducts.length / this.pageSize));
  }

  get pagedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.sortedProducts.slice(start, start + this.pageSize);
  }

  sortBy(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.page = 1;
  }

  sortIcon(key: SortKey): string {
    if (this.sortKey !== key) return '';
    return this.sortAsc ? '▲' : '▼';
  }

  goTo(page: number): void {
    this.page = Math.min(Math.max(1, page), this.totalPages);
  }

  edit(product: Product): void {
    this.router.navigate(['/editar', product.id]);
  }

  toggleStatus(product: Product, event: Event): void {
    event.stopPropagation();
    const newStatus = !product.status;
    this.productService.patch(product.id!, { status: newStatus })
      .subscribe(() => {
        product.status = newStatus;
        this.refresh();
      });
  }
}
