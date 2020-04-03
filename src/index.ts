import 'reflect-metadata';

import { UoW } from './ioc/UoW';

for (let i = 0; i < 3; i++) {
  const instance = new UoW();

  if (instance.pessoa) {
    instance.pessoa.adicionar({
      email: 'email@teste',
      nome: 'willian'
    });
  }
  console.log(instance);
}
