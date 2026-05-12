import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { usuarioModel } from '../models/usuario.model';
import { startupModel } from '../models/startup.model';
import { sessaoModel } from '../models/sessao.model';
import { hashService } from '../services/hash.service';
import { jwtService } from '../services/jwt.service';
import { emailService } from '../services/email.service';
import { auditService } from '../services/audit.service';
import { AppError } from '../middleware/error.middleware';
import { LoginDTO, RegisterDTO, ForgotPasswordDTO, ResetPasswordDTO } from '../dtos/auth.dto';
import { env } from '../config/env';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 30;
const COOKIE_NAME = 'refreshToken';

function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    domain: env.COOKIE_DOMAIN || undefined,
    path: '/',
    ...(maxAge !== undefined && { maxAge }),
  };
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body as RegisterDTO;
      const ip = req.ip;
      const ua = req.headers['user-agent'];

      // Verificar duplicatas
      const [cnpjExiste, emailCorpExiste, emailExiste] = await Promise.all([
        startupModel.findByCNPJ(data.cnpj),
        startupModel.findByEmail(data.email_corporativo),
        usuarioModel.findByEmail(data.email),
      ]);

      if (cnpjExiste) throw new AppError(409, 'CNPJ já cadastrado', 'CNPJ_DUPLICADO');
      if (emailCorpExiste) throw new AppError(409, 'Email corporativo já cadastrado', 'EMAIL_CORP_DUPLICADO');
      if (emailExiste) throw new AppError(409, 'Email pessoal já cadastrado', 'EMAIL_DUPLICADO');

      const startupId = uuidv4();
      const usuarioId = uuidv4();
      const { hash, salt } = await hashService.hash(data.senha);
      const tokenVerificacao = hashService.generateToken();
      const tokenExpira = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      await startupModel.create({
        id: startupId,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        cnpj: data.cnpj,
        email_corporativo: data.email_corporativo,
        telefone: data.telefone,
        site_url: data.site_url || undefined,
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        area_atuacao: data.area_atuacao,
        descricao_negocio: data.descricao_negocio,
        data_fundacao: data.data_fundacao,
        numero_funcionarios: data.numero_funcionarios,
        estagio_startup: data.estagio_startup,
        faturamento_anual: data.faturamento_anual,
        tipo_plano: data.tipo_plano,
      });

      await usuarioModel.create({
        id: usuarioId,
        startup_id: startupId,
        nome_completo: data.nome_completo,
        cpf: data.cpf,
        email: data.email,
        telefone_celular: data.telefone_celular,
        cargo: data.cargo,
        tipo_usuario: 'admin',
        senha_hash: hash,
        salt,
        token_verificacao: tokenVerificacao,
        token_verificacao_expira: tokenExpira,
      });

      await emailService.sendVerification(data.email, data.nome_completo, tokenVerificacao);

      await auditService.log({
        usuario_id: usuarioId,
        startup_id: startupId,
        acao: 'CADASTRO',
        descricao: 'Cadastro realizado com sucesso',
        ip_address: ip,
        user_agent: ua,
        sucesso: true,
      });

      res.status(201).json({
        mensagem: 'Cadastro realizado! Verifique seu email para ativar a conta.',
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = req.body as LoginDTO;
      const ip = req.ip;
      const ua = req.headers['user-agent'];

      const usuario = await usuarioModel.findByEmail(email);

      if (!usuario) {
        await auditService.log({
          acao: 'LOGIN_FALHA',
          descricao: `Tentativa de login com email inexistente: ${email}`,
          ip_address: ip,
          user_agent: ua,
          sucesso: false,
          codigo_erro: 'EMAIL_NAO_ENCONTRADO',
        });
        throw new AppError(401, 'Email ou senha incorretos', 'CREDENCIAIS_INVALIDAS');
      }

      if (!usuario.ativo) {
        throw new AppError(403, 'Conta desativada. Entre em contato com o suporte.', 'CONTA_INATIVA');
      }

      // Verificar bloqueio
      if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
        const minutos = Math.ceil((new Date(usuario.bloqueado_ate).getTime() - Date.now()) / 60000);
        throw new AppError(
          429,
          `Conta bloqueada por excesso de tentativas. Tente novamente em ${minutos} minuto(s).`,
          'CONTA_BLOQUEADA'
        );
      }

      const senhaCorreta = await hashService.compare(senha, usuario.senha_hash);

      if (!senhaCorreta) {
        const novasTentativas = (usuario.tentativas_login ?? 0) + 1;
        const bloqueadoAte =
          novasTentativas >= MAX_LOGIN_ATTEMPTS
            ? new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000)
            : null;

        await usuarioModel.updateLoginAttempts(usuario.id, novasTentativas, bloqueadoAte);

        await auditService.log({
          usuario_id: usuario.id,
          startup_id: usuario.startup_id,
          acao: 'LOGIN_FALHA',
          descricao: `Senha incorreta (tentativa ${novasTentativas})`,
          ip_address: ip,
          user_agent: ua,
          sucesso: false,
          codigo_erro: 'SENHA_INCORRETA',
        });

        if (bloqueadoAte) {
          throw new AppError(429, `Conta bloqueada por ${LOCK_DURATION_MINUTES} minutos.`, 'CONTA_BLOQUEADA');
        }

        throw new AppError(401, 'Email ou senha incorretos', 'CREDENCIAIS_INVALIDAS');
      }

      if (!usuario.email_verificado) {
        throw new AppError(403, 'Email não verificado. Verifique sua caixa de entrada.', 'EMAIL_NAO_VERIFICADO');
      }

      const startup = await startupModel.findById(usuario.startup_id);

      await usuarioModel.resetLoginAttempts(usuario.id);

      const { token: accessToken, jti: accessJti } = jwtService.generateAccessToken({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        tipo_usuario: usuario.tipo_usuario,
      });

      const { token: refreshToken } = jwtService.generateRefreshToken(usuario.id);
      const sessaoId = uuidv4();
      const expiresAt = jwtService.refreshExpiresAt();

      await sessaoModel.create({
        id: sessaoId,
        usuario_id: usuario.id,
        refresh_token: refreshToken,
        access_token_jti: accessJti,
        expires_at: expiresAt,
        ip_address: ip,
        user_agent: ua,
      });

      await auditService.log({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        acao: 'LOGIN',
        descricao: 'Login realizado com sucesso',
        ip_address: ip,
        user_agent: ua,
        sucesso: true,
      });

      res.cookie(COOKIE_NAME, refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

      res.json({
        accessToken,
        usuario: {
          id: usuario.id,
          nome_completo: usuario.nome_completo,
          email: usuario.email,
          cargo: usuario.cargo,
          tipo_usuario: usuario.tipo_usuario,
        },
        startup: startup
          ? {
              id: startup.id,
              nome_fantasia: startup.nome_fantasia,
              razao_social: startup.razao_social,
              cnpj: startup.cnpj,
              status_associacao: startup.status_associacao,
              tipo_plano: startup.tipo_plano,
            }
          : null,
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.[COOKIE_NAME] as string | undefined;

      if (!token) {
        throw new AppError(401, 'Refresh token não encontrado', 'REFRESH_AUSENTE');
      }

      let payload;
      try {
        payload = jwtService.verifyRefreshToken(token);
      } catch {
        res.clearCookie(COOKIE_NAME, cookieOptions());
        throw new AppError(401, 'Refresh token inválido ou expirado', 'REFRESH_INVALIDO');
      }

      const sessao = await sessaoModel.findByRefreshToken(token);
      if (!sessao) {
        res.clearCookie(COOKIE_NAME, cookieOptions());
        throw new AppError(401, 'Sessão não encontrada ou expirada', 'SESSAO_INVALIDA');
      }

      const usuario = await usuarioModel.findById(payload.usuario_id);
      if (!usuario || !usuario.ativo) {
        throw new AppError(401, 'Usuário não encontrado', 'USUARIO_INVALIDO');
      }

      const { token: newAccessToken, jti: newJti } = jwtService.generateAccessToken({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        tipo_usuario: usuario.tipo_usuario,
      });

      await sessaoModel.updateAccessTokenJti(sessao.id, newJti);

      await auditService.log({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        acao: 'TOKEN_REFRESH',
        sucesso: true,
      });

      res.json({ accessToken: newAccessToken });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.[COOKIE_NAME] as string | undefined;

      if (token) {
        const sessao = await sessaoModel.findByRefreshToken(token);
        if (sessao) {
          await sessaoModel.invalidate(sessao.id, 'logout');
          await auditService.log({
            usuario_id: sessao.usuario_id,
            acao: 'LOGOUT',
            sucesso: true,
            ip_address: req.ip,
          });
        }
      }

      res.clearCookie(COOKIE_NAME, cookieOptions());
      res.json({ mensagem: 'Logout realizado com sucesso' });
    } catch (err) {
      next(err);
    }
  },

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token as string;

      const usuario = await usuarioModel.findByVerificationToken(token);
      if (!usuario) {
        throw new AppError(400, 'Token de verificação inválido ou expirado', 'TOKEN_INVALIDO');
      }

      await usuarioModel.verifyEmail(usuario.id);

      await auditService.log({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        acao: 'VERIFICACAO_EMAIL',
        descricao: 'Email verificado com sucesso',
        sucesso: true,
      });

      res.json({ mensagem: 'Email verificado com sucesso!' });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body as ForgotPasswordDTO;

      const usuario = await usuarioModel.findByEmail(email);

      // Resposta genérica para não vazar se email existe
      const genericResponse = {
        mensagem: 'Se o email estiver cadastrado, você receberá as instruções em breve.',
      };

      if (!usuario || !usuario.ativo) {
        res.json(genericResponse);
        return;
      }

      const token = hashService.generateToken();
      const expira = new Date(Date.now() + 60 * 60 * 1000); // 1h

      await usuarioModel.setResetToken(usuario.id, token, expira);
      await emailService.sendPasswordReset(usuario.email, usuario.nome_completo, token);

      await auditService.log({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        acao: 'RECUPERACAO_SENHA',
        descricao: 'Solicitação de recuperação de senha',
        ip_address: req.ip,
        sucesso: true,
      });

      res.json(genericResponse);
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, senha } = req.body as ResetPasswordDTO;

      const usuario = await usuarioModel.findByResetToken(token);
      if (!usuario) {
        throw new AppError(400, 'Token de recuperação inválido ou expirado', 'TOKEN_INVALIDO');
      }

      const { hash, salt } = await hashService.hash(senha);

      await usuarioModel.updatePassword(usuario.id, hash, salt);
      await sessaoModel.invalidateAllForUser(usuario.id, 'reset_senha');

      await auditService.log({
        usuario_id: usuario.id,
        startup_id: usuario.startup_id,
        acao: 'ALTERACAO_SENHA',
        descricao: 'Senha redefinida via token de recuperação',
        ip_address: req.ip,
        sucesso: true,
      });

      res.clearCookie(COOKIE_NAME, cookieOptions());
      res.json({ mensagem: 'Senha redefinida com sucesso. Faça login novamente.' });
    } catch (err) {
      next(err);
    }
  },
};
