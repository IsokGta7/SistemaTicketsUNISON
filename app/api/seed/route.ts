import { NextResponse } from "next/server"
import { hash } from "bcrypt"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Verificar si ya existen usuarios para evitar duplicados
    const userCount = await prisma.user.count()

    if (userCount > 0) {
      return NextResponse.json({ message: "La base de datos ya ha sido inicializada" })
    }

    // Crear usuarios de prueba
    const hashedPassword = await hash("password123", 10)

    const admin = await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "UNISON",
        email: "admin@unison.mx",
        password: hashedPassword,
        role: "admin",
      },
    })

    const tecnico = await prisma.user.create({
      data: {
        firstName: "Técnico",
        lastName: "Soporte",
        email: "tecnico@unison.mx",
        password: hashedPassword,
        role: "tecnico",
      },
    })

    const profesor = await prisma.user.create({
      data: {
        firstName: "Profesor",
        lastName: "Ejemplo",
        email: "profesor@unison.mx",
        password: hashedPassword,
        role: "profesor",
      },
    })

    const estudiante = await prisma.user.create({
      data: {
        firstName: "Estudiante",
        lastName: "Ejemplo",
        email: "estudiante@unison.mx",
        password: hashedPassword,
        role: "estudiante",
      },
    })

    // Crear tickets de ejemplo
    const tickets = await Promise.all([
      prisma.ticket.create({
        data: {
          title: "No puedo acceder a la impresora del departamento",
          description:
            "Estoy intentando imprimir documentos en la impresora compartida del departamento de Ciencias de la Computación (HP LaserJet 4350 en Sala 301), pero mi computadora no encuentra la impresora. He intentado reiniciar mi computadora y verificar la conexión de red, pero nada parece funcionar.",
          status: "in_progress",
          priority: "medium",
          category: "Hardware",
          creatorId: profesor.id,
          assigneeId: tecnico.id,
        },
      }),
      prisma.ticket.create({
        data: {
          title: "El correo no se sincroniza en mi dispositivo móvil",
          description:
            "No puedo recibir correos en la aplicación de correo de mi teléfono. He verificado mi configuración y parece estar correcta. Funciona bien en mi computadora pero no en el móvil.",
          status: "new",
          priority: "high",
          category: "Email",
          creatorId: estudiante.id,
        },
      }),
      prisma.ticket.create({
        data: {
          title: "Solicitud de instalación de software",
          description:
            "Necesito que se instale MATLAB en mi computadora del laboratorio para un proyecto de investigación.",
          status: "assigned",
          priority: "low",
          category: "Software",
          creatorId: profesor.id,
          assigneeId: tecnico.id,
        },
      }),
    ])

    // Añadir comentarios a los tickets
    await prisma.comment.create({
      data: {
        content:
          "He revisado la impresora y parece que hay un problema con el servidor de impresión. Estoy trabajando en solucionarlo.",
        ticketId: tickets[0].id,
        userId: tecnico.id,
      },
    })

    await prisma.comment.create({
      data: {
        content: "Gracias por la actualización. ¿Cuándo crees que estará resuelto?",
        ticketId: tickets[0].id,
        userId: profesor.id,
      },
    })

    // Añadir entradas al historial
    await prisma.ticketHistory.create({
      data: {
        action: "Ticket creado",
        ticketId: tickets[0].id,
        userId: profesor.id,
      },
    })

    await prisma.ticketHistory.create({
      data: {
        action: "Ticket asignado a Técnico Soporte",
        ticketId: tickets[0].id,
        userId: admin.id,
      },
    })

    await prisma.ticketHistory.create({
      data: {
        action: 'Estado cambiado a "in_progress"',
        ticketId: tickets[0].id,
        userId: tecnico.id,
      },
    })

    // Crear notificaciones
    await prisma.notification.create({
      data: {
        title: "Ticket asignado",
        description: 'Se te ha asignado un nuevo ticket: "No puedo acceder a la impresora del departamento"',
        userId: tecnico.id,
      },
    })

    await prisma.notification.create({
      data: {
        title: "Actualización de ticket",
        description: 'Tu ticket "No puedo acceder a la impresora del departamento" ha sido actualizado',
        userId: profesor.id,
      },
    })

    return NextResponse.json({
      message: "Base de datos inicializada correctamente",
      data: {
        users: [admin, tecnico, profesor, estudiante],
        tickets,
      },
    })
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return NextResponse.json({ message: "Error al inicializar la base de datos" }, { status: 500 })
  }
}
