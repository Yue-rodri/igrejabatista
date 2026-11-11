import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config'; 

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('Iniciando o Seed de dados...');
  
  const adminEmail = 'admin@ibpj.com';
  const adminPassword = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    
    
    update: { 
      role: 'DESENVOLVEDOR', 
      full_name: 'Admin IBPJ (DEV)',
      password: hashedPassword 
    },
    
    create: {
      email: adminEmail,
      password: hashedPassword,
      full_name: 'Admin IBPJ (DEV)',
      role: 'DESENVOLVEDOR',
      data_nascimento: new Date('1990-01-01'),
      show_in_aniversariantes: true
    },
  });

  console.log(`✅ Usuário DESENVOLVEDOR criado/atualizado: ${adminUser.email}`);
  console.log('   Use a senha: adminpassword123 para login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });