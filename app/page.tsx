import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-unison-white to-white">
      <header className="bg-unison-blue shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/unison-logo.png"
              alt="Universidad de Sonora"
              width={50}
              height={50}
              className="rounded-md"
            />
            <h1 className="text-2xl font-bold text-white">UNISON IT Support</h1>
          </div>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline" className="text-white border-white hover:bg-unison-blue/80 hover:text-white">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-unison-red hover:bg-unison-red/90 text-white">Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-unison-blue mb-4">Sistema de Soporte Técnico Centralizado</h2>
          <p className="text-xl text-slate-600">
            Una solución eficiente para gestionar y dar seguimiento a solicitudes de soporte técnico para la Facultad de
            Ciencias de la Computación.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-t-4 border-t-unison-red">
            <CardHeader>
              <CardTitle>Envío Rápido</CardTitle>
              <CardDescription>Envía tus problemas técnicos en segundos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Nuestro formulario simplificado facilita reportar problemas técnicos y obtener la ayuda que necesitas.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/tickets/new" className="w-full">
                <Button className="w-full bg-unison-red hover:bg-unison-red/90 text-white">Reportar un Problema</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-t-unison-blue">
            <CardHeader>
              <CardTitle>Seguimiento en Tiempo Real</CardTitle>
              <CardDescription>Monitorea el estado de tus tickets en vivo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Recibe actualizaciones instantáneas a medida que tu ticket avanza a través de nuestro flujo de trabajo
                de soporte.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/tickets" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-unison-blue text-unison-blue hover:bg-unison-blue/10"
                >
                  Ver Tus Tickets
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-t-4 border-t-unison-yellow">
            <CardHeader>
              <CardTitle>Base de Conocimientos</CardTitle>
              <CardDescription>Encuentra soluciones a problemas comunes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Explora nuestra extensa biblioteca de guías y soluciones para resolver rápidamente problemas comunes.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/knowledge" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-unison-yellow text-unison-brown hover:bg-unison-yellow/10"
                >
                  Explorar Soluciones
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h3 className="text-2xl font-bold text-unison-blue mb-4">Cómo Funciona</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-unison-red/10 text-unison-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Envía un Ticket</h4>
              <p className="text-sm text-slate-600">Describe tu problema en nuestro sencillo formulario</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-unison-blue/10 text-unison-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Asignación Automática</h4>
              <p className="text-sm text-slate-600">Tu ticket es dirigido al especialista adecuado</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-unison-yellow/10 text-unison-brown rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Seguimiento del Progreso</h4>
              <p className="text-sm text-slate-600">Sigue actualizaciones en tiempo real de tu solicitud</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-unison-green/10 text-unison-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h4 className="font-medium mb-2">Resolución</h4>
              <p className="text-sm text-slate-600">Recibe notificación cuando tu problema sea resuelto</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-unison-blue text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/images/unison-logo.png"
                  alt="Universidad de Sonora"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <h3 className="text-xl font-bold">UNISON IT Support</h3>
              </div>
              <p className="text-unison-white/80">Brindando soporte técnico eficiente para estudiantes y profesores.</p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/tickets/new" className="text-unison-white/80 hover:text-white">
                    Reportar un Problema
                  </Link>
                </li>
                <li>
                  <Link href="/tickets" className="text-unison-white/80 hover:text-white">
                    Mis Tickets
                  </Link>
                </li>
                <li>
                  <Link href="/knowledge" className="text-unison-white/80 hover:text-white">
                    Base de Conocimientos
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-unison-white/80 hover:text-white">
                    Contactar Soporte
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Contacto</h4>
              <address className="not-italic text-unison-white/80">
                Edificio de Ciencias de la Computación
                <br />
                Sala 301
                <br />
                soporte@cs.unison.mx
                <br />
                (662) 123-4567
              </address>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-unison-white/80">
            <p>&copy; {new Date().getFullYear()} Universidad de Sonora. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
