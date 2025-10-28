const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Professor Teste',
        email: 'teste@edumagic.com',
        password: hashedPassword,
      },
    });
    
    console.log('Usuário teste criado:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('Usuário já existe.');
    } else {
      console.error('Erro ao criar usuário:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();