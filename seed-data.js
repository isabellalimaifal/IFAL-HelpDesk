import { supabase } from './supabase-config.js';

async function seedData() {
    console.log('Starting to seed fake data...');

    // First, create fake users if they don't exist
    const fakeUsers = [
        { nome: 'João Silva', email: 'joao.silva@ifal.edu.br', regra: 'tecnico' },
        { nome: 'Maria Santos', email: 'maria.santos@ifal.edu.br', regra: 'administrador' },
        { nome: 'Pedro Oliveira', email: 'pedro.oliveira@ifal.edu.br', regra: 'tecnico' },
        { nome: 'Ana Costa', email: 'ana.costa@ifal.edu.br', regra: 'tecnico' },
        { nome: 'Carlos Lima', email: 'carlos.lima@ifal.edu.br', regra: 'tecnico' },
        { nome: 'Lucas Pereira', email: 'lucas.pereira@aluno.ifal.edu.br', regra: 'aluno' },
        { nome: 'Julia Ferreira', email: 'julia.ferreira@aluno.ifal.edu.br', regra: 'aluno' },
        { nome: 'Rafael Souza', email: 'rafael.souza@aluno.ifal.edu.br', regra: 'aluno' },
        { nome: 'Fernanda Rodrigues', email: 'fernanda.rodrigues@aluno.ifal.edu.br', regra: 'aluno' },
        { nome: 'Bruno Almeida', email: 'bruno.almeida@aluno.ifal.edu.br', regra: 'aluno' }
    ];

    const insertedUsers = [];
    for (const user of fakeUsers) {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', user.email)
            .single();

        if (existingUser) {
            console.log('User already exists:', user.email);
            insertedUsers.push(existingUser);
            continue;
        }

        // Insert user directly into usuarios table (skip auth for seeding)
        const { data: userData, error: userError } = await supabase
            .from('usuarios')
            .insert([{
                nome: user.nome,
                email: user.email,
                regra: user.regra
            }])
            .select()
            .single();

        if (userError) {
            console.error('Error inserting user:', userError);
        } else {
            console.log('Created user:', user.nome);
            insertedUsers.push(userData);
        }
    }

    if (insertedUsers.length === 0) {
        console.error('No users created or found.');
        return;
    }

    const tecnicos = insertedUsers.filter(u => u && (u.regra === 'tecnico' || u.regra === 'administrador'));
    const solicitantes = insertedUsers.filter(u => u && (u.regra === 'aluno' || u.regra === 'tecnico' || u.regra === 'administrador'));

    if (solicitantes.length === 0) {
        console.error('No requesters found.');
        return;
    }

    // Fake tickets data
    const fakeTickets = [
        {
            titulo: 'Computador do laboratório 3 não liga',
            descricao_detalhada: 'O computador do laboratório 3 não está ligando. Já verifiquei a tomada e o cabo de energia, mas parece ser um problema interno.',
            categoria: 'Hardware',
            prioridade: 'Alta',
            status: 'Aberto',
            solicitante_id: solicitantes[0].id,
            tecnico_id: tecnicos.length > 0 ? tecnicos[0].id : null
        },
        {
            titulo: 'Wi-Fi do bloco B está lento',
            descricao_detalhada: 'O Wi-Fi no bloco B está muito lento nos últimos dias. Dificulta o acesso ao SIGAA e outras plataformas.',
            categoria: 'Rede',
            prioridade: 'Média',
            status: 'Em progresso',
            solicitante_id: solicitantes[1]?.id || solicitantes[0].id,
            tecnico_id: tecnicos.length > 1 ? tecnicos[1].id : tecnicos[0]?.id
        },
        {
            titulo: 'Não consigo acessar o SIGAA',
            descricao_detalhada: 'Tento acessar o SIGAA mas aparece erro de login. Já tentei recuperar a senha mas não recebi o e-mail.',
            categoria: 'Software',
            prioridade: 'Alta',
            status: 'Aberto',
            solicitante_id: solicitantes[2]?.id || solicitantes[0].id,
            tecnico_id: tecnicos.length > 2 ? tecnicos[2].id : tecnicos[0]?.id
        },
        {
            titulo: 'Impressora do setor não está funcionando',
            descricao_detalhada: 'A impressora do setor de RH não está imprimindo. A luz de erro está piscando em laranja.',
            categoria: 'Hardware',
            prioridade: 'Média',
            status: 'Resolvido',
            solicitante_id: solicitantes[3]?.id || solicitantes[0].id,
            tecnico_id: tecnicos.length > 3 ? tecnicos[3].id : tecnicos[0]?.id
        },
        {
            titulo: 'Solicitação de instalação do VS Code',
            descricao_detalhada: 'Preciso do VS Code instalado no meu computador para desenvolvimento de projetos da disciplina.',
            categoria: 'Software',
            prioridade: 'Baixa',
            status: 'Em progresso',
            solicitante_id: solicitantes[4]?.id || solicitantes[0].id,
            tecnico_id: tecnicos.length > 4 ? tecnicos[4].id : tecnicos[0]?.id
        },
        {
            titulo: 'Problema com acesso à rede VPN',
            descricao_detalhada: 'Não consigo conectar na VPN do IFAL quando estou em casa. O erro é "conexão recusada".',
            categoria: 'Rede',
            prioridade: 'Alta',
            status: 'Aberto',
            solicitante_id: solicitantes[0].id,
            tecnico_id: tecnicos[0]?.id
        },
        {
            titulo: 'Monitor do laboratório 1 com tela quebrada',
            descricao_detalhada: 'O monitor do computador 5 no laboratório 1 tem uma linha vertical na tela que atrapalha a visualização.',
            categoria: 'Hardware',
            prioridade: 'Média',
            status: 'Resolvido',
            solicitante_id: solicitantes[1]?.id || solicitantes[0].id,
            tecnico_id: tecnicos[1]?.id || tecnicos[0]?.id
        },
        {
            titulo: 'Erro ao fazer matrícula online',
            descricao_detalhada: 'Ao tentar fazer matrícula online no SIGAA, aparece erro 500. Tentei em diferentes navegadores.',
            categoria: 'Software',
            prioridade: 'Alta',
            status: 'Aberto',
            solicitante_id: solicitantes[2]?.id || solicitantes[0].id,
            tecnico_id: tecnicos[2]?.id || tecnicos[0]?.id
        }
    ];

    // Insert fake tickets
    const insertedTickets = [];
    for (const ticket of fakeTickets) {
        const { data, error } = await supabase
            .from('chamados')
            .insert([ticket])
            .select();

        if (error) {
            console.error('Error inserting ticket:', error);
        } else {
            console.log('Inserted ticket:', ticket.titulo);
            insertedTickets.push(data[0]);
        }
    }

    // Fake comments data
    const fakeComments = [
        {
            chamado_id: insertedTickets[0]?.id,
            usuario_id: tecnicos[0]?.id,
            mensagem: 'Vou verificar o computador assim que possível. Pode informar qual laboratório exatamente?'
        },
        {
            chamado_id: insertedTickets[0]?.id,
            usuario_id: solicitantes[0]?.id,
            mensagem: 'É o laboratório 3, computador número 7. Obrigado!'
        },
        {
            chamado_id: insertedTickets[1]?.id,
            usuario_id: tecnicos[1]?.id,
            mensagem: 'Estamos verificando o roteador do bloco B. Parece que há muitos dispositivos conectados.'
        },
        {
            chamado_id: insertedTickets[2]?.id,
            usuario_id: tecnicos[2]?.id,
            mensagem: 'Verifiquei seu cadastro no SIGAA. O e-mail estava incorreto. Já corrigi, tente novamente.'
        },
        {
            chamado_id: insertedTickets[3]?.id,
            usuario_id: tecnicos[3]?.id,
            mensagem: 'Substituí o cartucho da impressora. Está funcionando normalmente agora.'
        },
        {
            chamado_id: insertedTickets[4]?.id,
            usuario_id: solicitantes[4]?.id,
            mensagem: 'Obrigado pela instalação do VS Code!'
        },
        {
            chamado_id: insertedTickets[4]?.id,
            usuario_id: tecnicos[4]?.id,
            mensagem: 'De nada! Qualquer dúvida sobre o VS Code, é só chamar.'
        },
        {
            chamado_id: insertedTickets[5]?.id,
            usuario_id: tecnicos[0]?.id,
            mensagem: 'A VPN está passando por manutenção. Deve voltar a funcionar em breve.'
        },
        {
            chamado_id: insertedTickets[6]?.id,
            usuario_id: tecnicos[1]?.id,
            mensagem: 'Monitor substituído. O problema estava na placa de vídeo.'
        },
        {
            chamado_id: insertedTickets[7]?.id,
            usuario_id: solicitantes[2]?.id,
            mensagem: 'Ainda está dando erro. Quando será resolvido?'
        }
    ];

    // Insert fake comments
    for (const comment of fakeComments) {
        if (!comment.chamado_id || !comment.usuario_id) continue;

        const { error } = await supabase
            .from('comentarios')
            .insert([comment]);

        if (error) {
            console.error('Error inserting comment:', error);
        } else {
            console.log('Inserted comment for ticket:', comment.chamado_id);
        }
    }

    console.log('Fake data seeding completed!');
}

seedData().catch(console.error);
