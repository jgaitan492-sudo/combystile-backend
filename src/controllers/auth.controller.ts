import type { Request, Response } from 'express';

import {
  loginUser,
  registerUser,
} from '../services/auth.service.js';

import type {
  LoginDTO,
  RegisterDTO,
} from '../types/auth.types.js';

// ==========================================
// REGISTRAR USUARIO
// ==========================================

export async function registerController(
  req: Request<{}, {}, RegisterDTO>,
  res: Response
) {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente.',
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error desconocido al registrar el usuario.';

    const messageLower = message.toLowerCase();

    const status =
      messageLower.includes('already') ||
      messageLower.includes('registered') ||
      messageLower.includes('duplicate')
        ? 409
        : 400;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}

// ==========================================
// INICIAR SESIÓN
// ==========================================

export async function loginController(
  req: Request<{}, {}, LoginDTO>,
  res: Response
) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión correcto.',
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error desconocido al iniciar sesión.';

    return res.status(401).json({
      success: false,
      message,
    });
  }
}