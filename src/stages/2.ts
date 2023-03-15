import { stageInterface } from "../interfaces/stageInterface";
import { storage } from "../storage";
import { userOptions } from "../responses/userOptions";
import { register } from "../responses/register";
import { successRegister } from "../responses/successRegister";
import { UserService } from '../module/user/user.service';
import { cpf } from 'cpf-cnpj-validator';

let returnMessage;
let userData;
const userService = new UserService();

export const stageTwo = {
  removeFirstAndLastSpace(stringArray: string[]): string[] {
    const result: string[] = [];
    stringArray.forEach((str: string) => {
      result.push(str.trim());
    });
    return result
  },

  validateUser(exec: stageInterface): boolean {
    userData = exec.message.split(',');
    userData = this.removeFirstAndLastSpace(userData);
    if (userData.length < 4) {//validação dos dados
      returnMessage = '❌ *Dados faltantes.* ❌\n' + register;
      return false
    } else if (!cpf.isValid(userData[0].replace(/[^a-zA-Z0-9]/g, ''))) {//validação de CPF/Remoção de caracteres especiais
      returnMessage = '❌ *CPF inválido.* ❌\n' + register;
      return false
    } else {
      return true;
    }
  },
  
  async exec(exec: stageInterface): Promise<string> {
    const validate = this.validateUser(exec)
    if (validate) {
      return await userService.createUser(userData[0], userData[1], userData[2], userData[3])
        .then(() => {
          storage[exec.from].stage = 6;
          return successRegister + userOptions;
        })
        .catch((error) => {
          storage[exec.from].stage = 2;
          return '❌ Usuário já existe na base de dados! ❌\n' + register;
        })
    } else {
      storage[exec.from].stage = 2;
      return returnMessage;
    }
  }
};
