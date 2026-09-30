import { Request, Response } from 'express';
import * as productService from '../services/product.service';

function invalidPayload(body: {
  name?: string; sku?: string; price?: unknown; quantity?: unknown;
}): string | null {
  if (!body.name || body.name.length > 180) return 'Nome obrigatório (máx. 180 caracteres)';
  if (!body.sku || body.sku.length > 50) return 'SKU obrigatório (máx. 50 caracteres)';
  if (typeof body.price !== 'number' || !(body.price >= 0)) return 'Preço inválido';
  if (!Number.isInteger(body.quantity) || (body.quantity as number) < 0) return 'Quantidade inválida';
  return null;
}

// 23505 = violação de UNIQUE no PostgreSQL (SKU duplicado)
function handleWriteError(err: unknown, res: Response): void {
  if ((err as { code?: string }).code === '23505') {
    res.status(409).json({ error: 'Já existe um produto com este SKU' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor' });
}

export async function index(req: Request, res: Response): Promise<void> {
  const { name, status } = req.query;
  const filters: { name?: string; status?: boolean } = {};
  if (name) filters.name = String(name);
  if (status !== undefined) filters.status = status === 'true';

  const products = await productService.listProducts(filters);
  res.json(products);
}

export async function show(req: Request, res: Response): Promise<void> {
  const product = await productService.getProduct(Number(req.params.id));
  res.json(product);
}

export async function store(req: Request, res: Response): Promise<void> {
  const error = invalidPayload(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    handleWriteError(err, res);
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const error = invalidPayload(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }
  try {
    const product = await productService.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    handleWriteError(err, res);
  }
}

export async function patch(req: Request, res: Response): Promise<void> {
  try {
    const product = await productService.patchProduct(Number(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    handleWriteError(err, res);
  }
}

export async function destroy(req: Request, res: Response): Promise<void> {
  await productService.deleteProduct(Number(req.params.id));
  res.status(204).send();
}
