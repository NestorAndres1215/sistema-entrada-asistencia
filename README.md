# Sistema de Asistencia con QR

## Tipo de Proyecto
Sistema web de control de asistencia para colegios o academias, con registro mediante QR o manual, desarrollado con **NestJS** y **React**.

## Objetivo
Permitir registrar la asistencia de alumnos de manera rápida y confiable, evitando duplicados en un periodo de 24 horas, y generando reportes simples para el personal administrativo.

## Descripción
Este proyecto consta de un **backend en NestJS** con **TypeORM** y **MySQL**, y un **frontend en React** con **Vite**.  
El sistema permite:

- Registrar asistencia por **QR** o **manual**.
- Validar que un alumno no se registre más de una vez en 24 horas.
- Guardar información de fecha, hora, tipo de registro y estado de asistencia.
- Mostrar mensajes claros de error o confirmación al usuario.

---

## Dependencias

### Backend (NestJS)
- `@nestjs/common`, `@nestjs/core`, `@nestjs/typeorm`
- `typeorm`
- `mysql2`
- `class-validator`, `class-transformer`
- `jsonwebtoken` (si se implementa autenticación JWT)
- `dotenv`

### Frontend (React)
- `react`
- `react-dom`
- `react-qr-reader`
- `axios`
- `vite`

---

## Tecnologías utilizadas
- **NestJS**: para la arquitectura del backend y manejo de rutas, servicios y controladores.
- **TypeORM**: ORM para manejo de base de datos MySQL.
- **MySQL**: base de datos relacional.
- **React + Vite**: frontend moderno y rápido.
- **React QR Reader**: para escanear códigos QR desde la cámara del dispositivo.
- **JWT**: para autenticación opcional de usuarios.
- **Class-validator**: para validaciones de DTOs en el backend.

---
