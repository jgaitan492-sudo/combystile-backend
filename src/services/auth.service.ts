import { supabaseAdmin, supabaseAuth } from '../config/supabase.js';
import type { LoginDTO, RegisterDTO } from '../types/auth.types.js';

// ==========================================
// REGISTRAR USUARIO
// ==========================================

export async function registerUser(data: RegisterDTO) {
  const nombre = data.nombre.trim();
  const correo = data.correo.trim().toLowerCase();
  const password = data.password;

  if (nombre.length < 2) {
    throw new Error(
      'El nombre debe tener al menos 2 caracteres.'
    );
  }

  if (!correo) {
    throw new Error(
      'El correo es obligatorio.'
    );
  }

  if (password.length < 6) {
    throw new Error(
      'La contraseña debe tener al menos 6 caracteres.'
    );
  }

  // Crear usuario en Supabase Auth
  const {
    data: authData,
    error: authError,
  } = await supabaseAuth.auth.signUp({
    email: correo,
    password,
    options: {
      data: {
        nombre,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error(
      'Supabase no devolvió el usuario creado.'
    );
  }

  const userId = authData.user.id;

  // Crear perfil en la tabla usuarios
  const {
    data: profile,
    error: profileError,
  } = await supabaseAdmin
    .from('usuarios')
    .insert({
      id_usuario: userId,
      nombre,
      correo,
      fecha_registro: new Date().toISOString(),
    })
    .select(
      'id_usuario, nombre, correo, fecha_registro'
    )
    .single();

  // Si falla la creación del perfil,
  // eliminamos también el usuario de Auth
  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);

    throw new Error(
      `No se pudo crear el perfil: ${profileError.message}`
    );
  }

  return {
    usuario: profile,
    requiereConfirmacionCorreo:
      authData.session === null,
  };
}

// ==========================================
// INICIAR SESIÓN
// ==========================================

export async function loginUser(data: LoginDTO) {
  const correo = data.correo.trim().toLowerCase();
  const password = data.password;

  if (!correo || !password) {
    throw new Error(
      'El correo y la contraseña son obligatorios.'
    );
  }

  // Autenticar usuario
  const {
    data: authData,
    error: authError,
  } = await supabaseAuth.auth.signInWithPassword({
    email: correo,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user || !authData.session) {
    throw new Error(
      'No fue posible crear la sesión.'
    );
  }

  // Consultar datos del usuario
  const {
    data: profile,
    error: profileError,
  } = await supabaseAdmin
    .from('usuarios')
    .select(
      'id_usuario, nombre, correo, fecha_registro'
    )
    .eq(
      'id_usuario',
      authData.user.id
    )
    .single();

  if (profileError) {
    throw new Error(
      `No se pudo consultar el perfil: ${profileError.message}`
    );
  }

  return {
    usuario: profile,

    sesion: {
      accessToken:
        authData.session.access_token,

      refreshToken:
        authData.session.refresh_token,

      expiresIn:
        authData.session.expires_in,

      expiresAt:
        authData.session.expires_at,

      tokenType:
        authData.session.token_type,
    },
  };
}