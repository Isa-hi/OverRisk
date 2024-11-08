import { Instagram, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="text-black bg-orange-50 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg font-semibold text-center">
            "Toma el riesgo de ser tu mismo"
          </p>
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/nuestratienda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://wa.me/34612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <Phone className="h-6 w-6" />
              <span className="sr-only">WhatsApp</span>
            </a>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} OverRisk
          </p>
        </div>
      </div>
    </footer>
  )
}