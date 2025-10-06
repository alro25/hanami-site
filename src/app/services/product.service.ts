import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Product } from '../componentes/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private productsUrl = 'assets/data/products.json';

  // Usamos shareReplay(1) como um cache simples.
  // Ele faz a requisição uma vez e guarda o resultado para os próximos que pedirem.
  private allProducts$ = this.http.get<Product[]>(this.productsUrl).pipe(
    shareReplay(1)
  );

  // Método para pegar todos os produtos
  getProducts(): Observable<Product[]> {
    return this.allProducts$;
  }

  // Método para pegar produtos por categoria (Batom, Base, etc.)
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.allProducts$.pipe(
      map(products => products.filter(p => p.category === category))
    );
  }

  // Métodos para pegar por tags (Novidades, Kits, etc.)
  getProductsByTag(tag: 'lancamento' | 'kit' | 'edicao-limitada'): Observable<Product[]> {
    return this.allProducts$.pipe(
      map(products => products.filter(p => p.tags.includes(tag)))
    );
  }
}
