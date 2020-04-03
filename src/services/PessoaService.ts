import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PessoaService implements IPessoaService {
  constructor(
    @inject('IPessoaRepository') private _repository: IPessoaRepository
  ) {}

  adicionar(obj: IPessoa): IPessoa {
    return this._repository.adicionar(obj);
  }
  listar(): IPessoa[] {
    return this._repository.listar();
  }

  editar(id: string, obj: Partial<IPessoa>): IPessoa {
    return this._repository.editar(id, obj);
  }

  obterPorId(id: string): IPessoa {
    return this._repository.obterPorId(id);
  }

  remover(key: string): boolean {
    return this._repository.remover(key);
  }
}
