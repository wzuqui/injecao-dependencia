import 'reflect-metadata';
import {
  autoInjectable,
  inject,
  registry,
  instanceCachingFactory
} from 'tsyringe';
import { PessoaRepository } from '../repositories/PessoaRepository';
import { PessoaService } from '../services/PessoaService';

@registry([
  {
    token: 'IPessoaRepository',
    useFactory: instanceCachingFactory<IPessoaRepository>(c =>
      c.resolve(PessoaRepository)
    )
  },
  { token: 'IPessoaService', useClass: PessoaService }
])
@autoInjectable()
export class UoW {
  constructor(@inject('IPessoaService') public pessoa?: IPessoaService) {}
}
