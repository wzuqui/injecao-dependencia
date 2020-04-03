interface IPessoa {
  id: string;
  nome: string;
  email: string;
}

interface IRepository<T> {
  adicionar(obj: T): T;
  listar(): T[];
  editar(id: string, obj: Partial<T>): T;
  obterPorId(id: string): T;
  remover(key: string): boolean;
}

interface IPessoaRepository extends IRepository<IPessoa> {}

interface IService<T> {
  adicionar(obj: Partial<T>): T;
  listar(): T[];
  editar(id: string, obj: Partial<T>): T;
  obterPorId(id: string): T;
  remover(key: string): boolean;
}

interface IPessoaService extends IService<IPessoa> {}
