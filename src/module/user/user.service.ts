import { PrismaClient } from "@prisma/client"

export class UserService {
    constructor(private prisma = new PrismaClient()) { }

    async createUser(
        cpf: string,
        nome: string,
        email: string,
        telefone: string
    ) {
        return await this.getUser(cpf)
            .then(async (user) => {
                if (!user) {
                    return await this.prisma.user.create({
                        data: {
                            cpf: cpf,
                            nome: nome,
                            email: email,
                            telefone: telefone
                        }
                    })
                        .then((result) => result)
                        .catch((error) => console.log(error))
                } else {
                    throw new Error('Usuário já existe na base de dados!')
                }
            })
            .catch((error) => console.log(error))
    }

    async getUser(cpf: string) {
        const user = await this.prisma.user.findUnique({ where: { cpf: cpf } })
            .then((result) => result)
            .catch((error) => console.error(error))
        console.log('userService: ', user);
        return user;
    }


    async updateUser(cpf: string,
        nome: string,
        email: string,
        telefone: string) {
        return await this.getUser(cpf)
            .then(async (user) => {
                if (!user) {
                    throw new Error('Usuário não encontrado!')
                } else {
                    return await this.prisma.user.update({
                        where: { cpf },
                        data: { nome, email, telefone }
                    })
                        .then((result) => result)
                        .catch((error) => console.log(error))
                }
            })
            .catch((error) => console.log(error))
    }

    async deleteUser(cpf: string) {
        return await this.getUser(cpf)
            .then(async (user) => {
                if (!user) {
                    throw new Error('Usuário não encontrado!')
                } else {
                    return await this.prisma.user.delete({
                        where: {
                            cpf: cpf
                        }
                    })
                        .then((result) => result)
                        .catch((error) => console.log(error))
                }
            })
            .catch((error) => console.log(error))
    }

}