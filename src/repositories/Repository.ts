import { v4 as uuidv4 } from 'uuid';

interface TEntity {
  id: string;
}

interface Context<T> {
  [key: string]: T;
}

export abstract class Repository<T extends TEntity> implements IRepository<T> {
  adicionar(obj: T): T {
    obj.id = uuidv4();

    this._context[obj.id] = obj;
    return obj;
  }

  listar(): T[] {
    return Object.keys(this._context).map(key => this._context[key]);
  }

  editar(id: string, obj: Partial<T>): T {
    const novo = {
      ...this.obterPorId(id),
      ...obj
    };
    this._context[id] = novo;
    return novo;
  }

  obterPorId(id: string): T {
    return this._context[id];
  }

  remover(key: string): boolean {
    if (this._context[key]) {
      delete this._context[key];
      return true;
    }
    return false;
  }

  private _context: Context<T> = {};
}
